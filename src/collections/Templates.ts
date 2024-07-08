import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import Tags from './Tags';

const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    description:
      'A template is a blueprint for a set of template viewports and a frame',
    useAsTitle: 'handle',
  },
  fields: [
    {
      name: 'handle',
      unique: true,
      type: 'text',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      minRows: 1,
      hasMany: true,
    },
    {
      name: 'templateViewports',
      type: 'relationship',
      relationTo: 'template-viewports',
      required: true,
    },
  ],
};

export default Templates;
