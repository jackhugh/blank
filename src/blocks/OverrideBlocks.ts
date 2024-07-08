import { Block } from 'payload/types';
import { allBlocks } from '../all-blocks';

export const OverrideBlocks: Block = {
  slug: 'override-blocks',
  fields: [
    {
      name: 'platformOptions',
      type: 'group',
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
      name: 'userOptions',
      type: 'group',
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
      name: 'splitOptions',
      type: 'group',
      fields: [
        {
          name: 'splits',
          type: 'array',
          fields: [
            {
              name: 'Name',
              type: 'text',
            },
            {
              name: 'Treatment',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'Blocks',
      type: 'blocks',
      blocks: allBlocks,
    },
  ],
};
