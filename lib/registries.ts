import type { StatusRegistryEntry, TrustRegistryEntry } from "./types";

export const ISSUER_DID = "did:health:no:hpr-sim-issuer";

export const trustRegistry: TrustRegistryEntry[] = [
  {
    issuerId: ISSUER_DID,
    organisation: "Simulated Health Personnel Register Authority",
    serviceName: "Healthcare Authorisation Issuer",
    roles: [
      "Public EAA Provider",
      "Service Provider",
      "Healthcare Authorisation Issuer",
    ],
    trusted: true,
    allowedCredentialTypes: ["no.health.hpr.authorisation.sd_jwt"],
  },
  {
    issuerId: "did:health:no:unknown-clinic-issuer",
    organisation: "Unknown Private Clinic",
    serviceName: "Unregistered Credential Issuer",
    roles: ["Service Provider"],
    trusted: false,
    allowedCredentialTypes: [],
  },
];

export const statusRegistry: StatusRegistryEntry[] = [
  {
    statusId: "status-cred-health-001",
    credentialId: "cred-health-001",
    status: "active",
    updatedAt: new Date().toISOString(),
  },
];

export function getTrustRegistryEntry(
  issuerId: string,
): TrustRegistryEntry | undefined {
  return trustRegistry.find((entry) => entry.issuerId === issuerId);
}

export function isIssuerTrusted(issuerId: string): boolean {
  const entry = getTrustRegistryEntry(issuerId);
  return Boolean(entry?.trusted);
}

export function getStatusRegistryEntry(
  statusId: string,
): StatusRegistryEntry | undefined {
  return statusRegistry.find((entry) => entry.statusId === statusId);
}

export function isCredentialActive(statusId: string): boolean {
  const entry = getStatusRegistryEntry(statusId);
  return entry?.status === "active";
}
