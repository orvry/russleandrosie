import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const STATUS_COOKIE_NAME = "rsvp_status_session";
export const STATUS_SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getStatusPassword() {
  return process.env.RSVP_STATUS_PASSWORD;
}

function getSessionSecret() {
  return process.env.RSVP_STATUS_SESSION_SECRET;
}

export function isStatusAuthConfigured() {
  const password = getStatusPassword();
  const sessionSecret = getSessionSecret();

  return Boolean(
    password &&
      password.length >= 12 &&
      sessionSecret &&
      Buffer.byteLength(sessionSecret) >= 32,
  );
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function verifyStatusPassword(candidate: string) {
  const password = getStatusPassword();
  return Boolean(
    password &&
      candidate.length <= 1024 &&
      constantTimeEqual(candidate, password),
  );
}

function sign(expiration: string) {
  const sessionSecret = getSessionSecret();

  if (!sessionSecret) {
    throw new Error("RSVP status session secret is not configured.");
  }

  return createHmac("sha256", sessionSecret)
    .update(expiration)
    .digest("hex");
}

export function createStatusSession() {
  const expiresAt =
    Math.floor(Date.now() / 1000) + STATUS_SESSION_DURATION_SECONDS;
  const expiration = String(expiresAt);

  return {
    value: `${expiration}.${sign(expiration)}`,
    expiresAt,
  };
}

export function isValidStatusSession(value: string | undefined) {
  if (!value || !isStatusAuthConfigured()) {
    return false;
  }

  const [expiration, signature, extra] = value.split(".");
  if (
    extra !== undefined ||
    !expiration ||
    !signature ||
    !/^\d{10}$/.test(expiration) ||
    !/^[\da-f]{64}$/.test(signature) ||
    Number(expiration) <= Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  return constantTimeEqual(signature, sign(expiration));
}
