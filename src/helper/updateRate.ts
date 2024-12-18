import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { secondsInDay } from "./constants";

export const calculateRate = (
  currentBalance: BigInt,
  denomination: BigInt
): BigDecimal => {

  const tokens = new BigDecimal(currentBalance).div(
    new BigDecimal(denomination)
  );

  const rate = tokens.div(secondsInDay);
  return rate;
};
