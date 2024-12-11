import { Transfer as TransferEvent } from "../generated/MAHA/erc20";
import { handleTransferEvent } from "./helper";

export function handleTransferZAI(event: TransferEvent): void {
  handleTransferEvent(event, "zai");
}

export function handleTransferSZAI(event: TransferEvent): void {
    handleTransferEvent(event, "szai");
}

export function handleTransferMAHA(event: TransferEvent): void {
    handleTransferEvent(event, "maha");
}

export function handleTransferSZAISZAI(event: TransferEvent): void {
  handleTransferEvent(event, "szaiszai");
}

export function handleTransferSZAIUSDC(event: TransferEvent): void {
  handleTransferEvent(event, "sszaiusdc");
}

export function handleTransferSMAHAZAI(event: TransferEvent): void {
  handleTransferEvent(event, "smahaszai");
}

export function handleTransferMAHAXVP(event: TransferEvent): void {
  handleTransferEvent(event, "mahaxvp");
}
