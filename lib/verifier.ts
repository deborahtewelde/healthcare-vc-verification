import type {
  HealthcareDocumentType,
  HealthcareProfessionalAuthorisationCredential,
  ProofRequest,
  SignedPresentation,
  VerificationChecks,
  VerificationResult,
  VerifierId,
} from "./types";
import { getTrustRegistryEntry, isCredentialActive } from "./registries";
import { getVerifierPolicy } from "./policies";
import { verifyJwt } from "./signing";

function getPermissionFieldForDocumentType(
  documentType: HealthcareDocumentType,
): keyof HealthcareProfessionalAuthorisationCredential["credentialSubject"]["professional_authorisation"] {
  const mapping = {
    referral: "can_issue_referral",
    sickness_certificate: "can_issue_sickness_certificate",
    work_capacity_assessment: "can_issue_work_capacity_assessment",
    specialist_assessment: "can_issue_specialist_assessment",
    prescription_authorisation: "can_issue_prescription_authorisation",
    discharge_summary: "can_issue_discharge_summary",
  } as const;

  return mapping[documentType];
}

function allChecksPassed(checks: VerificationChecks): boolean {
  return Object.values(checks).every(Boolean);
}

function buildReason(checks: VerificationChecks, verifier: VerifierId): string {
  if (allChecksPassed(checks)) {
    return `Credential satisfies ${verifier} verification policy.`;
  }

  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([check]) => check);

  return `Verification failed: ${failedChecks.join(", ")}.`;
}

export async function verifyHealthcarePresentation(params: {
  signedPresentation: SignedPresentation;
  holderPublicJwk: JsonWebKey;
  issuerPublicJwk: JsonWebKey;
  proofRequest: ProofRequest;
}): Promise<VerificationResult> {
  const { signedPresentation, holderPublicJwk, issuerPublicJwk, proofRequest } =
    params;

  const presentationVerification = await verifyJwt(
    signedPresentation.jwt,
    holderPublicJwk,
    signedPresentation.decoded.holder,
  );

  const credentialJwt = signedPresentation.decoded.credentialJwt;

  const credentialVerification = await verifyJwt(
    credentialJwt,
    issuerPublicJwk,
  );

  const credential =
    credentialVerification.payload as unknown as HealthcareProfessionalAuthorisationCredential;

  const trustEntry = getTrustRegistryEntry(credential.issuer);
  const policy = getVerifierPolicy(proofRequest.verifier);
  const permissionField = getPermissionFieldForDocumentType(
    proofRequest.requestedDocumentType,
  );

  const documentTypeAllowedByCredential =
    credential.credentialSubject.professional_authorisation[permissionField] ===
    true;

  const verifierPolicySatisfied =
    policy.acceptedRoles.includes(
      credential.credentialSubject.professional_authorisation.professional_role,
    ) &&
    policy.acceptedDocumentTypes.includes(proofRequest.requestedDocumentType);

  const checks: VerificationChecks = {
    presentationSignatureValid: presentationVerification.valid,
    credentialSignatureValid: credentialVerification.valid,
    issuerTrusted: Boolean(trustEntry?.trusted),
    issuerAllowedForCredentialType:
      trustEntry?.allowedCredentialTypes.includes(
        credential.credentialConfigurationId,
      ) ?? false,
    credentialNotExpired:
      new Date(credential.expirationDate).getTime() > Date.now(),
    credentialStatusActive: isCredentialActive(credential.credentialStatus.id),
    professionalAuthorisationActive:
      credential.credentialSubject.professional_authorisation
        .authorisation_status === "active",
    documentTypeAllowedByCredential,
    verifierPolicySatisfied,
  };

  return {
    decision: allChecksPassed(checks) ? "accepted" : "rejected",
    verifier: proofRequest.verifier,
    requestedDocumentType: proofRequest.requestedDocumentType,
    credentialId: credential.id,
    checks,
    reason: buildReason(checks, proofRequest.verifier),
  };
}
