import { BigInt, Address } from "@graphprotocol/graph-ts";
import { TokenBalance, TokenRate } from "../../generated/schema";
import { calculateBoost } from "./boost";
import { assetDenomination } from "./constants";
import { calculateRate } from "./updateRate";

export function updateBalance(
  address: Address,
  token: string,
  amount: BigInt,
  subtract: boolean
): void {
  // if (address.toHexString() ==== ZeroAddress) {
  //   return
  // }

  let tokenBalance = TokenBalance.load(address.toHexString());
  if (!tokenBalance) {
    tokenBalance = new TokenBalance(address.toHexString());
    tokenBalance.zai = BigInt.fromI32(0);
    tokenBalance.szai = BigInt.fromI32(0);
    tokenBalance.maha = BigInt.fromI32(0);
    tokenBalance.szaiszai = BigInt.fromI32(0);
    tokenBalance.szaiusdc = BigInt.fromI32(0);
    tokenBalance.szaimaha = BigInt.fromI32(0);
    tokenBalance.mahaxvp = BigInt.fromI32(0);
  }

  let tokenRate = TokenRate.load(address.toHexString());
  if (!tokenRate) {
    tokenRate = new TokenRate(address.toHexString());
  }
  if (token === "zai") {
    tokenBalance.zai = subtract
      ? tokenBalance.zai!.minus(amount)
      : tokenBalance.zai
      ? tokenBalance.zai!.plus(amount)
      : amount;
    tokenRate.zai = calculateRate(
      tokenBalance.zai!,
      assetDenomination.get("zai")
    );
  } else if (token === "szai") {
    tokenBalance.szai = subtract
      ? tokenBalance.szai!.minus(amount)
      : tokenBalance.szai
      ? tokenBalance.szai!.plus(amount)
      : amount;

    tokenRate.szai = calculateRate(
      tokenBalance.szai!,
      assetDenomination.get("szai")
    );
  } else if (token === "maha") {
    tokenBalance.maha = subtract
      ? tokenBalance.maha!.minus(amount)
      : tokenBalance.maha
      ? tokenBalance.maha!.plus(amount)
      : amount;

    tokenRate.maha = calculateRate(
      tokenBalance.maha!,
      assetDenomination.get("maha")
    );
  } else if (token === "szaiszai") {
    tokenBalance.szaiszai = subtract
      ? tokenBalance.szaiszai!.minus(amount)
      : tokenBalance.szaiszai
      ? tokenBalance.szaiszai!.plus(amount)
      : amount;
    tokenRate.szaiszai = calculateRate(
      tokenBalance.szaiszai!,
      assetDenomination.get("szaiszai")
    );
  } else if (token === "szaiusdc") {
    tokenBalance.szaiusdc = subtract
      ? tokenBalance.szaiusdc!.minus(amount)
      : tokenBalance.szaiusdc
      ? tokenBalance.szaiusdc!.plus(amount)
      : amount;
    tokenRate.szaiusdc = calculateRate(
      tokenBalance.szaiusdc!,
      assetDenomination.get("szaiusdc")
    );
  } else if (token === "szaimaha") {
    tokenBalance.szaimaha = subtract
      ? tokenBalance.szaimaha!.minus(amount)
      : tokenBalance.szaimaha
      ? tokenBalance.szaimaha!.plus(amount)
      : amount;
    tokenRate.szaimaha = calculateRate(
      tokenBalance.szaimaha!,
      assetDenomination.get("szaimaha")
    );
  } else if (token === "mahaxvp") {
    tokenBalance.mahaxvp = subtract
      ? tokenBalance.mahaxvp!.minus(amount)
      : tokenBalance.mahaxvp
      ? tokenBalance.mahaxvp!.plus(amount)
      : amount;

    // calculate boost
    const boost = calculateBoost(tokenBalance.mahaxvp!);
    tokenRate.mahaxvp_boost = boost;
  }

  tokenBalance.save();
  tokenRate.save();
}

// mint
export function addToBalance(
  address: Address,
  token: string,
  amount: BigInt
): void {
  updateBalance(address, token, amount, false);
}

// burn
export function subFromBalance(
  address: Address,
  token: string,
  amount: BigInt
): void {
  updateBalance(address, token, amount, true);
}

// transfer
export function transfer(
  from: Address,
  to: Address,
  token: string,
  amount: BigInt
): void {
  addToBalance(to, token, amount);
  subFromBalance(from, token, amount);
}
