import { healthcareProofCatalogue } from "@/lib/proofCatalogue";
import { statusRegistry, trustRegistry } from "@/lib/registries";
import { verifierPolicies } from "@/lib/policies";

export default function RegistriesPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Registries and Catalogue</h1>
          <p className="mt-2 text-slate-600">
            Local prototype equivalents of Digdir sandbox structures: proof
            catalogue, trust registry, status registry, and verifier policies.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Healthcare Proof Catalogue</h2>
          {healthcareProofCatalogue.map((entry) => (
            <div
              key={entry.credentialConfigurationId}
              className="mt-4 rounded-xl border p-4"
            >
              <p>
                <strong>Name:</strong> {entry.name}
              </p>
              <p>
                <strong>Credential configuration ID:</strong>{" "}
                {entry.credentialConfigurationId}
              </p>
              <p>
                <strong>VCT:</strong> {entry.vct}
              </p>
              <p>
                <strong>Format:</strong> {entry.format}
              </p>
              <p>
                <strong>Issuer:</strong> {entry.issuerId}
              </p>

              <div className="mt-4 space-y-2">
                {entry.attributes.map((attribute) => (
                  <div
                    key={attribute.label}
                    className="rounded-lg bg-slate-100 p-3 text-sm"
                  >
                    <p>
                      <strong>{attribute.label}</strong>
                    </p>
                    <p className="font-mono text-xs">
                      {JSON.stringify(attribute.path)}
                    </p>
                    <p>Required: {attribute.required ? "yes" : "no"}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Trust Registry</h2>
          <div className="mt-4 space-y-3">
            {trustRegistry.map((entry) => (
              <div key={entry.issuerId} className="rounded-xl border p-4">
                <p>
                  <strong>Issuer ID:</strong> {entry.issuerId}
                </p>
                <p>
                  <strong>Organisation:</strong> {entry.organisation}
                </p>
                <p>
                  <strong>Service:</strong> {entry.serviceName}
                </p>
                <p>
                  <strong>Roles:</strong> {entry.roles.join(", ")}
                </p>
                <p>
                  <strong>Trusted:</strong> {entry.trusted ? "yes" : "no"}
                </p>
                <p>
                  <strong>Allowed credential types:</strong>{" "}
                  {entry.allowedCredentialTypes.join(", ") || "none"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Status Registry</h2>
          <div className="mt-4 space-y-3">
            {statusRegistry.map((entry) => (
              <div key={entry.statusId} className="rounded-xl border p-4">
                <p>
                  <strong>Status ID:</strong> {entry.statusId}
                </p>
                <p>
                  <strong>Credential ID:</strong> {entry.credentialId}
                </p>
                <p>
                  <strong>Status:</strong> {entry.status}
                </p>
                <p>
                  <strong>Updated:</strong> {entry.updatedAt}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Verifier Policies</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {verifierPolicies.map((policy) => (
              <div key={policy.verifier} className="rounded-xl border p-4">
                <h3 className="font-semibold">{policy.name}</h3>
                <p>
                  <strong>Verifier ID:</strong> {policy.verifier}
                </p>
                <p>
                  <strong>Accepted roles:</strong>{" "}
                  {policy.acceptedRoles.join(", ")}
                </p>
                <p>
                  <strong>Accepted document types:</strong>{" "}
                  {policy.acceptedDocumentTypes.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
