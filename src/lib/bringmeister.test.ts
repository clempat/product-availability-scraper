import fs from "fs";
import path from "path";
import { getProductFromUrl, BRINGMEISTER } from "./bringmeister";
import axios from "axios";

jest.mock("axios");

const axiosMock = axios as jest.Mocked<typeof axios>;

const mocks = {
  available: fs.readFileSync(
    path.resolve("./mocks/bringmeister_available.html")
  ),
  not_available: fs.readFileSync(
    path.resolve("./mocks/bringmeister_not_available.html")
  ),
};

describe("bringmeister", () => {
  it("should extract product from bringmeister url when available", async () => {
    axiosMock.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mocks.available })
    );
    const product = await getProductFromUrl("http://available");
    expect(product).toEqual({
      name: "EDEKA Bio WWF Junge Erbsen",
      available: true,
      vendor: BRINGMEISTER,
      url: "http://available",
    });
  });
  it("should extract product from bringmeister url when NOT available", async () => {
    axiosMock.get.mockImplementationOnce(() =>
      Promise.resolve({ data: mocks.not_available })
    );
    const product = await getProductFromUrl("http://not-available");
    expect(product).toEqual({
      name: "GUT&GÜNSTIG Toilettenpapier 3-lagig 10x200 Blatt",
      available: false,
      vendor: BRINGMEISTER,
      url: "http://not-available",
    });
  });
});
