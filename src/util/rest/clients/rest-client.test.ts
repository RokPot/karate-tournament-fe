import type { AxiosRequestConfig } from "axios";
import { z } from "zod";

import { RestClient } from "./rest-client";

const clientWithAdapter = (data: unknown) =>
  new RestClient({
    config: {
      adapter: async (config: AxiosRequestConfig) => ({
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      }),
    } as never,
  });

describe("RestClient file downloads", () => {
  it("returns a Blob response instead of treating it as empty", async () => {
    const client = clientWithAdapter(new Blob(["%PDF-1.4"]));

    const result = await client.get(
      { resSchema: z.instanceof(Blob) },
      "/file.pdf",
      { responseType: "blob" },
    );

    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(8);
  });

  it("still returns null for an empty JSON body", async () => {
    const client = clientWithAdapter({});

    const result = await client.get({ resSchema: z.void() }, "/empty");

    expect(result).toBeNull();
  });
});
