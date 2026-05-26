import type {
  HealthcareDocumentType,
  VerificationResult,
  VerifierId,
} from "./types";
import { runDemoFlow } from "./demoFlow";

export interface ScenarioResult {
  title: string;
  verifier: VerifierId;
  requestedDocumentType: HealthcareDocumentType;
  expectedDecision: "accepted" | "rejected";
  actualDecision: "accepted" | "rejected";
  passed: boolean;
  result: VerificationResult;
}

const scenarios: Array<{
  title: string;
  verifier: VerifierId;
  requestedDocumentType: HealthcareDocumentType;
  expectedDecision: "accepted" | "rejected";
}> = [
  {
    title: "Hospital verifies referral",
    verifier: "hospital",
    requestedDocumentType: "referral",
    expectedDecision: "accepted",
  },
  {
    title: "NAV verifies sickness certificate",
    verifier: "nav",
    requestedDocumentType: "sickness_certificate",
    expectedDecision: "accepted",
  },
  {
    title: "NAV verifies referral",
    verifier: "nav",
    requestedDocumentType: "referral",
    expectedDecision: "rejected",
  },
  {
    title: "Private clinic verifies specialist assessment",
    verifier: "private_clinic",
    requestedDocumentType: "specialist_assessment",
    expectedDecision: "rejected",
  },
  {
    title: "Pharmacy verifies prescription authorisation",
    verifier: "pharmacy",
    requestedDocumentType: "prescription_authorisation",
    expectedDecision: "accepted",
  },
];

export async function runScenarioEvaluation(): Promise<ScenarioResult[]> {
  return Promise.all(
    scenarios.map(async (scenario) => {
      const demo = await runDemoFlow({
        subjectIdentifier: "clinician-001",
        verifier: scenario.verifier,
        requestedDocumentType: scenario.requestedDocumentType,
      });

      return {
        ...scenario,
        actualDecision: demo.verificationResult.decision,
        passed: demo.verificationResult.decision === scenario.expectedDecision,
        result: demo.verificationResult,
      };
    }),
  );
}
