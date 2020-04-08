import DB from "./db";
import { Product } from "../types";
import {
  BRINGMEISTER,
  getProductFromUrl as getBringmeisterProductFromUrl,
} from "./bringmeister";

function scrap(product: Product) {
  if (product.vendor === BRINGMEISTER) {
    return getBringmeisterProductFromUrl(product.url);
  }
  return undefined;
}

export async function getAvailableProducts(): Promise<Product[]> {
  const db = DB();

  const products = db.getAllProducts();
  return (await Promise.all(products.map(scrap))).filter((p) => p.available);
}
