import { requireSession, supabase } from './supabase';

export type ResourceBalances = {
  coins: number;
  gems: number;
  lives: number;
  boosters: number;
  stars: number;
  fragments: number;
};

const EMPTY: ResourceBalances = { coins: 0, gems: 0, lives: 0, boosters: 0, stars: 0, fragments: 0 };

export async function getResourceBalances(): Promise<ResourceBalances> {
  const session = await requireSession();
  const { data, error } = await supabase
    .from('inventories')
    .select('resource_code,balance')
    .eq('user_id', session.user.id);
  if (error) throw new Error(`RESOURCES_LOAD_ERROR:${error.message}`);

  const result = { ...EMPTY };
  for (const row of data ?? []) {
    const code = String(row.resource_code) as keyof ResourceBalances;
    if (code in result) result[code] = Math.max(0, Number(row.balance));
  }
  return result;
}
