import DB from "./db";
import { Product } from "../types";
import {
  getProductFromUrl as getBringmeisterProductFromUrl,
  isBringmeisterUrl,
} from "./bringmeister";

function scrap(url: string) {
  if (isBringmeisterUrl(url)) {
    return getBringmeisterProductFromUrl(url);
  }
  return undefined;
}

export async function getAvailableProducts(): Promise<Product[]> {
  const db = DB();

  const products = db.getAllProducts();
  const refreshedProducts = await Promise.all(
    [...new Set(products.map((p) => p.url))].map(scrap)
  );

  return products
    .map((product) => {
      const refreshProduct = refreshedProducts.find(
        (rp) => product.url === rp.url
      );
      if (!refreshedProducts) return product;
      return {
        ...product,
        available: refreshProduct.available,
      };
    })
    .filter((p) => p.available);
}
