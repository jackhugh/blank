import { Block } from 'payload/types';

export const ThemeSlider: Block = {
  slug: 'theme-slider',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [
        {
          slug: 'tag-slider',
          fields: [
            {
              name: 'tag',
              type: 'relationship',
              relationTo: 'tags',
              required: true,
            },
            {
              name: 'subTag',
              type: 'relationship',
              relationTo: 'tags',
            },
          ],
        },
        {
          slug: 'themes-selection',
          fields: [
            {
              name: 'themes',
              type: 'array',
              fields: [
                {
                  name: 'themes',
                  type: 'relationship',
                  relationTo: 'themes',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
