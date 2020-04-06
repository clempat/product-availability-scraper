export enum Vendor {
  Bringmeister,
  Amazon,
  Rewe,
  DM,
}

export type Product = {
  name: string;
  url: string;
  available: boolean;
  vendor: keyof typeof Vendor;
};

export type Client = {};
