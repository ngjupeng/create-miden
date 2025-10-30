'use client';

import { MIDEN_RPC_URL } from '@/shared/constants';

export async function getConsumableNotes(accountInBech32: string) {
  try {
    const { WebClient, Address } = await import('@demox-labs/miden-sdk');

    const client = await WebClient.createClient(MIDEN_RPC_URL);

    const notes = await client.getConsumableNotes(
      Address.fromBech32(accountInBech32).accountId()
    );

    return notes;
  } catch (error) {
    console.log('ERROR GETTING CONSUMABLE NOTES', error);
    throw new Error('Failed to fetch consumable notes');
  }
}

/**
 *
 * @param sender - Sender address in bech32
 * @param receiver - Receiver address in bech32
 * @param faucet - Faucet address in bech32
 * @param amount - Amount of tokens to send
 * @param isPublic - Whether the note is public or private
 * @returns
 */
export async function createP2IDNote(
  sender: string,
  receiver: string,
  faucet: string,
  amount: number,
  isPublic: boolean
) {
  const {
    FungibleAsset,
    OutputNote,
    Note,
    NoteAssets,
    Felt,
    NoteType,
    Address,
  } = await import('@demox-labs/miden-sdk');

  return OutputNote.full(
    Note.createP2IDNote(
      Address.fromBech32(sender).accountId(),
      Address.fromBech32(receiver).accountId(),
      new NoteAssets([
        new FungibleAsset(
          Address.fromBech32(faucet).accountId(),
          BigInt(amount)
        ),
      ]),
      isPublic ? NoteType.Public : NoteType.Private,
      new Felt(BigInt(0))
    )
  );
}

/**
 *
 * @param sender - Sender address in bech32
 * @param receiver - Receiver address in bech32
 * @param faucet - Faucet address in bech32
 * @param amount - Amount of tokens to send
 * @param isPublic - Whether the note is public or private
 * @param recallHeight - Recall height, the note can be cancel after recall height
 * @returns
 */
export async function createP2IDENote(
  sender: string,
  receiver: string,
  faucet: string,
  amount: number,
  isPublic: boolean,
  recallHeight: number
): Promise<[any, string[], number]> {
  try {
    const { OutputNote, WebClient } = await import('@demox-labs/miden-sdk');

    const client = await WebClient.createClient(MIDEN_RPC_URL);
    const serialNumbers = await randomSerialNumbers();
    const serialNumbersCopy = serialNumbers.map(felt => felt.toString());

    // get current height
    const currentHeight = await client.getSyncHeight();
    recallHeight = currentHeight + recallHeight;

    const note = await _createP2IDENote(
      sender,
      receiver,
      amount,
      faucet,
      recallHeight,
      0,
      isPublic,
      0,
      serialNumbers
    );

    return [OutputNote.full(note), serialNumbersCopy, recallHeight];
  } catch (error) {
    throw new Error('Failed to create P2IDENote');
    console.log(error);
  }
}

export async function _createP2IDENote(
  sender: string,
  receiver: string,
  amount: number,
  faucet: string,
  recallHeight: number,
  timelockHeight: number,
  isPublic: boolean,
  aux: number,
  serialNumber: any[]
) {
  const {
    NoteScript,
    NoteType,
    NoteInputs,
    FeltArray,
    Felt,
    NoteRecipient,
    Word,
    NoteTag,
    NoteMetadata,
    NoteExecutionHint,
    NoteAssets,
    FungibleAsset,
    Note,
    Address,
  } = await import('@demox-labs/miden-sdk');

  const senderId = Address.fromBech32(sender).accountId();
  const receiverId = Address.fromBech32(receiver).accountId();
  const faucetId = Address.fromBech32(faucet).accountId();

  const p2ideNoteScript = NoteScript.p2ide();

  const p2ideInputs = new NoteInputs(
    new FeltArray([
      receiverId.suffix(),
      receiverId.prefix(),
      new Felt(BigInt(recallHeight)),
      new Felt(BigInt(timelockHeight)),
    ])
  );

  const noteRecipient = new NoteRecipient(
    Word.newFromFelts(serialNumber),
    p2ideNoteScript,
    p2ideInputs
  );
  const noteTag = NoteTag.fromAccountId(receiverId);
  const noteMetadata = new NoteMetadata(
    senderId,
    isPublic ? NoteType.Public : NoteType.Private,
    noteTag,
    NoteExecutionHint.always(),
    new Felt(BigInt(aux))
  );
  const noteAssets = new NoteAssets([
    new FungibleAsset(faucetId, BigInt(amount)),
  ]);

  const note = new Note(noteAssets, noteMetadata, noteRecipient);
  return note;
}

async function randomSerialNumbers(): Promise<any[]> {
  const { Felt } = await import('@demox-labs/miden-sdk');

  const randomBytes = new Uint32Array(4);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes).map(value => new Felt(BigInt(value)));
}

export async function generateSecret(): Promise<
  [number, number, number, number]
> {
  const randomBytes = new Uint32Array(4);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes) as [number, number, number, number];
}
