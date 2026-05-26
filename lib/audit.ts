import { v4 as uuidv4 } from "uuid";
import type { AuditEvent } from "./types";
import { hashString } from "./signing";

export async function createAuditEvent(params: {
  type: AuditEvent["type"];
  actor: string;
  payload: unknown;
  previousHash: string;
}): Promise<AuditEvent> {
  const timestamp = new Date().toISOString();
  const payloadHash = await hashString(JSON.stringify(params.payload));

  const eventMaterial = JSON.stringify({
    id: "pending",
    timestamp,
    type: params.type,
    actor: params.actor,
    payloadHash,
    previousHash: params.previousHash,
  });

  const eventHash = await hashString(eventMaterial);

  return {
    id: uuidv4(),
    timestamp,
    type: params.type,
    actor: params.actor,
    payloadHash,
    previousHash: params.previousHash,
    eventHash,
  };
}

export async function createDemoAuditLog(payloads: {
  issuanceRequest: unknown;
  credentialOffer: unknown;
  signedCredential: unknown;
  signedPresentation: unknown;
  verificationResult: unknown;
}): Promise<AuditEvent[]> {
  const events: AuditEvent[] = [];
  let previousHash = "GENESIS";

  const issuanceEvent = await createAuditEvent({
    type: "issuance_transaction_created",
    actor: "Simulated HPR Source",
    payload: payloads.issuanceRequest,
    previousHash,
  });
  events.push(issuanceEvent);
  previousHash = issuanceEvent.eventHash;

  const offerEvent = await createAuditEvent({
    type: "credential_offer_created",
    actor: "Healthcare Authorisation Issuer",
    payload: payloads.credentialOffer,
    previousHash,
  });
  events.push(offerEvent);
  previousHash = offerEvent.eventHash;

  const credentialEvent = await createAuditEvent({
    type: "credential_issued",
    actor: "Healthcare Authorisation Issuer",
    payload: payloads.signedCredential,
    previousHash,
  });
  events.push(credentialEvent);
  previousHash = credentialEvent.eventHash;

  const presentationEvent = await createAuditEvent({
    type: "presentation_created",
    actor: "Clinician Wallet",
    payload: payloads.signedPresentation,
    previousHash,
  });
  events.push(presentationEvent);
  previousHash = presentationEvent.eventHash;

  const verificationEvent = await createAuditEvent({
    type: "verification_performed",
    actor: "Healthcare Verifier",
    payload: payloads.verificationResult,
    previousHash,
  });
  events.push(verificationEvent);

  return events;
}

export function verifyAuditChain(events: AuditEvent[]): boolean {
  if (events.length === 0) return true;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];

    if (index === 0 && event.previousHash !== "GENESIS") {
      return false;
    }

    if (index > 0 && event.previousHash !== events[index - 1].eventHash) {
      return false;
    }
  }

  return true;
}
