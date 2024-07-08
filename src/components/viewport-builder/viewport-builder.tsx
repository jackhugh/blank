import { useRef, useState, useEffect } from 'react';
import React from 'react';
import { useField, useForm, useFormFields } from 'payload/components/forms';

interface ViewportBuilderProps {
  path: string;
  width: number;
  height: number;
  overrideViewports?: Viewport[];
}
export const ViewportBuilder = ({
  width,
  height,
  path,
  overrideViewports,
}: ViewportBuilderProps) => {
  const [konva, setKonva] = useState<typeof import('react-konva') | null>(null);
  const { rows = [] } = useField({ path });
  const [fields, dispatchFields] = useFormFields((fields) => fields);

  useEffect(() => {
    import('react-konva').then((m) => setKonva(m));
  }, []);

  if (!konva) {
    return null;
  }

  const viewports = Array.from({ length: rows.length }).map((_, i) => ({
    x: fields[`${path}.${i}.x`]?.value,
    y: fields[`${path}.${i}.y`]?.value,
    width: fields[`${path}.${i}.width`]?.value,
    height: fields[`${path}.${i}.height`]?.value,
  }));

  console.log(viewports);

  return (
    <ViewportBuilderWithKonva
      addButton={!overrideViewports}
      Konva={konva}
      width={width}
      height={height}
      path={path}
      viewports={overrideViewports ?? viewports}
    />
  );
};

interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ViewportBuilderWithKonva {
  path: string;
  Konva: typeof import('react-konva');
  width: number;
  height: number;
  viewports: Viewport[];
  addButton: boolean;
}
const ViewportBuilderWithKonva = ({
  path,
  Konva: Konva,
  width,
  height,
  viewports,
  addButton,
}: ViewportBuilderWithKonva) => {
  const { addFieldRow } = useForm();

  const scale = 0.2;
  const [fields, dispatchFields] = useFormFields((fields) => fields);

  return (
    <div>
      {addButton && (
        <button
          type='button'
          onClick={() =>
            addFieldRow({ path, data: { x: 0, y: 0, width: 1, height: 1 } })
          }
        >
          add
        </button>
      )}

      <Konva.Stage
        scaleX={scale}
        scaleY={scale}
        width={width * scale + 10}
        height={height * scale + 10}
      >
        <Konva.Layer>
          <Konva.Rect stroke={'black'} width={width} height={height} />

          {viewports.map((vp, i) => {
            return (
              <Konva.Rect
                key={i}
                stroke={'teal'}
                strokeWidth={10}
                draggable={addButton}
                x={vp.x * width}
                y={vp.y * height}
                width={500}
                height={500}
                onDragEnd={
                  addButton
                    ? (e) => {
                        console.log(123);
                        dispatchFields({
                          type: 'UPDATE',
                          path: `${path}.${i}.x`,
                          value: e.currentTarget.x() / width,
                        });
                        dispatchFields({
                          type: 'UPDATE',
                          path: `${path}.${i}.y`,
                          value: e.currentTarget.y() / height,
                        });
                      }
                    : undefined
                }
              />
            );
          })}
        </Konva.Layer>
      </Konva.Stage>
    </div>
  );
};
