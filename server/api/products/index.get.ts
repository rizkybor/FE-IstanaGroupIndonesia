// server/api/products/index.get.ts
import { $fetch } from "ofetch";
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event);
  return await $fetch(`${base}/products`, { headers });
});
