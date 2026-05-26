import Link from "next/link";

const pages = [
  {
    href: "/issuer",
    title: "Issuer Portal",
    description:
      "Source-controlled issuance flow: simulated HPR source, issuance transaction, credential offer, and signed healthcare credential.",
  },
  {
    href: "/wallet",
    title: "Clinician Wallet",
    description:
      "Wallet view showing received credential offer, stored credential, DCQL-style proof request, and signed presentation.",
  },
  {
    href: "/verifier",
    title: "Verifier Portal",
    description:
      "Healthcare verifiers apply signature, trust, status, expiry, authorisation, and verifier-specific policy checks.",
  },
  {
    href: "/registries",
    title: "Registries and Catalogue",
    description:
      "Local proof catalogue, trust registry, status registry, and verifier policy registry.",
  },
  {
    href: "/scenarios",
    title: "Scenario Evaluation",
    description:
      "Controlled test scenarios showing accepted and rejected verification outcomes.",
  },
  {
    href: "/audit",
    title: "Audit Log",
    description:
      "Hash-chained audit trail for issuance, presentation, and verification events.",
  },
  {
    href: "/context",
    title: "Digdir Context Mapping",
    description:
      "Mapping between Digdir sandbox concepts and the local healthcare prototype components.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-8 shadow">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Master thesis prototype
          </p>
          <h1 className="mt-2 text-4xl font-bold">
            Healthcare VC Verification Layer
          </h1>
          <p className="mt-4 max-w-3xl text-slate-600">
            A Digdir-sandbox-aligned proof-of-concept for healthcare
            professional authorisation verification. The prototype models an
            HPR-like authoritative source, a healthcare credential issuer, a
            clinician wallet, and healthcare verifiers with trust, status, and
            policy-based verification logic.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Implemented Flow</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {[
              "Simulated HPR Source",
              "Healthcare Issuer",
              "Clinician Wallet",
              "Healthcare Verifier",
              "Verification Decision",
            ].map((step, index) => (
              <div key={step} className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">
                  Step {index + 1}
                </p>
                <p className="mt-1 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{page.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{page.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
