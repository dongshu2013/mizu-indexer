import { isAddress, getAddress } from "viem";

import { HexString, ServerError, Passkey } from "./types";
import { RedisService } from "./redis";

export const genKey = (account: string, event: string) => `${event}:${account}`;

export const NEW_OPERATORS_TOPIC_HASH =
  "0xeb6e48d00efa89b9649281149c3110eced61248a05e3a988265bf9dd5e50e180";
export const METADATA_TOPIC_HASH =
  "0xf7f858c27d9977938c4bafca84e6e31f3a77a0c886ced88da68429240ab1313e";
export const PASSKEY_TOPIC_HASH =
  "0x6d609710e6d70b04cc713f483dc5e373b72e140a9aa303a22c97b4a71d8658b0";

export const getOperatorsFromAddress = async (
  address: HexString
): Promise<{ operators: HexString[]; block: number } | undefined> => {
  if (!isAddress(address)) {
    throw new ServerError(400, "invalid address");
  }
  const normalized = getAddress(address) as HexString;
  const redis = await RedisService.getInstance();
  const value = await redis.get(genKey(normalized, NEW_OPERATORS_TOPIC_HASH));
  if (value) {
    const parsed = JSON.parse(value);
    const operators = parsed.operators.slice(2); // remove "0x"
    return {
      operators: operators
        .match(/.{40}/g)
        .map((c: string) => getAddress("0x" + c)),
      block: parsed.block,
    } as { operators: HexString[]; block: number };
  }
};

export const getMetadataFromAddress = async (
  address: string
): Promise<{ metadata: string; block: number } | undefined> => {
  if (!isAddress(address)) {
    throw new ServerError(400, "invalid address");
  }
  const normalized = getAddress(address) as HexString;
  const redis = await RedisService.getInstance();
  const metadata = await redis.get(genKey(normalized, METADATA_TOPIC_HASH));
  if (metadata) {
    return JSON.parse(metadata) as { metadata: string; block: number };
  }
};

export const getPasskeyFromAddress = async (
  address: string
): Promise<{ passkey: Passkey; block: number } | undefined> => {
  if (!isAddress(address)) {
    throw new ServerError(400, "invalid address");
  }
  const normalized = getAddress(address) as HexString;
  const redis = await RedisService.getInstance();
  const value = await redis.get(genKey(normalized, PASSKEY_TOPIC_HASH));
  if (value) {
    const parsed = JSON.parse(value);
    const passkey = {
      id: parsed.passkey.id,
      pub_key: {
        x: Buffer.from(parsed.passkey.x, "hex"),
        y: Buffer.from(parsed.passkey.y, "hex"),
      },
    };
    return {
      passkey,
      block: parsed.block,
    } as { passkey: Passkey; block: number };
  }
};
