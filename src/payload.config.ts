import path from 'path';

import { payloadCloud } from '@payloadcms/plugin-cloud';
import { mongooseAdapter } from '@payloadcms/db-mongodb'; // database-adapter-import
import { webpackBundler } from '@payloadcms/bundler-webpack'; // bundler-import
import { slateEditor } from '@payloadcms/richtext-slate'; // editor-import
import { buildConfig } from 'payload/config';

import Users from './collections/Users';
import { Illustrations } from './collections/Illustration';
import Templates from './collections/Templates';
import TemplateViewports from './collections/TemplateViewports';
import Themes from './collections/Themes';
import Tags from './collections/Tags';
import Pages from './collections/Page';
import { ThemeSlider } from './blocks/ThemeSlider';
import Blocks from './collections/Blocks';
import { TemplateViewportsThumbnails } from './collections/TemplateViewportsThumbnails';
import EditorTags from './globals/EditorTags';
import Occasions from './collections/Occasions';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(), // bundler-config
  },
  editor: slateEditor({}), // editor-config
  collections: [
    Users,
    Illustrations,
    Tags,
    Templates,
    TemplateViewports,
    Themes,
    Pages,
    Blocks,
    TemplateViewportsThumbnails,
    Occasions,
  ],
  localization: {
    defaultLocale: 'UK',
    locales: ['UK', 'US', 'EU', 'AU', 'CA'],
    fallback: true,
  },
  globals: [EditorTags],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  // database-adapter-config-start
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  // database-adapter-config-end
});
