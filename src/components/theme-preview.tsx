import { useState, useEffect } from 'react';
import { EditorCanvas } from '../editor/editor-canvas';
import React from 'react';
import { useField, useForm, useFormFields } from 'payload/components/forms';
import payload from 'payload';

type CanvasType = Awaited<
  typeof import('../editor/editor-canvas')
>['EditorCanvas'];

export const ThemePreview = () => {
  const [fields] = useFormFields((f) => f);
  console.log(fields);
  return null;
};
