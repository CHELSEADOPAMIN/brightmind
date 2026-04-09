export type HealthdirectOverlay = Record<string, { bulkBilling: boolean }>;

export async function fetchHealthdirectOverlay(): Promise<HealthdirectOverlay> {
  return Promise.resolve({
    'dr-olivia-ng': { bulkBilling: true },
    'dr-james-porter': { bulkBilling: false },
    'dr-amelie-rousseau': { bulkBilling: true },
    'dr-carlos-mendez': { bulkBilling: false },
    'dr-hannah-cho': { bulkBilling: true },
  });
}
