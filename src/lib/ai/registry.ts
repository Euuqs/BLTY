import type { CompanionProvider } from "./provider";
import { mockCompanionProvider } from "./providers/mock";
import { deepSeekCompanionProvider } from "./providers/deepseek";

const providers: Record<string, CompanionProvider> = {
  mock: mockCompanionProvider,
  deepseek: deepSeekCompanionProvider,
};

export function getCompanionProvider(providerId = process.env.COMPANION_PROVIDER ?? "mock") {
  const provider = providers[providerId];
  if (!provider) throw new Error(`Unsupported companion provider: ${providerId}`);
  return provider;
}
