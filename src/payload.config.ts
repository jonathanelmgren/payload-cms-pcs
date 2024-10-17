// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { gcsAdapter } from '@payloadcms/plugin-cloud-storage/gcs'
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
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    cloudStorage({
      enabled: false,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          adapter: gcsAdapter({
            bucket: process.env.GCS_BUCKET || '',
            options: null,
            acl: 'Public',
          }),
        },
      },
    }),
  ],
})
