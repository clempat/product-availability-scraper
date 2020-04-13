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
  const refreshedProducts = await Promise.all(products.map(scrap));

  return products.map((product) => {
    const refreshProduct = refreshedProducts.find(
      (refreshedProduct) => product.url === refreshedProduct.url
    );
    if (!refreshedProducts) return product;
    return {
      ...product,
      available: refreshProduct.available,
    };
  });
}
