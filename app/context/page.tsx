const mappings = [
  {
    digdir: "Autoritativ kjelde / authoritative source",
    example: "Folkeregisteret, Enhetsregisteret, other data sources",
    prototype: "Simulated HPR-like professional authorisation source",
  },
  {
    digdir: "Utsteder / issuer",
    example: "Bevisporten, Digipost issuer service, Kantega Bevis Studio",
    prototype: "Healthcare Authorisation Issuer",
  },
  {
    digdir: "Credential offer / issuance transaction",
    example:
      "Bevisporten source-controlled issuance with credential_configuration_id and subject identifier",
    prototype:
      "Local issuance transaction with credential_configuration_id, subject.identifier, and credential_data",
  },
  {
    digdir: "Lommebok / holder",
    example: "Digdir demo wallet, Symfoni ID",
    prototype: "Clinician Wallet",
  },
  {
    digdir: "Brukarstad / verifier / relying party",
    example: "Digdir demo brukarstad, ID-porten test, Kantega Verifier",
    prototype: "Hospital, NAV, private clinic, and pharmacy verifier",
  },
  {
    digdir: "Beviskatalog",
    example: "Proof type, issuer, format, attributes, DCQL paths",
    prototype:
      "Healthcare proof catalogue with no.health.hpr.authorisation.sd_jwt",
  },
  {
    digdir: "DCQL query / OpenID4VP request",
    example: "Verifier requests specific credential type and claim paths",
    prototype:
      "DCQL-style healthcare proof request for professional role, authorisation status, and document permissions",
  },
  {
    digdir: "Tillitslister / trust lists",
    example: "Registered actors, roles, trust framework",
    prototype:
      "Local trust registry with issuer roles and allowed credential types",
  },
  {
    digdir: "Revocation / status capability",
    example: "Credential withdrawal/status capability under development",
    prototype: "Local status registry used during verification",
  },
  {
    digdir: "Innbyggers dashboard/historikk",
    example: "History of shared proofs, recipient, time, and purpose",
    prototype:
      "Hash-chained audit log of issuance, presentation, and verification",
  },
];

export default function ContextPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">
            Mapping to Digdir Wallet Sandbox Concepts
          </h1>
          <p className="mt-2 text-slate-600">
            The prototype is not integrated with Digdir&apos;s live sandbox.
            Instead, it locally mirrors the architectural roles and structures
            observed in Digdir&apos;s wallet sandbox and adapts them to a
            healthcare professional authorisation verification context.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Context Mapping</h2>
          <div className="mt-4 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3 text-left">Digdir sandbox concept</th>
                  <th className="p-3 text-left">Observed example</th>
                  <th className="p-3 text-left">Prototype equivalent</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((row) => (
                  <tr key={row.digdir} className="border-b align-top">
                    <td className="p-3 font-medium">{row.digdir}</td>
                    <td className="p-3">{row.example}</td>
                    <td className="p-3">{row.prototype}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Implementation Boundary</h2>
          <p className="mt-2 text-slate-600">
            Implemented locally: signed credential issuance, credential offer,
            wallet presentation, DCQL-style proof request, trust registry,
            status registry, verifier-specific policy evaluation, scenario
            evaluation, and hash-chained audit log.
          </p>
          <p className="mt-3 text-slate-600">
            Not implemented: live Digdir sandbox integration, real Bevisporten,
            real HelseID, real HPR, real EUDI wallet app, production OpenID4VCI
            or OpenID4VP conformance, and European trust list integration.
          </p>
        </section>
      </div>
    </main>
  );
}
