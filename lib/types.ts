// Core domain types for the healthcare VC verification prototype.
// The terminology mirrors Digdir/EUDI wallet roles, but everything is implemented locally.

export type CredentialFormat = "dc+sd-jwt-inspired" | "mso_mdoc-inspired";

export type VerifierId = "hospital" | "nav" | "private_clinic" | "pharmacy";

export type CredentialStatus = "active" | "revoked" | "suspended" | "expired";

export type TrustActorRole =
  | "Service Provider"
  | "Public EAA Provider"
  | "Qualified EAA Provider"
  | "Non-qualified EAA Provider"
  | "Healthcare Authorisation Issuer";

export type HealthcareDocumentType =
  | "referral"
  | "sickness_certificate"
  | "work_capacity_assessment"
  | "specialist_assessment"
  | "prescription_authorisation"
  | "discharge_summary";

export type ProfessionalRole =
  | "General Practitioner"
  | "Specialist"
  | "Nurse"
  | "Pharmacist"
  | "Psychologist";

export interface HprSourceRecord {
  subjectIdentifier: string;
  name: string;
  professionalRole: ProfessionalRole;
  authorisationId: string;
  authorisationStatus: "active" | "inactive" | "suspended";
  canIssueReferral: boolean;
  canIssueSicknessCertificate: boolean;
  canIssueWorkCapacityAssessment: boolean;
  canIssueSpecialistAssessment: boolean;
  canIssuePrescriptionAuthorisation: boolean;
  canIssueDischargeSummary: boolean;
  issuingAuthority: string;
  validUntil: string; // ISO date, e.g. 2027-05-25
}

export interface CredentialConfiguration {
  credentialConfigurationId: string;
  name: string;
  format: CredentialFormat;
  vct: string;
  issuerId: string;
  description: string;
}

export interface DcqlClaimPath {
  label: string;
  path: string[];
  required: boolean;
}

export interface ProofCatalogueEntry {
  name: string;
  credentialConfigurationId: string;
  vct: string;
  format: CredentialFormat;
  issuerId: string;
  attributes: DcqlClaimPath[];
}

export interface IssuanceTransactionRequest {
  credential_configuration_id: string;
  subject: {
    identifier: string;
  };
  credential_data: HealthcareCredentialData;
}

export interface CredentialOffer {
  issuer: string;
  credential_configuration_id: string;
  format: CredentialFormat;
  vct: string;
  pre_authorized_code: string;
  subject: {
    identifier: string;
  };
  claimsPreview: HealthcareCredentialData;
  createdAt: string;
}

export interface HealthcareCredentialData {
  professional_authorisation: {
    authorisation_id: string;
    professional_role: ProfessionalRole;
    authorisation_status: "active" | "inactive" | "suspended";
    can_issue_referral: boolean;
    can_issue_sickness_certificate: boolean;
    can_issue_work_capacity_assessment: boolean;
    can_issue_specialist_assessment: boolean;
    can_issue_prescription_authorisation: boolean;
    can_issue_discharge_summary: boolean;
  };
  expiry_date: string;
  issuing_authority: string;
}

export interface HealthcareProfessionalAuthorisationCredential {
  id: string;
  type: [
    "VerifiableCredential",
    "HealthcareProfessionalAuthorisationCredential",
  ];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialConfigurationId: string;
  vct: string;
  format: CredentialFormat;
  credentialSubject: {
    id: string;
    name: string;
  } & HealthcareCredentialData;
  credentialStatus: {
    id: string;
    type: "StatusRegistryEntry";
  };
}

export interface SignedCredential {
  credentialId: string;
  jwt: string;
  decoded: HealthcareProfessionalAuthorisationCredential;
}

export interface ProofRequest {
  verifier: VerifierId;
  requestedDocumentType: HealthcareDocumentType;
  dcql_query: {
    credentials: Array<{
      id: string;
      format: CredentialFormat;
      meta: {
        vct_values: string[];
      };
      claims: Array<{
        path: string[];
      }>;
    }>;
  };
  nonce: string;
  state: string;
  response_uri: string;
}

export interface VerifiablePresentation {
  id: string;
  holder: string;
  verifier: VerifierId;
  proofRequest: ProofRequest;
  credentialJwt: string;
  createdAt: string;
  nonce: string;
}

export interface SignedPresentation {
  presentationId: string;
  jwt: string;
  decoded: VerifiablePresentation;
}

export interface TrustRegistryEntry {
  issuerId: string;
  organisation: string;
  serviceName: string;
  roles: TrustActorRole[];
  trusted: boolean;
  allowedCredentialTypes: string[];
  publicKeyJwk?: unknown;
}

export interface StatusRegistryEntry {
  statusId: string;
  credentialId: string;
  status: CredentialStatus;
  updatedAt: string;
  reason?: string;
}

export interface VerifierPolicy {
  verifier: VerifierId;
  name: string;
  acceptedRoles: ProfessionalRole[];
  acceptedDocumentTypes: HealthcareDocumentType[];
  requireTrustedIssuer: boolean;
  requireActiveCredentialStatus: boolean;
  requireActiveProfessionalAuthorisation: boolean;
}

export interface VerificationChecks {
  presentationSignatureValid: boolean;
  credentialSignatureValid: boolean;
  issuerTrusted: boolean;
  issuerAllowedForCredentialType: boolean;
  credentialNotExpired: boolean;
  credentialStatusActive: boolean;
  professionalAuthorisationActive: boolean;
  documentTypeAllowedByCredential: boolean;
  verifierPolicySatisfied: boolean;
}

export interface VerificationResult {
  decision: "accepted" | "rejected";
  verifier: VerifierId;
  requestedDocumentType: HealthcareDocumentType;
  credentialId?: string;
  checks: VerificationChecks;
  reason: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  type:
    | "issuance_transaction_created"
    | "credential_offer_created"
    | "credential_issued"
    | "presentation_created"
    | "verification_performed"
    | "credential_revoked"
    | "issuer_trust_changed";
  actor: string;
  payloadHash: string;
  previousHash: string;
  eventHash: string;
}
