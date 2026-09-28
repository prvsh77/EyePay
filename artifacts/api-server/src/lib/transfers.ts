import { db, wallets, transactions, users } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface SendRow {
  id: number;
  walletId: number;
  amount: string;
  currency: string;
  destinationCountry: string;
}

/**
 * Credits the wallet of the EyePay user a recipient is linked to, mirroring
 * the sender's 'send' row with a 'receive' row on the receiver's wallet.
 *
 * Must be called inside the same DB transaction as the sender's debit (on
 * initiation for clean transfers, on admin approval for flagged ones). Locks
 * the receiver's wallet row FOR UPDATE and does the arithmetic in Postgres,
 * matching the debit side.
 */
export async function creditLinkedRecipient(tx: Tx, send: SendRow, linkedUserId: number): Promise<void> {
  const [sender] = await tx
    .select({ name: users.name })
    .from(wallets)
    .innerJoin(users, eq(users.id, wallets.userId))
    .where(eq(wallets.id, send.walletId))
    .limit(1);

  const [receiverWallet] = await tx
    .select({ id: wallets.id })
    .from(wallets)
    .where(eq(wallets.userId, linkedUserId))
    .for("update")
    .limit(1);

  if (!receiverWallet) {
    throw new Error("Recipient wallet not found");
  }

  await tx
    .update(wallets)
    .set({ balance: sql`${wallets.balance} + ${send.amount}::numeric` })
    .where(eq(wallets.id, receiverWallet.id));

  await tx.insert(transactions).values({
    walletId: receiverWallet.id,
    type: "receive",
    amount: send.amount,
    currency: send.currency,
    status: "completed",
    description: `Received from ${sender?.name ?? "EyePay user"}`,
    destinationCountry: send.destinationCountry,
    relatedTransactionId: send.id,
  });
}
