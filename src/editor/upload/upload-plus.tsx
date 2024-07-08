import React from "react";
import { Circle, Rect } from "react-konva";

interface UploadPlusProps {
  x: number;
  y: number;
  backgroundSize?: number;
  crossThickness?: number;
  crossLength?: number;
}

export function UploadPlus({
  x,
  y,
  backgroundSize = 220,
  crossThickness = 8,
  crossLength = 80,
}: UploadPlusProps) {
  const halfCrossThickness = crossThickness / 2;
  const halfCrossLength = crossLength / 2;

  return (
    <>
      <Circle
        x={x}
        y={y}
        width={backgroundSize}
        height={backgroundSize}
        fill="#32A1AE"
      />
      <Rect
        x={x - halfCrossThickness}
        y={y - halfCrossLength}
        width={crossThickness}
        height={crossLength}
        cornerRadius={crossThickness / 2}
        fill="#ffffff"
      />
      <Rect
        x={x - halfCrossLength}
        y={y - halfCrossThickness}
        width={crossLength}
        height={crossThickness}
        cornerRadius={crossThickness / 2}
        fill="#ffffff"
      />
    </>
  );
}
