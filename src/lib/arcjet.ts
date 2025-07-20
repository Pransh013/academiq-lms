import "server-only";

import arcjet, { shield } from "@arcjet/next";

import { env } from "@/env/server";

export default arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});