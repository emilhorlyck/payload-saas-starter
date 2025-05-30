import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { fileURLToPath } from 'url'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, Config } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

// If you want to use Cloudflare R2 or AWS S3, uncomment the following lines
// import { s3Storage } from '@payloadcms/storage-s3'

import sharp from 'sharp'
import path from 'path'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
            email: 'test@example.com',
            password: 'test',
            prefillOnly: false,
          }
        : false,
  },
  collections: [
    Users,
    Media,
    {
      slug: 'tenants',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'repos',
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.SQLITE_URI || '',
    },
  }),
  // postgresAdapter({
  //   pool: {
  //     connectionString: process.env.DATABASE_URI || '',
  //   },
  // }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      collections: {
        media: {},
        repos: {},
      },
      userHasAccessToAllTenants(user) {
        // Only admin users can access all tenants
        return user?.role === 'admin'
      },

      useTenantsCollectionAccess: true,
      // useUsersTenantFilter: false,
      // useTenantsListFilter: false,
    }),
    // vercelBlobStorage({
    //   enabled: true,
    //   collections: {
    //     media: true,
    //   },
    //   token: process.env.BLOB_READ_WRITE_TOKEN || '',
    // })

    // s3Storage({
    //   collections: {
    //     media: true,
    //   },
    //   bucket: process.env.R2_BUCKET || '',
    //   config: {
    //     endpoint: process.env.R2_ENDPOINT || '',
    //     credentials: {
    //       accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    //       secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    //     },
    //     region: 'auto',
    //     forcePathStyle: true,
    //   },
    // }),
  ],
})
