import React from "react";
import { Image, Rect } from "react-konva";
import useImage from "use-image";

interface FrameProps {
  frameURL: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export const Frame = ({ frameURL, width, height, x, y }: FrameProps) => {
  const [frame] = useImage(frameURL, "anonymous");
  return (
    <Image
      alt="Image Frame"
      image={frame}
      width={width}
      height={height}
      x={x}
      y={y}
      fillEnabled={false}
    />
  );
};

interface DropImageProps {
  centerX: number;
  centerY: number;
  viewportHeight: number;
  viewportWidth: number;
}

export const DropImage = ({
  centerX,
  centerY,
  viewportHeight,
  viewportWidth,
}: DropImageProps) => {
  const imageIconDimension = 300;

  const [addImageIcon] = useImage("/assets/icons/add-image-white.png");

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={viewportWidth}
        height={viewportHeight}
        fill="#000000"
        opacity={0.2}
      />
      <Image
        x={centerX - imageIconDimension / 2}
        y={centerY - imageIconDimension / 2}
        width={imageIconDimension}
        height={imageIconDimension}
        image={addImageIcon}
      />
    </>
  );
};
