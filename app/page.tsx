import { runDemoFlow } from "@/lib/demoFlow";

export default async function Home() {
  const demo = await runDemoFlow({
    subjectIdentifier: "clinician-001",
    verifier: "hospital",
    requestedDocumentType: "referral",
  });

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">
            Healthcare VC Verification Prototype
          </h1>
          <p className="mt-2 text-slate-600">
            Digdir-sandbox-aligned proof-of-concept for healthcare professional
            authorisation verification.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Demo Verification Result</h2>

          <div className="mt-4 rounded-xl border p-4">
            <p>
              <strong>Decision:</strong>{" "}
              <span
                className={
                  demo.verificationResult.decision === "accepted"
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {demo.verificationResult.decision.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Verifier:</strong> {demo.verificationResult.verifier}
            </p>
            <p>
              <strong>Requested document type:</strong>{" "}
              {demo.verificationResult.requestedDocumentType}
            </p>
            <p>
              <strong>Reason:</strong> {demo.verificationResult.reason}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Verification Checks</h2>

          <div className="mt-4 grid gap-2">
            {Object.entries(demo.verificationResult.checks).map(
              ([check, passed]) => (
                <div
                  key={check}
                  className="flex items-center justify-between rounded-lg border px-4 py-2"
                >
                  <span>{check}</span>
                  <span className={passed ? "text-green-700" : "text-red-700"}>
                    {passed ? "passed" : "failed"}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Signed Credential Preview</h2>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(demo.signedCredential.decoded, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
