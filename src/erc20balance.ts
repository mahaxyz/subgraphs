import { Transfer as TransferEvent } from "../generated/erc20/erc20";
import { TokenBalance } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  if (
    event.params.to.toHexString() ===
    "0x0000000000000000000000000000000000000000"
  ) {
    let tokenBalance = TokenBalance.load(event.params.from.toHexString());
    if (!tokenBalance) {
      tokenBalance = new TokenBalance(event.params.from.toHexString());
      tokenBalance.balance = event.params.value;
    } else {
      tokenBalance.balance = tokenBalance.balance.minus(event.params.value);
    }
    tokenBalance.save();
  } else if (
    event.params.from.toHexString() ===
    "0x0000000000000000000000000000000000000000"
  ) {
    let tokenBalance = TokenBalance.load(event.params.to.toHexString());
    if (!tokenBalance) {
      tokenBalance = new TokenBalance(event.params.to.toHexString());
      tokenBalance.balance = event.params.value;
    } else {
      tokenBalance.balance = tokenBalance.balance.plus(event.params.value);
    }
    tokenBalance.save();
  }
}
