import { requireSession, supabase } from './supabase';

export type PurchaseResult = {
  ok: boolean;
  status: string;
  purchase_id?: string;
  granted?: boolean;
  gems?: number;
  balance?: number;
};

/**
 * Sends only the provider transaction proof to the trusted server.
 * The client never supplies a Gem amount and never mutates inventory.
 */
export async function verifyPurchase(productId: string, provider: 'apple' | 'google', providerTransactionId: string, receipt: string): Promise<PurchaseResult> {
  await requireSession();
  const { data, error } = await supabase.functions.invoke('purchase-v1', {
    body: {
      action: 'verify',
      product_id: productId,
      provider,
      provider_transaction_id: providerTransactionId,
      receipt,
    },
  });
  if (error) throw new Error(`PURCHASE_API_ERROR:${error.message}`);
  if (!data || data.error) throw new Error(String(data?.error ?? 'PURCHASE_VERIFICATION_FAILED'));
  return data as PurchaseResult;
}
