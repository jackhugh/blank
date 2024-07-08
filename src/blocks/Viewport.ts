import { Block } from 'payload/types';

export const Viewport: Block = {
  slug: 'viewport',
  fields: [
    {
      name: 'portrait',
      type: 'group',
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
        },
        {
          name: 'width',
          type: 'number',
          required: true,
        },
        {
          name: 'height',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'landscape',
      type: 'group',
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
        },
        {
          name: 'width',
          type: 'number',
          required: true,
        },
        {
          name: 'height',
          type: 'number',
          required: true,
        },
      ],
    },
  ],
};
