import { v4 as uuidv4 } from "uuid";
import type {
  ProofRequest,
  SignedCredential,
  SignedPresentation,
  VerifiablePresentation,
  VerifierId,
  HealthcareDocumentType,
} from "./types";
import { signPayload } from "./signing";

export function createProofRequest(
  verifier: VerifierId,
  requestedDocumentType: HealthcareDocumentType,
): ProofRequest {
  return {
    verifier,
    requestedDocumentType,
    nonce: `nonce-${uuidv4()}`,
    state: `state-${uuidv4()}`,
    response_uri: "/api/verifier/response",
    dcql_query: {
      credentials: [
        {
          id: "healthcare-professional-authorisation",
          format: "dc+sd-jwt-inspired",
          meta: {
            vct_values: ["no:health:hpr-authorisation:1"],
          },
          claims: [
            {
              path: ["professional_authorisation", "authorisation_id"],
            },
            {
              path: ["professional_authorisation", "professional_role"],
            },
            {
              path: ["professional_authorisation", "authorisation_status"],
            },
            {
              path: ["professional_authorisation", "can_issue_referral"],
            },
            {
              path: [
                "professional_authorisation",
                "can_issue_sickness_certificate",
              ],
            },
            {
              path: [
                "professional_authorisation",
                "can_issue_work_capacity_assessment",
              ],
            },
            {
              path: [
                "professional_authorisation",
                "can_issue_specialist_assessment",
              ],
            },
            {
              path: [
                "professional_authorisation",
                "can_issue_prescription_authorisation",
              ],
            },
            {
              path: [
                "professional_authorisation",
                "can_issue_discharge_summary",
              ],
            },
            {
              path: ["expiry_date"],
            },
            {
              path: ["issuing_authority"],
            },
          ],
        },
      ],
    },
  };
}

export function createUnsignedPresentation(
  signedCredential: SignedCredential,
  proofRequest: ProofRequest,
  holderId: string,
): VerifiablePresentation {
  return {
    id: `vp-${uuidv4()}`,
    holder: holderId,
    verifier: proofRequest.verifier,
    proofRequest,
    credentialJwt: signedCredential.jwt,
    createdAt: new Date().toISOString(),
    nonce: proofRequest.nonce,
  };
}

export async function createSignedPresentation(
  signedCredential: SignedCredential,
  proofRequest: ProofRequest,
  holderId: string,
  holderPrivateJwk: JsonWebKey,
): Promise<SignedPresentation> {
  const presentation = createUnsignedPresentation(
    signedCredential,
    proofRequest,
    holderId,
  );

  const jwt = await signPayload(
    presentation as unknown as Record<string, unknown>,
    holderPrivateJwk,
    holderId,
  );

  return {
    presentationId: presentation.id,
    jwt,
    decoded: presentation,
  };
}
