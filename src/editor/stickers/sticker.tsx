import type Konva from "konva";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Group, Rect, Transformer } from "react-konva";
import type { EditorTemplate } from "../types/types";

interface StickerProps {
  children?: ReactNode;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  isSelected: boolean;
  template: EditorTemplate;
  setIsSelected: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setRotation: (rotation: number) => void;
  setScale: (scale: number) => void;
  setSize: (size: { width: number; height: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const Sticker = ({
  children,
  width,
  height,
  x,
  y,
  rotation,
  scale,
  isSelected,
  template,
  setIsSelected,
  setPosition,
  setRotation,
  setScale,
  setSize,
  onDragStart: parentOnDragStart,
  onDragEnd: parentOnDragEnd,
}: StickerProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const groupRef = useRef<Konva.Group | null>(null);

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  useEffect(() => {
    // Attach the transformer to the draggable element
    const transformer = transformerRef.current;
    const child = groupRef.current;
    if (!transformer || !child) {
      return;
    }

    transformer.nodes([child]);
    transformer.getLayer()?.batchDraw();
  }, [isSelected]);

  const onDragStart = () => {
    setIsSelected();
    parentOnDragStart();
  };

  // Limit dragging within bounds of canvas
  const onDragMove = () => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const x = Math.min(Math.max(0, group.x()), template.size.width);
    const y = Math.min(Math.max(0, group.y()), template.size.height);
    group.x(x);
    group.y(y);
  };

  // Set position in state after dragging
  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const x = e.currentTarget.x() / template.size.width;
    const y = e.currentTarget.y() / template.size.height;
    setPosition({ x, y });
    parentOnDragEnd();
  };

  // Limit scaling within min/max
  const onTransform = () => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    if (group.scaleX() < 0.5) {
      group.scaleX(0.5);
      group.scaleY(0.5);
    } else if (group.scaleX() > 3) {
      group.scaleX(3);
      group.scaleY(3);
    }
  };

  // Set transform in state after transforming
  const onTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    parentOnDragEnd();

    const group = groupRef.current;
    if (!group) {
      return;
    }

    setRotation(e.currentTarget.rotation());

    // Could be either x or y
    const scale = group.scaleX();
    setScale(scale);

    const x = group.x() / template.size.width;
    const y = group.y() / template.size.height;
    setPosition({ x, y });
  };

  return (
    <>
      <Group
        ref={groupRef}
        draggable
        x={x}
        y={y}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        rotation={rotation}
        scaleX={scale}
        scaleY={scale}
        onDragEnd={onDragEnd}
        onClick={setIsSelected}
        onTap={setIsSelected}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
      >
        {isSelected && (
          <Rect
            width={width}
            x={0}
            y={0}
            height={height}
            fill="black"
            opacity={0.1}
          />
        )}
        {children}
      </Group>

      {isSelected && (
        <Transformer
          ref={transformerRef}
          anchorCornerRadius={3}
          anchorFill="white"
          anchorSize={13}
          anchorStrokeWidth={1}
          anchorStroke="rgb(200, 200, 200)"
          borderStroke="white"
          borderDash={[10, 10]}
          borderStrokeWidth={3}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-right",
            "bottom-left",
          ]}
          centeredScaling
          flipEnabled={false}
          onTransformStart={parentOnDragStart}
          onTransformEnd={onTransformEnd}
          onTransform={onTransform}
          anchorStyleFunc={(anchor) => {
            if (anchor.hasName("rotater")) {
              (
                anchor as typeof anchor & {
                  cornerRadius: (radius: number) => void;
                }
              ).cornerRadius(100);
            }
          }}
        />
      )}
    </>
  );
};
