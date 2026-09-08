import { requireSession, supabase } from './supabase';

export type ChestReward = {
  reward_code: string;
  reward_type: string;
  amount: number;
  character_code?: string | null;
  chest_code: string;
  version: number;
};

export type ChestResult = {
  ok: boolean;
  duplicate: boolean;
  claim_id: string;
  reward_payload: ChestReward;
  balance?: number;
};

export async function openChest(chestCode: string, claimKey: string): Promise<ChestResult> {
  await requireSession();
  const { data, error } = await supabase.functions.invoke('rewards-v1', {
    body: { action: 'open_chest', chest_code: chestCode, claim_key: claimKey },
  });
  if (error) throw new Error(`CHEST_API_ERROR:${error.message}`);
  if (!data || data.error) throw new Error(String(data?.error ?? 'CHEST_OPEN_FAILED'));
  return data as ChestResult;
}
