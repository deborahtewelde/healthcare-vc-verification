import { hprSourceRecords } from "@/lib/mockData";
import { issueSignedCredential } from "@/lib/credential";
import { generateLocalKeyPair } from "@/lib/signing";

export default async function IssuerPage() {
  const issuerKeys = await generateLocalKeyPair();
  const record = hprSourceRecords[0];

  const { issuanceRequest, credentialOffer, signedCredential } =
    await issueSignedCredential(record, issuerKeys.privateJwk);

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Issuer Portal</h1>
          <p className="mt-2 text-slate-600">
            Source-controlled issuance flow inspired by Digdir/Bevisporten. A
            simulated HPR source provides professional authorisation data, the
            issuer creates a credential offer, and a signed healthcare
            credential is issued.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            1. Simulated HPR Source Record
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            This represents the authoritative healthcare source in the
            prototype.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(record, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            2. Issuance Transaction Request
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Local equivalent of a Bevisporten source-controlled issuance
            request: credential configuration ID, subject identifier, and pushed
            credential data.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(issuanceRequest, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">3. Credential Offer</h2>
          <p className="mt-2 text-sm text-slate-600">
            In the real Bevisporten flow, this would normally be rendered as a
            user-specific QR code and redeemed by the wallet using a
            pre-authorized code flow. Here it is represented locally.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(credentialOffer, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            4. Signed Healthcare Credential
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            The issuer signs the healthcare professional authorisation
            credential as a JWT/JWS-style token.
          </p>

          <h3 className="mt-4 font-semibold">Decoded credential</h3>
          <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(signedCredential.decoded, null, 2)}
          </pre>

          <h3 className="mt-4 font-semibold">Signed credential token</h3>
          <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {signedCredential.jwt}
          </pre>
        </section>
      </div>
    </main>
  );
}
