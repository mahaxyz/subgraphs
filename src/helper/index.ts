import { Mint, TokenBalance, TokenRate } from "../../generated/schema";
import { Transfer as TransferEvent } from "../../generated/MAHA/erc20";
import {
  BigInt,
  Address,
  BigDecimal,
  bigDecimal,
  log,
} from "@graphprotocol/graph-ts";
import { calculateRate } from "./updateRate";
import {
  assetDenomination,
  maxAmount,
  maxBoost,
  minAmount,
  minBoost,
} from "./constants";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

function updateBalance(
  address: Address,
  token: string,
  amount: BigInt,
  subtract: boolean
): void {
  // if (address.toHexString() ==== ZeroAddress) {
  //   return
  // }
  log.info(amount.toString(), []);

  let tokenBalance = TokenBalance.load(address.toHexString());
  if (!tokenBalance) {
    tokenBalance = new TokenBalance(address.toHexString());
    tokenBalance.zai = BigInt.fromI32(0);
    tokenBalance.szai = BigInt.fromI32(0);
    tokenBalance.maha = BigInt.fromI32(0);
    tokenBalance.szaiszai = BigInt.fromI32(0);
    tokenBalance.szaiusdc = BigInt.fromI32(0);
    tokenBalance.smahazai = BigInt.fromI32(0);
    tokenBalance.mahaxvp = BigInt.fromI32(0);
  }

  let tokenRate = TokenRate.load(address.toHexString());
  if (!tokenRate) {
    tokenRate = new TokenRate(address.toHexString());
  }
  log.info(token, ["line 39"]);
  if (token === "zai") {
    tokenBalance.zai = subtract
      ? tokenBalance.zai!.minus(amount)
      : tokenBalance.zai
      ? tokenBalance.zai!.plus(amount)
      : amount;
    log.info("zai", [tokenBalance.zai!.toString()]);
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
    log.info("szai", [tokenBalance.szai!.toString()]);

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
    log.info("maha", [tokenBalance.maha!.toString()]);

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
    log.info("szaiszai", [tokenBalance.szaiszai!.toString()]);
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
    log.info("szaiusdc", [tokenBalance.szaiusdc!.toString()]);
    tokenRate.szaiusdc = calculateRate(
      tokenBalance.szaiusdc!,
      assetDenomination.get("szaiusdc")
    );
  } else if (token === "smahazai") {
    tokenBalance.smahazai = subtract
      ? tokenBalance.smahazai!.minus(amount)
      : tokenBalance.smahazai
      ? tokenBalance.smahazai!.plus(amount)
      : amount;
    log.info("smahazai", [tokenBalance.smahazai!.toString()]);
    tokenRate.smahazai = calculateRate(
      tokenBalance.smahazai!,
      assetDenomination.get("smahazai")
    );
  } else if (token === "mahaxvp") {
    log.info(amount.toString(), []);
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

export function handleTransferEvent(
  event: TransferEvent,
  symbol: string
): void {
  const from = event.params.from;
  const to = event.params.to;
  const value = event.params.value;

  if (from.toHexString() === ZeroAddress) {
    // mint
    addToBalance(to, symbol, value);
    if (symbol === "zai") {
      zaiMinted(to, value);
    }
  } else if (to.toHexString() === ZeroAddress) {
    // burn
    subFromBalance(from, symbol, value);
  } else {
    // transfer
    transfer(from, to, symbol, value);
  }
}

function zaiMinted(address: Address, amount: BigInt): void {
  let MintData = Mint.load(address.toHexString());
  if (!MintData) {
    MintData = new Mint(address.toHexString());
  }
  MintData.zai = MintData.zai ? MintData.zai!.plus(amount) : amount;
  MintData.save();
}

const calculateBoost = (_amount: BigInt): BigDecimal => {
  // Ensure the amount is within the allowed range
  const amount = new BigDecimal(_amount).div(
    BigDecimal.fromString("1000000000000000000")
  );

  if (amount <= minAmount) {
    return minBoost;
  } else if (amount >= maxAmount) {
    return maxBoost;
  }
  log.info("boost", [amount.toString()]);

  // Calculate the boost based on linear interpolation
  /* const boost =
      minBoost +
      ((amount - minAmount) * (maxBoost - minBoost)) / (maxAmount - minAmount); */
  const boost = minBoost.plus(
    amount.times(BigDecimal.fromString("4")).div(maxAmount)
  );
  return boost;
};
