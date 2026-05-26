import { hprSourceRecords } from "@/lib/mockData";
import { generateLocalKeyPair } from "@/lib/signing";
import { issueSignedCredential } from "@/lib/credential";
import {
  createProofRequest,
  createSignedPresentation,
} from "@/lib/presentation";

export default async function WalletPage() {
  const issuerKeys = await generateLocalKeyPair();
  const holderKeys = await generateLocalKeyPair();

  const record = hprSourceRecords[0];

  const { credentialOffer, signedCredential } = await issueSignedCredential(
    record,
    issuerKeys.privateJwk,
  );

  const proofRequest = createProofRequest("nav", "sickness_certificate");

  const signedPresentation = await createSignedPresentation(
    signedCredential,
    proofRequest,
    record.subjectIdentifier,
    holderKeys.privateJwk,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">Clinician Wallet</h1>
          <p className="mt-2 text-slate-600">
            Local wallet view showing how a clinician receives a credential
            offer, stores a signed healthcare professional authorisation
            credential, and creates a signed presentation for a verifier.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            1. Received Credential Offer
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            In a real wallet flow, this would be scanned or opened from a
            credential offer. The prototype represents it locally.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(credentialOffer, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">2. Stored Credential</h2>
          <p className="mt-2 text-sm text-slate-600">
            The clinician wallet stores the signed professional authorisation
            credential.
          </p>

          <div className="mt-4 rounded-xl border bg-slate-50 p-4">
            <p>
              <strong>Holder:</strong>{" "}
              {signedCredential.decoded.credentialSubject.name}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {
                signedCredential.decoded.credentialSubject
                  .professional_authorisation.professional_role
              }
            </p>
            <p>
              <strong>Authorisation ID:</strong>{" "}
              {
                signedCredential.decoded.credentialSubject
                  .professional_authorisation.authorisation_id
              }
            </p>
            <p>
              <strong>Credential type:</strong> {signedCredential.decoded.vct}
            </p>
            <p>
              <strong>Format:</strong> {signedCredential.decoded.format}
            </p>
            <p>
              <strong>Expires:</strong>{" "}
              {signedCredential.decoded.expirationDate}
            </p>
          </div>

          <details className="mt-4 rounded-xl border p-4">
            <summary className="cursor-pointer font-medium">
              Show signed credential token
            </summary>
            <pre className="mt-3 max-h-40 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              {signedCredential.jwt}
            </pre>
          </details>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">3. Verifier Proof Request</h2>
          <p className="mt-2 text-sm text-slate-600">
            DCQL-style request from NAV asking for the claims needed to verify a
            sickness certificate context.
          </p>
          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(proofRequest, null, 2)}
          </pre>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">4. Signed Presentation</h2>
          <p className="mt-2 text-sm text-slate-600">
            The wallet creates a signed presentation containing the credential
            and the verifier request context. This is the prototype&apos;s
            vp_token-like object.
          </p>

          <h3 className="mt-4 font-semibold">Decoded presentation</h3>
          <pre className="mt-2 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(signedPresentation.decoded, null, 2)}
          </pre>

          <h3 className="mt-4 font-semibold">Signed presentation token</h3>
          <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {signedPresentation.jwt}
          </pre>
        </section>
      </div>
    </main>
  );
}
