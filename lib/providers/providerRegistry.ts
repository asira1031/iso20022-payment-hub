import { BankConnector } from "./bankConnector";
import { mockConnector } from "./mockConnector";
import { swiftConnector } from "./swiftConnector";
import { openBankingConnector } from "./openBankingConnector";

export type ProviderKey = "mock" | "swift" | "open_banking";

const providers: Record<ProviderKey, BankConnector> = {
  mock: mockConnector,
  swift: swiftConnector,
  open_banking: openBankingConnector,
};

export function getProvider(provider: ProviderKey): BankConnector {
  return providers[provider] || mockConnector;
}

export function listProviders() {
  return Object.keys(providers);
}