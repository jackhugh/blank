import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';

const Occasions: CollectionConfig = {
  slug: 'occasions',
  fields: [
    {
      name: 'tag',
      type: 'relationship',
      relationTo: 'tags',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
    },
    {
      name: 'date',
      type: 'date',
    },
  ],
};

export default Occasions;
