import { CollectionConfig, GlobalConfig } from 'payload/types';

const EditorTags: GlobalConfig = {
  slug: 'editor-tags',

  fields: [
    {
      type: 'array',
      name: 'illustrationTags',
      fields: [
        {
          type: 'relationship',
          name: 'tag',
          relationTo: 'tags',
          required: true,
          localized: true,
        },
      ],
    },
    {
      type: 'array',
      name: 'templateTags',
      fields: [
        {
          type: 'relationship',
          name: 'tag',
          relationTo: 'tags',
          required: true,
        },
      ],
    },
    {
      type: 'array',
      name: 'stickerTags',
      fields: [
        {
          type: 'relationship',
          name: 'tag',
          relationTo: 'tags',
          required: true,
        },
      ],
    },
  ],
};

export default EditorTags;
