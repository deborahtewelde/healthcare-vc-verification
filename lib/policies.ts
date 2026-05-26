import type { VerifierPolicy } from "./types";

export const verifierPolicies: VerifierPolicy[] = [
  {
    verifier: "hospital",
    name: "Hospital Verifier",
    acceptedRoles: ["General Practitioner", "Specialist", "Nurse"],
    acceptedDocumentTypes: [
      "referral",
      "discharge_summary",
      "specialist_assessment",
    ],
    requireTrustedIssuer: true,
    requireActiveCredentialStatus: true,
    requireActiveProfessionalAuthorisation: true,
  },
  {
    verifier: "nav",
    name: "NAV Verifier",
    acceptedRoles: ["General Practitioner", "Specialist", "Psychologist"],
    acceptedDocumentTypes: ["sickness_certificate", "work_capacity_assessment"],
    requireTrustedIssuer: true,
    requireActiveCredentialStatus: true,
    requireActiveProfessionalAuthorisation: true,
  },
  {
    verifier: "private_clinic",
    name: "Private Clinic Verifier",
    acceptedRoles: ["General Practitioner", "Specialist", "Psychologist"],
    acceptedDocumentTypes: ["referral", "specialist_assessment"],
    requireTrustedIssuer: true,
    requireActiveCredentialStatus: true,
    requireActiveProfessionalAuthorisation: true,
  },
  {
    verifier: "pharmacy",
    name: "Pharmacy Verifier",
    acceptedRoles: ["General Practitioner", "Specialist", "Pharmacist"],
    acceptedDocumentTypes: ["prescription_authorisation"],
    requireTrustedIssuer: true,
    requireActiveCredentialStatus: true,
    requireActiveProfessionalAuthorisation: true,
  },
];

export function getVerifierPolicy(
  verifier: VerifierPolicy["verifier"],
): VerifierPolicy {
  const policy = verifierPolicies.find((entry) => entry.verifier === verifier);

  if (!policy) {
    throw new Error(`No verifier policy found for verifier: ${verifier}`);
  }

  return policy;
}
