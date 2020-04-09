import { Product } from "../types";
import axios from "axios";
import cheerio from "cheerio";
import { Product as ProductSchema, Offer } from "schema-dts";

export const isBringmeisterUrl = (url: string) =>
  url.indexOf("bringmeister.de");

export const BRINGMEISTER = "Bringmeister";

export const getProductFromUrl = async (url: string): Promise<Product> => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const product: ProductSchema = JSON.parse(
    $('[data-cy="productDetailMarkup"]').html()
  );

  if (!product) return;

  const offer = product.offers as Offer;

  return {
    name: product.name as string,
    available: offer.availability === "http://schema.org/InStock",
    vendor: "Bringmeister",
    url,
  };
};
