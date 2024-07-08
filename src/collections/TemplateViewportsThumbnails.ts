import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';

export const TemplateViewportsThumbnails: CollectionConfig = {
  slug: 'template-viewports-thumbnails',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
};
