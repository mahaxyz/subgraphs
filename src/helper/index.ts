import { log } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../../generated/MAHA/erc20";
import { addToBalance, subFromBalance, transfer } from "./balance";
import { zaiMinted } from "./zaiMint";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

export function handleTransferEvent(
  event: TransferEvent,
  symbol: string
): void {
  const from = event.params.from;
  const to = event.params.to;
  const value = event.params.value;

  if (from.toHexString() == ZeroAddress) {
    // mint
    if (symbol === "zai") {
      zaiMinted(to, value);
    }
    addToBalance(to, symbol, value);
  } else if (to.toHexString() == ZeroAddress) {
    // burn
    subFromBalance(from, symbol, value);
  } else {
    // transfer
    transfer(from, to, symbol, value);
  }
}


