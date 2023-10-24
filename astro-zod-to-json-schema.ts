import fs from "node:fs";
import path from "node:path";

// NOTE: Most typings are overlooked for now.
// This can be enhanced by leveraging more of Astro's public APIs?
// It's not that critical for dev. tooling like this lib,
// and Astro's CC / Assets API are still subject to
// substantial changes anyway.

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// @ts-expect-error Since there are auto-generated on user-land…
import type { SchemaContext } from "astro:content";

export async function astroZodCollectionsToJsonSchemas(
  // FIXME: Some types are not accessible publiquely
  // collectionConfig: ReturnType<typeof defineCollection<any>>
  collectionConfig: any
) {
  await Promise.all(
    Object.entries(collectionConfig).map(async ([key, collection]) => {
      console.info(`Generating JSON Schema for collection "${key}"`);

      // STUB!
      // NOTE: Beware, for future maintenance, syncing is needed
      // (or find a better solution, once APIs are more mature / exposed)
      const context: SchemaContext = {
        image: () => {
          return z.object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            format: z.union([
              z.literal("png"),
              z.literal("jpg"),
              z.literal("jpeg"),
              z.literal("tiff"),
              z.literal("webp"),
              z.literal("gif"),
              z.literal("svg"),
              z.literal("avif"),
            ]),
          });
        },
      };

      const schema =
        // @ts-expect-error ...
        typeof collection.schema === "function"
          ? // @ts-expect-error ...
            collection.schema(context)
          : // @ts-expect-error ...
            collection.schema;

      const builtJsonSchema = zodToJsonSchema(schema);

      fs.promises.writeFile(
        path.join(process.cwd(), "/src/content/", key, `_${key}.schema.json`),
        JSON.stringify(builtJsonSchema, null, 2)
      );
    })
  );
}
