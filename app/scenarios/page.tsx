import { runScenarioEvaluation } from "@/lib/scenarios";

export default async function ScenariosPage() {
  const scenarios = await runScenarioEvaluation();

  const passedCount = scenarios.filter((scenario) => scenario.passed).length;

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Scenario-Based Evaluation</h1>
          <p className="mt-2 text-slate-600">
            Evaluation of the prototype using controlled healthcare verification
            scenarios. Each scenario tests whether issuer trust, credential
            status, professional authorisation, document permissions, and
            verifier-specific policy produce the expected decision.
          </p>

          <p className="mt-4 rounded-xl bg-slate-100 p-4 font-medium">
            Passed {passedCount} of {scenarios.length} scenarios.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Scenario Results</h2>

          <div className="mt-4 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3 text-left">Scenario</th>
                  <th className="p-3 text-left">Verifier</th>
                  <th className="p-3 text-left">Requested document</th>
                  <th className="p-3 text-left">Expected</th>
                  <th className="p-3 text-left">Actual</th>
                  <th className="p-3 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => (
                  <tr key={scenario.title} className="border-b">
                    <td className="p-3">{scenario.title}</td>
                    <td className="p-3">{scenario.verifier}</td>
                    <td className="p-3">{scenario.requestedDocumentType}</td>
                    <td className="p-3">{scenario.expectedDecision}</td>
                    <td className="p-3">{scenario.actualDecision}</td>
                    <td className="p-3">
                      <span
                        className={
                          scenario.passed
                            ? "font-semibold text-green-700"
                            : "font-semibold text-red-700"
                        }
                      >
                        {scenario.passed ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4">
          {scenarios.map((scenario) => (
            <details
              key={scenario.title}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <summary className="cursor-pointer text-lg font-semibold">
                {scenario.title}
              </summary>
              <p className="mt-3">
                <strong>Reason:</strong> {scenario.result.reason}
              </p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {Object.entries(scenario.result.checks).map(
                  ([check, passed]) => (
                    <div
                      key={check}
                      className="flex justify-between rounded-lg border px-3 py-2 text-sm"
                    >
                      <span>{check}</span>
                      <span
                        className={passed ? "text-green-700" : "text-red-700"}
                      >
                        {passed ? "passed" : "failed"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
