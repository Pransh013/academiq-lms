import arcjet, { shield } from "@arcjet/next";

import { env } from "@/env/server";

const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["fingerprint"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

export default aj;
