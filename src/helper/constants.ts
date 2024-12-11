import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

export const assetDenomination = new Map<string, BigInt>();
assetDenomination.set("zai", BigInt.fromI32(10).pow(18));
assetDenomination.set("szai", BigInt.fromI32(10).pow(18));
assetDenomination.set("maha", BigInt.fromI32(10).pow(18));
assetDenomination.set("szaiszai", BigInt.fromI32(10).pow(18));
assetDenomination.set("szaiusdc", BigInt.fromI32(10).pow(18));
assetDenomination.set("smahazai", BigInt.fromI32(10).pow(18));


export const minAmount = BigDecimal.fromString("0");
export const maxAmount = BigDecimal.fromString("5000"); /// 5k
export const minBoost = BigDecimal.fromString("1");
export const maxBoost = BigDecimal.fromString("5");
export const secondsInDay = BigDecimal.fromString("86400");