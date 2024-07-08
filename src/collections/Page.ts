import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';
import { allBlocks } from '../all-blocks';
import { OverrideBlocks } from '../blocks/OverrideBlocks';

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      type: 'group',
      name: 'URLs',
      fields: [
        {
          name: 'Web',
          type: 'text',
        },
        {
          name: 'iOS',
          type: 'text',
        },
        {
          name: 'Android',
          type: 'text',
        },
      ],
    },
    {
      name: 'defaultBlocks',
      type: 'relationship',
      relationTo: 'blocks',
      hasMany: true,
    },
  ],
};

export default Pages;
