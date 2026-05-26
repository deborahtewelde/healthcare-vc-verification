import { v4 as uuidv4 } from "uuid";
import type {
  CredentialOffer,
  HealthcareCredentialData,
  HealthcareProfessionalAuthorisationCredential,
  HprSourceRecord,
  IssuanceTransactionRequest,
  SignedCredential,
} from "./types";
import { ISSUER_DID } from "./registries";
import { signPayload } from "./signing";

export const HEALTHCARE_CREDENTIAL_CONFIGURATION_ID =
  "no.health.hpr.authorisation.sd_jwt";

export const HEALTHCARE_VCT = "no:health:hpr-authorisation:1";

export function mapHprRecordToCredentialData(
  record: HprSourceRecord,
): HealthcareCredentialData {
  return {
    professional_authorisation: {
      authorisation_id: record.authorisationId,
      professional_role: record.professionalRole,
      authorisation_status: record.authorisationStatus,
      can_issue_referral: record.canIssueReferral,
      can_issue_sickness_certificate: record.canIssueSicknessCertificate,
      can_issue_work_capacity_assessment: record.canIssueWorkCapacityAssessment,
      can_issue_specialist_assessment: record.canIssueSpecialistAssessment,
      can_issue_prescription_authorisation:
        record.canIssuePrescriptionAuthorisation,
      can_issue_discharge_summary: record.canIssueDischargeSummary,
    },
    expiry_date: record.validUntil,
    issuing_authority: record.issuingAuthority,
  };
}

export function createIssuanceTransactionRequest(
  record: HprSourceRecord,
): IssuanceTransactionRequest {
  return {
    credential_configuration_id: HEALTHCARE_CREDENTIAL_CONFIGURATION_ID,
    subject: {
      identifier: record.subjectIdentifier,
    },
    credential_data: mapHprRecordToCredentialData(record),
  };
}

export function createCredentialOffer(
  request: IssuanceTransactionRequest,
): CredentialOffer {
  return {
    issuer: ISSUER_DID,
    credential_configuration_id: request.credential_configuration_id,
    format: "dc+sd-jwt-inspired",
    vct: HEALTHCARE_VCT,
    pre_authorized_code: `pre-auth-${uuidv4()}`,
    subject: request.subject,
    claimsPreview: request.credential_data,
    createdAt: new Date().toISOString(),
  };
}

export function createUnsignedHealthcareCredential(
  record: HprSourceRecord,
  offer: CredentialOffer,
): HealthcareProfessionalAuthorisationCredential {
  return {
    id: "cred-health-001",
    type: [
      "VerifiableCredential",
      "HealthcareProfessionalAuthorisationCredential",
    ],
    issuer: ISSUER_DID,
    issuanceDate: new Date().toISOString(),
    expirationDate: record.validUntil,
    credentialConfigurationId: offer.credential_configuration_id,
    vct: offer.vct,
    format: offer.format,
    credentialSubject: {
      id: record.subjectIdentifier,
      name: record.name,
      ...offer.claimsPreview,
    },
    credentialStatus: {
      id: "status-cred-health-001",
      type: "StatusRegistryEntry",
    },
  };
}

export async function issueSignedCredential(
  record: HprSourceRecord,
  issuerPrivateJwk: JsonWebKey,
): Promise<{
  issuanceRequest: IssuanceTransactionRequest;
  credentialOffer: CredentialOffer;
  signedCredential: SignedCredential;
}> {
  const issuanceRequest = createIssuanceTransactionRequest(record);
  const credentialOffer = createCredentialOffer(issuanceRequest);
  const unsignedCredential = createUnsignedHealthcareCredential(
    record,
    credentialOffer,
  );

  const jwt = await signPayload(
    unsignedCredential as unknown as Record<string, unknown>,
    issuerPrivateJwk,
    ISSUER_DID,
  );

  return {
    issuanceRequest,
    credentialOffer,
    signedCredential: {
      credentialId: unsignedCredential.id,
      jwt,
      decoded: unsignedCredential,
    },
  };
}
