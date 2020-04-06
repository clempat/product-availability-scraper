import { Vendor } from "../types";
export function detectVendor(url: string): keyof typeof Vendor | undefined {
  if (url.indexOf("bringmeister.de")) {
    return "Bringmeister";
  }
  return;
}
