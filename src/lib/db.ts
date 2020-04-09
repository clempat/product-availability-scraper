import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Product } from "../types";

const adapter = new FileSync("./db.json");

const db = low(adapter);

db.defaults({ products: [] }).write();

const premium = (process.env.PREMIUM_CHAT_IDS || "").split(",");

export default function (clientId?: number) {
  const addProduct = (product: Product) => {
    if (!clientId) return;
    const clientProducts = db.get("products").filter({ clientId });

    if (!premium.includes(clientId.toString())) {
      const amount = clientProducts.size().value();
      if (amount >= 10)
        throw new Error(
          `Sorry, you already reach the limit of 10 products saved into your watchlist`
        );
    }

    if (clientProducts.filter({ url: product.url }).size().value() > 0) {
      throw new Error(
        `⏰ "${product.name}" is already in you watch list, you need to be more patient`
      );
    }

    db.get("products")
      .push({
        ...product,
        clientId,
      } as Product)
      .write();
  };

  const getAllProducts = () => (db.get("products").value() || []) as Product[];

  const deleteProducts = (products: Product[]) => {
    products.forEach((product) => {
      db.remove({ url: product.url, clientId }).write();
    });
  };

  return {
    addProduct,
    getAllProducts,
    deleteProducts,
  };
}
