import type { ProofCatalogueEntry } from "./types";

export const healthcareProofCatalogue: ProofCatalogueEntry[] = [
  {
    name: "Healthcare Professional Authorisation",
    credentialConfigurationId: "no.health.hpr.authorisation.sd_jwt",
    vct: "no:health:hpr-authorisation:1",
    format: "dc+sd-jwt-inspired",
    issuerId: "did:health:no:hpr-sim-issuer",
    attributes: [
      {
        label: "Authorisation ID",
        path: ["professional_authorisation", "authorisation_id"],
        required: true,
      },
      {
        label: "Professional role",
        path: ["professional_authorisation", "professional_role"],
        required: true,
      },
      {
        label: "Authorisation status",
        path: ["professional_authorisation", "authorisation_status"],
        required: true,
      },
      {
        label: "Can issue referral",
        path: ["professional_authorisation", "can_issue_referral"],
        required: false,
      },
      {
        label: "Can issue sickness certificate",
        path: ["professional_authorisation", "can_issue_sickness_certificate"],
        required: false,
      },
      {
        label: "Can issue work capacity assessment",
        path: [
          "professional_authorisation",
          "can_issue_work_capacity_assessment",
        ],
        required: false,
      },
      {
        label: "Can issue specialist assessment",
        path: ["professional_authorisation", "can_issue_specialist_assessment"],
        required: false,
      },
      {
        label: "Can issue prescription authorisation",
        path: [
          "professional_authorisation",
          "can_issue_prescription_authorisation",
        ],
        required: false,
      },
      {
        label: "Can issue discharge summary",
        path: ["professional_authorisation", "can_issue_discharge_summary"],
        required: false,
      },
      {
        label: "Expiry date",
        path: ["expiry_date"],
        required: true,
      },
      {
        label: "Issuing authority",
        path: ["issuing_authority"],
        required: true,
      },
    ],
  },
];

export function getProofCatalogueEntry(
  credentialConfigurationId: string,
): ProofCatalogueEntry | undefined {
  return healthcareProofCatalogue.find(
    (entry) => entry.credentialConfigurationId === credentialConfigurationId,
  );
}
