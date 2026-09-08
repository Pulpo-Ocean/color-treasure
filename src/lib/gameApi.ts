import { supabase, requireSession } from './supabase';

export type GameState = {
  version: number;
  session_id: string;
  level_id: number;
  resumed?: boolean;
  seed?: number;
  move_count: number;
  board_state: number[];
  state_hash: string;
  objective_progress: number;
  result: 'CONTINUE' | 'WIN' | 'FAIL' | null;
  status?: 'active' | 'won' | 'failed' | 'expired' | 'aborted';
  obstacle_state: Record<string, unknown>;
  special_state: unknown[];
  rewards?: Record<string, unknown>;
  mixed_progress?: Record<string, unknown> | null;
  mixed_conditions_completed?: number | null;
};

async function invoke(body: Record<string, unknown>): Promise<GameState> {
  await requireSession();
  const { data, error } = await supabase.functions.invoke('game-v2', { body });
  if (error) throw new Error(error.message);
  if (!data || data.ok === false || data.error) {
    throw new Error(String(data?.error ?? 'GAME_API_ERROR'));
  }
  return data as GameState;
}

export function startLevel(levelId: number) {
  return invoke({ action: 'start', level_id: levelId });
}

export function applyMove(
  sessionId: string,
  moveNumber: number,
  actionType: 'clear_group' | 'activate_special',
  cell: number,
) {
  return invoke({
    action: 'move',
    session_id: sessionId,
    action_type: actionType,
    action_payload: { cell },
    expected_move_number: moveNumber,
  });
}

export function getGameState(sessionId: string) {
  return invoke({ action: 'state', session_id: sessionId });
}
