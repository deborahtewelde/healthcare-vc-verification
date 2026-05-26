import {
  SignJWT,
  jwtVerify,
  importJWK,
  exportJWK,
  generateKeyPair,
} from "jose";

export interface LocalKeyPair {
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
}

export async function generateLocalKeyPair(): Promise<LocalKeyPair> {
  const { publicKey, privateKey } = await generateKeyPair("ES256", {
    extractable: true,
  });

  const publicJwk = await exportJWK(publicKey);
  const privateJwk = await exportJWK(privateKey);

  return {
    publicJwk,
    privateJwk,
  };
}

export async function signPayload(
  payload: Record<string, unknown>,
  privateJwk: JsonWebKey,
  issuer: string,
): Promise<string> {
  const privateKey = await importJWK(privateJwk, "ES256");

  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "ES256",
      typ: "JWT",
    })
    .setIssuer(issuer)
    .setIssuedAt()
    .setExpirationTime("1y")
    .sign(privateKey);
}

export async function verifyJwt(
  jwt: string,
  publicJwk: JsonWebKey,
  expectedIssuer?: string,
): Promise<{
  valid: boolean;
  payload?: Record<string, unknown>;
  error?: string;
}> {
  try {
    const publicKey = await importJWK(publicJwk, "ES256");

    const result = await jwtVerify(jwt, publicKey, {
      issuer: expectedIssuer,
    });

    return {
      valid: true,
      payload: result.payload as Record<string, unknown>,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Unknown verification error",
    };
  }
}

export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
