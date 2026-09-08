import { supabase, requireSession } from './supabase';

export type ProgressionState = {
  version: number;
  highest_completed: number;
  current_level: number;
  completed_levels: number[];
  total_levels: number;
};

export async function getProgression(): Promise<ProgressionState> {
  await requireSession();
  const { data, error } = await supabase.functions.invoke('progression-v1', { body: {} });
  if (error) throw new Error(error.message);
  if (!data || data.error) throw new Error(String(data?.error ?? 'PROGRESSION_API_ERROR'));
  return data as ProgressionState;
}
