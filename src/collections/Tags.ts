import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'handle',
    description: 'Tags are used across all assets',
  },
  fields: [
    {
      name: 'handle',
      type: 'text',
      required: true,
    },
    {
      name: 'relatedTags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
  ],
};

export default Tags;
