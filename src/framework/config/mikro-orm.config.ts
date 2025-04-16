import { GeneratedCacheAdapter, LoadStrategy } from '@mikro-orm/core';
import { defineConfig, Options } from '@mikro-orm/postgresql';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { config } from 'dotenv';
import { SoftDeleteHandler } from 'mikro-orm-soft-delete';

import { isProd, isDev } from '../../common/constant';

config();

export const mikroOrmConfig: Options = defineConfig({
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  debug: !isProd,
  extensions: [SoftDeleteHandler],
  baseDir: process.cwd(),
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  loadStrategy: LoadStrategy.JOINED,
  metadataCache: {
    enabled: true,
    adapter: GeneratedCacheAdapter,
    options: { data: './temp/metadata.json' },
  },
  driverOptions:
    isProd || isDev
      ? {
          connection: {
            ssl: { rejectUnauthorized: false },
          },
        }
      : undefined,
});

const createMikroOrmConfig = async (): Promise<Options> => {
  return mikroOrmConfig;
};

export default createMikroOrmConfig;
