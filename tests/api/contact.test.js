import { beforeEach, describe, expect, it, vi } from "vitest";

const createMessage = vi.fn();
const sendEmail = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: { message: { create: createMessage } },
}));

vi.mock("resend", () => ({
  Resend: class {
    constructor(apiKey) {
      this.apiKey = apiKey;
      this.emails = { send: sendEmail };
    }
  },
}));

const { POST } = await import("@/app/api/contact/route");

// The route rate limits per client IP, so every request gets a fresh one
// unless a test is deliberately exercising the limit.
let ipCounter = 0;
const nextIp = () => `203.0.113.${++ipCounter % 254}`;

const request = (body, ip = nextIp()) => ({
  headers: new Headers({ "x-forwarded-for": ip }),
  json: async () => {
    if (typeof body === "function") return body();
    return body;
  },
});

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello there",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("CONTACT_EMAIL", "owner@example.com");
    createMessage.mockResolvedValue({ id: "msg_1" });
    sendEmail.mockResolvedValue({ error: null });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 500 when RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const res = await POST(request(validBody));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Server configuration error." });
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("returns 500 when CONTACT_EMAIL is missing", async () => {
    vi.stubEnv("CONTACT_EMAIL", "");

    const res = await POST(request(validBody));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Server configuration error." });
  });

  it.each([
    ["name", { ...validBody, name: "" }],
    ["email", { ...validBody, email: "" }],
    ["message", { ...validBody, message: "" }],
  ])("returns 400 when %s is empty", async (_field, body) => {
    const res = await POST(request(body));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "All fields are required" });
    expect(createMessage).not.toHaveBeenCalled();
  });

  it.each([
    "not-an-email",
    "missing@domain",
    "spaces @example.com",
    "@example.com",
    " padded@example.com ",
  ])(
    "returns 400 for invalid email %s",
    async (email) => {
      const res = await POST(request({ ...validBody, email }));

      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({
        error: "Please enter a valid email address",
      });
    }
  );

  it("saves a sanitized message and sends the email", async () => {
    const res = await POST(
      request({
        name: "  <b>Ada</b> Lovelace  ",
        email: "ada@example.com",
        message: "  <script>alert(1)</script>Hi  ",
      })
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      message: "Message sent successfully!",
    });

    expect(createMessage).toHaveBeenCalledWith({
      data: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "alert(1)Hi",
      },
    });

    const emailArgs = sendEmail.mock.calls[0][0];
    expect(emailArgs.to).toBe("owner@example.com");
    expect(emailArgs.replyTo).toBe("ada@example.com");
    expect(emailArgs.subject).toBe("New message from Ada Lovelace");
    expect(emailArgs.html).toContain("ada@example.com");
  });

  it("truncates over-long fields before persisting", async () => {
    await POST(
      request({
        name: "n".repeat(150),
        email: `${"e".repeat(250)}@example.com`,
        message: "m".repeat(2500),
      })
    );

    const { data } = createMessage.mock.calls[0][0];
    expect(data.name).toHaveLength(100);
    expect(data.email).toHaveLength(200);
    expect(data.message).toHaveLength(2000);
  });

  it("still reports success when email delivery fails", async () => {
    sendEmail.mockResolvedValue({ error: { message: "rate limited" } });

    const res = await POST(request(validBody));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      message: "Message saved! Email delivery may be delayed.",
    });
    expect(createMessage).toHaveBeenCalledTimes(1);
  });

  it("returns 500 when the database write throws", async () => {
    createMessage.mockRejectedValue(new Error("db down"));

    const res = await POST(request(validBody));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Could not save your message. Please try again later.",
    });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 when the request body is not valid JSON", async () => {
    const res = await POST(
      request(() => {
        throw new SyntaxError("Unexpected token");
      })
    );

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it("pretends to succeed but drops the message when the honeypot is filled", async () => {
    const res = await POST(request({ ...validBody, company: "Acme Inc" }));

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      success: true,
      message: "Message sent successfully!",
    });
    expect(createMessage).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("rate limits a burst of requests from the same IP", async () => {
    const ip = "198.51.100.7";
    const statuses = [];

    for (let i = 0; i < 5; i++) {
      statuses.push((await POST(request(validBody, ip))).status);
    }

    expect(statuses.slice(0, 3)).toEqual([200, 200, 200]);
    expect(statuses.slice(3)).toEqual([429, 429]);
    await expect(
      POST(request(validBody, ip)).then((res) => res.json())
    ).resolves.toEqual({
      error: "Too many requests. Please try again in a minute.",
    });
  });
});
