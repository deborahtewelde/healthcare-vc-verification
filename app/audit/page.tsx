import { runDemoFlow } from "@/lib/demoFlow";
import { verifyAuditChain } from "@/lib/audit";

export default async function AuditPage() {
  const demo = await runDemoFlow({
    subjectIdentifier: "clinician-001",
    verifier: "nav",
    requestedDocumentType: "sickness_certificate",
  });

  const chainValid = verifyAuditChain(demo.auditLog);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="mt-2 text-slate-600">
            Hash-chained audit trail for the prototype flow. This simulates
            ledger-style traceability without storing healthcare data on a
            blockchain.
          </p>

          <p className="mt-4 rounded-xl bg-slate-100 p-4 font-medium">
            Audit chain valid:{" "}
            <span className={chainValid ? "text-green-700" : "text-red-700"}>
              {chainValid ? "yes" : "no"}
            </span>
          </p>
        </section>

        <section className="space-y-4">
          {demo.auditLog.map((event, index) => (
            <div key={event.id} className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                #{index + 1} {event.type}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Actor: {event.actor}
              </p>
              <p className="text-sm text-slate-600">
                Timestamp: {event.timestamp}
              </p>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="rounded-xl bg-slate-100 p-3">
                  <strong>Payload hash</strong>
                  <p className="break-all font-mono text-xs">
                    {event.payloadHash}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <strong>Previous hash</strong>
                  <p className="break-all font-mono text-xs">
                    {event.previousHash}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <strong>Event hash</strong>
                  <p className="break-all font-mono text-xs">
                    {event.eventHash}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
