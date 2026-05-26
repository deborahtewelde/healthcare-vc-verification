import type { HprSourceRecord } from "./types";

export const hprSourceRecords: HprSourceRecord[] = [
  {
    subjectIdentifier: "clinician-001",
    name: "Dr. Ingrid Nilsen",
    professionalRole: "General Practitioner",
    authorisationId: "HPR-123456",
    authorisationStatus: "active",
    canIssueReferral: true,
    canIssueSicknessCertificate: true,
    canIssueWorkCapacityAssessment: true,
    canIssueSpecialistAssessment: false,
    canIssuePrescriptionAuthorisation: true,
    canIssueDischargeSummary: false,
    issuingAuthority: "Simulated Health Personnel Register",
    validUntil: "2027-05-25",
  },
  {
    subjectIdentifier: "clinician-002",
    name: "Dr. Erik Berg",
    professionalRole: "Specialist",
    authorisationId: "HPR-654321",
    authorisationStatus: "active",
    canIssueReferral: true,
    canIssueSicknessCertificate: true,
    canIssueWorkCapacityAssessment: true,
    canIssueSpecialistAssessment: true,
    canIssuePrescriptionAuthorisation: true,
    canIssueDischargeSummary: true,
    issuingAuthority: "Simulated Health Personnel Register",
    validUntil: "2027-12-31",
  },
  {
    subjectIdentifier: "clinician-003",
    name: "Anne Solheim",
    professionalRole: "Nurse",
    authorisationId: "HPR-777888",
    authorisationStatus: "active",
    canIssueReferral: false,
    canIssueSicknessCertificate: false,
    canIssueWorkCapacityAssessment: false,
    canIssueSpecialistAssessment: false,
    canIssuePrescriptionAuthorisation: false,
    canIssueDischargeSummary: true,
    issuingAuthority: "Simulated Health Personnel Register",
    validUntil: "2026-12-31",
  },
  {
    subjectIdentifier: "clinician-004",
    name: "Dr. Suspended Example",
    professionalRole: "General Practitioner",
    authorisationId: "HPR-000999",
    authorisationStatus: "suspended",
    canIssueReferral: true,
    canIssueSicknessCertificate: true,
    canIssueWorkCapacityAssessment: false,
    canIssueSpecialistAssessment: false,
    canIssuePrescriptionAuthorisation: false,
    canIssueDischargeSummary: false,
    issuingAuthority: "Simulated Health Personnel Register",
    validUntil: "2027-05-25",
  },
];

export function getHprRecord(
  subjectIdentifier: string,
): HprSourceRecord | undefined {
  return hprSourceRecords.find(
    (record) => record.subjectIdentifier === subjectIdentifier,
  );
}
