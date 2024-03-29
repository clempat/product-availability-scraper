export enum Vendor {
  Bringmeister,
  Amazon,
  Rewe,
  DM,
}

export type Product = {
  id: string;
  name: string;
  url: string;
  available: boolean;
  vendor: keyof typeof Vendor;
  clientId?: number;
};

export type Client = {};
