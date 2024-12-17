import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Mint } from "../../generated/schema";

export function zaiMinted(address: Address, amount: BigInt): void {
  let MintData = Mint.load(address.toHexString());
  if (!MintData) {
    MintData = new Mint(address.toHexString());
    MintData.zai = BigInt.fromI32(0);
  }
  MintData.zai = MintData.zai!.plus(amount);
  MintData.save();
}

