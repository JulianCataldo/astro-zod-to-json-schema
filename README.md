# Astro Content Collections Zod to JSON Schemas

[![Demo screenshot of frontmatter schema linter 1](./docs/screenshot.png)](https://raw.githubusercontent.com/JulianCataldo/remark-lint-frontmatter-schema/master/docs/screenshot.png)

## Installation

```sh
npm install astro-zod-to-json-schema
```

Configure Content Collections:

```diff
import { defineCollection, z } from 'astro:content';
+ import { astroZodCollectionsToJsonSchemas } from 'astro-zod-to-json-schema';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { blog };

+ await astroZodCollectionsToJsonSchemas(collections);
```

Everytime you'll change your `/src/content/config.ts` file while using `astro dev`, each collection schemas will be automatically generated, alongside Astro's type-gen.:

```diff
.
├── ...
├── src
│   ├── content
│   │   ├── blog
+   │   │   ├── _blog.schema.json
│   │   │   ├── first-post.md
│   │   │   ├── second-post.md
│   │   │   ├── third-post.md
│   │   │   └── ...
│   │   └── config.ts
└── ...

18 directories, 35 files

```

Note the **underscore**, so it's ignored by Content Collection loader (analogously to the `pages` folder).  
You can still **import them as regular JSON files** into your project though!  
For example if you need to use them for **OpenAPI**, **AJV**, or anytime you need a
**serialized version of your Zod schemas**, really.

_That's all folks!_

---

Now that you have those sweet serialized schemas, you can
leverage the immense JSON schemas eco-system (see below).

## Use cases

### Lint / validate your Markdown frontmatter

Install remark + plugins:

```sh
npm install -D \
  remark remark-cli \
  remark-frontmatter \
  remark-lint-frontmatter-schema
```

Create the remark config:

```yaml
# ./demo/.remarkrc.yaml

plugins:
  - remark-frontmatter

  - - remark-lint-frontmatter-schema
    - schemas:
        src/content/blog/_blog.schema.json:
          - src/content/blog/*.{md,mdx}
```

> **Note**  
> You can also put it in `./demo/src/content/.remarkrc.yaml`.  
> `remark-lint-frontmatter-schema` will resolve relative paths accordingly from where it's placed (e.g `blog/_blog.schema.json`).

See the [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema) full documentation.

### Auto-generating forms UIs

See the [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe) library.

### Uses with OpenAPI

See the [Astro OpenAPI](https://github.com/JulianCataldo/astro-openapi) library.

## Future maintenance concerns

_Note that those concerns only affect developer maintenance, not really the end user._

`SchemaContext` is subject to changes. This library is stubbing it.  
Typings are not implemented (lacking some comprehension / affordance of Astro's own internal / public APIs for now).  
Also some of the magic is happening in user-land (codegen, Vite virtual modules, etc.), making things a bit more hazardous.  
See notes in code comments.
