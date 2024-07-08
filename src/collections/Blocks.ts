import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';
import { allBlocks } from '../all-blocks';

const Blocks: CollectionConfig = {
  slug: 'blocks',
  admin: {
    useAsTitle: 'internalName',
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
    },
    {
      name: 'block',
      type: 'blocks',
      blocks: allBlocks,
      minRows: 1,
      maxRows: 1,
    },
    {
      name: 'options',
      type: 'blocks',
      blocks: [
        {
          slug: 'platform',
          fields: [
            {
              name: 'web',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'ios',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'android',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'user-options',
          fields: [
            {
              name: 'isMember',
              type: 'checkbox',
            },
            {
              name: 'isNewUser',
              type: 'checkbox',
            },
          ],
        },
        {
          slug: 'split',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'treatment',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
};

export default Blocks;
