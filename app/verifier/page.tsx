import { runDemoFlow } from "@/lib/demoFlow";
import type { HealthcareDocumentType, VerifierId } from "@/lib/types";

const testCases: Array<{
  title: string;
  verifier: VerifierId;
  requestedDocumentType: HealthcareDocumentType;
  explanation: string;
}> = [
  {
    title: "Hospital verifies referral",
    verifier: "hospital",
    requestedDocumentType: "referral",
    explanation:
      "Expected to pass because the clinician can issue referrals and hospital policy accepts referrals.",
  },
  {
    title: "NAV verifies sickness certificate",
    verifier: "nav",
    requestedDocumentType: "sickness_certificate",
    explanation:
      "Expected to pass because NAV policy accepts sickness certificates from authorised clinicians.",
  },
  {
    title: "NAV verifies referral",
    verifier: "nav",
    requestedDocumentType: "referral",
    explanation:
      "Expected to fail because NAV policy does not accept referrals for this verification context.",
  },
  {
    title: "Pharmacy verifies prescription authorisation",
    verifier: "pharmacy",
    requestedDocumentType: "prescription_authorisation",
    explanation:
      "Expected to pass because the clinician has prescription authorisation and pharmacy policy accepts it.",
  },
];

export default async function VerifierPage() {
  const results = await Promise.all(
    testCases.map(async (testCase) => {
      const demo = await runDemoFlow({
        subjectIdentifier: "clinician-001",
        verifier: testCase.verifier,
        requestedDocumentType: testCase.requestedDocumentType,
      });

      return {
        ...testCase,
        result: demo.verificationResult,
        credential: demo.signedCredential.decoded,
        presentation: demo.signedPresentation.decoded,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Verifier Portal</h1>
          <p className="mt-2 text-slate-600">
            OpenID4VP/DCQL-inspired healthcare verification requests. Each
            verifier applies its own institutional policy after checking
            credential signature, issuer trust, status, expiry, and professional
            authorisation.
          </p>
        </section>

        <section className="grid gap-6">
          {results.map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.explanation}
                  </p>
                  <p className="mt-2 text-sm">
                    <strong>Verifier:</strong> {item.verifier} ·{" "}
                    <strong>Requested document:</strong>{" "}
                    {item.requestedDocumentType}
                  </p>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    item.result.decision === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.result.decision.toUpperCase()}
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
                <strong>Reason:</strong> {item.result.reason}
              </p>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {Object.entries(item.result.checks).map(([check, passed]) => (
                  <div
                    key={check}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                  >
                    <span>{check}</span>
                    <span
                      className={
                        passed
                          ? "font-medium text-green-700"
                          : "font-medium text-red-700"
                      }
                    >
                      {passed ? "passed" : "failed"}
                    </span>
                  </div>
                ))}
              </div>

              <details className="mt-4 rounded-xl border p-4">
                <summary className="cursor-pointer font-medium">
                  Show DCQL-style proof request
                </summary>
                <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                  {JSON.stringify(item.presentation.proofRequest, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
