import { Transfer as TransferEvent } from "../generated/erc20/erc20";
import { handleTransferEvent } from "./helper";

export function handleTransferUSDZ(event: TransferEvent): void {
  handleTransferEvent(event, "usdz");
}

export function handleTransferSUSDZ(event: TransferEvent): void {
    handleTransferEvent(event, "susdz");
}

export function handleTransferMAHA(event: TransferEvent): void {
    handleTransferEvent(event, "maha");
}

export function handleTransferSZAIFRAXBP(event: TransferEvent): void {
  handleTransferEvent(event, "szaifraxbp");
}

export function handleTransferSUSDZUSDC(event: TransferEvent): void {
  handleTransferEvent(event, "sUSDzUSDC");
}

export function handleTransferSMAHAUSDZ(event: TransferEvent): void {
  handleTransferEvent(event, "sMAHAUSDz");
}
