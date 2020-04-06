import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Product } from "../types";

const adapter = new FileSync("./db.json");

const db = low(adapter);

db.defaults = { products: [], client: [] };

export const addProduct = (product: Product) => {};
