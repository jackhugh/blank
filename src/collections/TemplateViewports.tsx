import { CollectionConfig } from 'payload/types';
import { v4 as uuid } from 'uuid';
import { Viewport } from '../blocks/Viewport';
import React from 'react';
import { ViewportBuilder } from '../components/viewport-builder/viewport-builder';
import { useField, useForm } from 'payload/components/forms';

const TemplateViewports = {
  slug: 'template-viewports',
  admin: {
    useAsTitle: 'handle',
    description:
      'A set of re-usable viewports that can be used within templates',
  },
  fields: [
    {
      name: 'handle',
      type: 'text',
      required: true,
    },
    {
      name: 'landscape',
      type: 'array',
      admin: {
        components: {
          Field: ({ path }) => (
            <ViewportBuilder height={1382} width={1819} path={path} />
          ),
          Cell: ({ cellData }) => {
            return (
              <ViewportBuilder
                width={1819}
                height={1382}
                path='landscape'
                overrideViewports={cellData}
              />
            );
          },
        },
      },
      minRows: 1,
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
        },
        {
          name: 'width',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
        },
      ],
    },
    {
      name: 'portrait',
      type: 'array',
      admin: {
        components: {
          Field: ({ path }) => (
            <ViewportBuilder height={1819} width={1382} path={path} />
          ),
        },
      },
      minRows: 1,
      fields: [
        {
          name: 'x',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
          defaultValue: 0,
        },
        {
          name: 'y',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
          defaultValue: 0,
        },
        {
          name: 'width',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
        {
          name: 'height',
          type: 'number',
          required: true,
          min: 0,
          max: 1,
          defaultValue: 1,
        },
      ],
    },
  ],
} as const satisfies CollectionConfig;

export default TemplateViewports;
