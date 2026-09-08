import { requireSession, supabase } from './supabase';

export const RESOURCE_CODES = ['coins', 'gems', 'lives', 'boosters', 'stars', 'fragments'] as const;
export type ResourceCode = (typeof RESOURCE_CODES)[number];

export type ResourceBalances = Record<ResourceCode, number>;

const emptyBalances = (): ResourceBalances => ({
  coins: 0,
  gems: 0,
  lives: 0,
  boosters: 0,
  stars: 0,
  fragments: 0,
});

export async function getInventory(): Promise<ResourceBalances> {
  await requireSession();
  const { data, error } = await supabase
    .from('inventories')
    .select('resource_code,balance')
    .in('resource_code', [...RESOURCE_CODES]);

  if (error) throw new Error(`INVENTORY_READ_ERROR:${error.message}`);

  const balances = emptyBalances();
  for (const row of data ?? []) {
    const code = String(row.resource_code) as ResourceCode;
    if (!RESOURCE_CODES.includes(code)) continue;
    const balance = Number(row.balance);
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw new Error('INVENTORY_INVALID_BALANCE');
    }
    balances[code] = balance;
  }
  return balances;
}
