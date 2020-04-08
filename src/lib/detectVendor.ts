import { Vendor } from "../types";
import { isBringmeisterUrl, BRINGMEISTER } from "./bringmeister";

export function detectVendor(url: string): keyof typeof Vendor | undefined {
  if (isBringmeisterUrl(url)) {
    return BRINGMEISTER;
  }
  return;
}
