import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { minAmount, minBoost, maxAmount, maxBoost } from "./constants";

export const calculateBoost = (_amount: BigInt): BigDecimal => {
  // Ensure the amount is within the allowed range
  const amount = new BigDecimal(_amount).div(
    BigDecimal.fromString("1000000000000000000")
  );

  if (amount <= minAmount) {
    return minBoost;
  } else if (amount >= maxAmount) {
    return maxBoost;
  }

  // Calculate the boost based on linear interpolation
  /* const boost =
      minBoost +
      ((amount - minAmount) * (maxBoost - minBoost)) / (maxAmount - minAmount); */
  const boost = minBoost.plus(
    amount.times(BigDecimal.fromString("4")).div(maxAmount)
  );
  return boost;
};
