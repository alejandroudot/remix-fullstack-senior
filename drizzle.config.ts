// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite', // importante
  schema: './app/infra/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // para sqlite local
    url: './featurelab.db', // o 'featurelab.db' a secas, ambas valen para local
  },
});
