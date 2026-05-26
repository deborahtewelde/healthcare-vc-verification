import type {
  AuditEvent,
  HealthcareDocumentType,
  SignedCredential,
  SignedPresentation,
  VerificationResult,
  VerifierId,
} from "./types";
import { hprSourceRecords } from "./mockData";
import { generateLocalKeyPair } from "./signing";
import { issueSignedCredential } from "./credential";
import { createProofRequest, createSignedPresentation } from "./presentation";
import { verifyHealthcarePresentation } from "./verifier";
import { createDemoAuditLog } from "./audit";

export interface DemoFlowResult {
  issuerKeys: {
    publicJwk: JsonWebKey;
    privateJwk: JsonWebKey;
  };
  holderKeys: {
    publicJwk: JsonWebKey;
    privateJwk: JsonWebKey;
  };
  signedCredential: SignedCredential;
  signedPresentation: SignedPresentation;
  verificationResult: VerificationResult;
  auditLog: AuditEvent[];
}

export async function runDemoFlow(params?: {
  subjectIdentifier?: string;
  verifier?: VerifierId;
  requestedDocumentType?: HealthcareDocumentType;
}): Promise<DemoFlowResult> {
  const subjectIdentifier = params?.subjectIdentifier ?? "clinician-001";
  const verifier = params?.verifier ?? "hospital";
  const requestedDocumentType = params?.requestedDocumentType ?? "referral";

  const hprRecord = hprSourceRecords.find(
    (record) => record.subjectIdentifier === subjectIdentifier,
  );

  if (!hprRecord) {
    throw new Error(`No HPR source record found for ${subjectIdentifier}`);
  }

  const issuerKeys = await generateLocalKeyPair();
  const holderKeys = await generateLocalKeyPair();

  const { issuanceRequest, credentialOffer, signedCredential } =
    await issueSignedCredential(hprRecord, issuerKeys.privateJwk);

  const proofRequest = createProofRequest(verifier, requestedDocumentType);

  const signedPresentation = await createSignedPresentation(
    signedCredential,
    proofRequest,
    hprRecord.subjectIdentifier,
    holderKeys.privateJwk,
  );

  const verificationResult = await verifyHealthcarePresentation({
    signedPresentation,
    holderPublicJwk: holderKeys.publicJwk,
    issuerPublicJwk: issuerKeys.publicJwk,
    proofRequest,
  });

  const auditLog = await createDemoAuditLog({
    issuanceRequest,
    credentialOffer,
    signedCredential,
    signedPresentation,
    verificationResult,
  });

  return {
    issuerKeys,
    holderKeys,
    signedCredential,
    signedPresentation,
    verificationResult,
    auditLog,
  };
}
