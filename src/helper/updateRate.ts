import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { secondsInDay } from "./constants";

export const calculateRate = (
  currentBalance: BigInt,
  denomination: BigInt
): BigDecimal => {
  log.info("denomination".concat(denomination.toString()), []);
  const tokens = new BigDecimal(currentBalance).div(
    new BigDecimal(denomination)
  );
  log.info("tokens".concat(tokens.toString()), []);
  log.info("secondsInDay".concat(secondsInDay.toString()), []);

  const rate = tokens.div(secondsInDay);
  return rate;
};
