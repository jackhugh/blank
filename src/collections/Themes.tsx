import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';
import { Illustrations } from './Illustration';
import React from 'react';
import { ThemePreview } from '../components/theme-preview';

const Themes: CollectionConfig = {
  slug: 'themes',
  admin: {
    description:
      'A theme is a preset that comprises of a template that can be filled with illustrations',
  },
  fields: [
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
      required: true,
    },
    {
      name: 'illustrations',
      type: 'array',
      admin: {
        components: {
          // Field: ThemePreview,
        },
      },
      fields: [
        {
          name: 'illustration',
          type: 'upload',
          relationTo: 'illustrations',
          required: true,
        },
      ],
    },
  ],
};

export default Themes;
