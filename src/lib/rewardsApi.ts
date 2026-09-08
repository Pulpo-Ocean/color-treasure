import { requireSession, supabase } from './supabase';

export type ChestReward = {
  reward_code: string;
  reward_type: string;
  amount: number;
  character_code?: string | null;
  chest_code: string;
  version: number;
};

export type OpenChestResult = {
  ok: boolean;
  duplicate: boolean;
  claim_id: string;
  reward_payload: ChestReward;
  balance?: number;
};

/** Opens a chest through the trusted server. The client never supplies a reward. */
export async function openChest(chestCode: string, claimKey: string): Promise<OpenChestResult> {
  await requireSession();
  const { data, error } = await supabase.functions.invoke('rewards-v1', {
    body: { action: 'open_chest', chest_code: chestCode, claim_key: claimKey },
  });
  if (error) throw new Error(`REWARDS_API_ERROR:${error.message}`);
  if (!data || data.error) throw new Error(String(data?.error ?? 'CHEST_OPEN_FAILED'));
  return data as OpenChestResult;
}
