import { TokenBalance } from "../../generated/schema";
import { Transfer as TransferEvent } from "../../generated/erc20/erc20";
import { BigInt, Address } from "@graphprotocol/graph-ts";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

function updateBalance(
  address: Address,
  token: string,
  amount: BigInt,
  subtract: boolean
): void {
  if (address.toHexString() === ZeroAddress) {
    return
  }
  let tokenBalance = TokenBalance.load(address.toHexString());
  if (!tokenBalance) {
    tokenBalance = new TokenBalance(address.toHexString());
    tokenBalance.usdz = BigInt.fromI32(0);
    tokenBalance.susdz = BigInt.fromI32(0);
    tokenBalance.maha = BigInt.fromI32(0);
    tokenBalance.szaifraxbp = BigInt.fromI32(0);
    tokenBalance.susdzusdc = BigInt.fromI32(0);
    tokenBalance.smahausdz = BigInt.fromI32(0);
  }

  if (subtract) {
    if (token === "usdz") tokenBalance.usdz = tokenBalance.usdz.minus(amount);
    else if (token === "susdz")
      tokenBalance.susdz = tokenBalance.susdz.minus(amount);
    else if (token === "maha")
      tokenBalance.maha = tokenBalance.maha.minus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.szaifraxbp = tokenBalance.szaifraxbp.minus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.susdzusdc = tokenBalance.susdzusdc.minus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.smahausdz = tokenBalance.smahausdz.minus(amount);
  } else {
    if (token === "usdz") tokenBalance.usdz = tokenBalance.usdz.plus(amount);
    else if (token === "susdz")
      tokenBalance.susdz = tokenBalance.susdz.plus(amount);
    else if (token === "maha")
      tokenBalance.maha = tokenBalance.maha.plus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.szaifraxbp = tokenBalance.szaifraxbp.plus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.susdzusdc = tokenBalance.susdzusdc.plus(amount);
    else if (token === "szaifraxbp")
      tokenBalance.smahausdz = tokenBalance.smahausdz.plus(amount);
  }

  tokenBalance.save();
}

// mint
function addToBalance(address: Address, token: string, amount: BigInt): void {
  updateBalance(address, token, amount, false);
}

// burn
function subFromBalance(address: Address, token: string, amount: BigInt): void {
  updateBalance(address, token, amount, true);
}

// transfer
function transfer(
  from: Address,
  to: Address,
  token: string,
  amount: BigInt
): void {
  addToBalance(to, token, amount);
  subFromBalance(from, token, amount);
}

export function handleTransferEvent(event: TransferEvent, symbol: string): void {
  const from = event.params.from;
  const to = event.params.to;
  const value = event.params.value;

  if (from.toHexString() == ZeroAddress) { // mint
    addToBalance(to, symbol, value);
  } else if (to.toHexString() == ZeroAddress) { // burn
    subFromBalance(from, symbol, value);
  } else { // transfer
    transfer(from, to, symbol, value);
  }
}
