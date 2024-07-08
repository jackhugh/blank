import { Image } from "react-konva";
import useImage from "use-image";
import type {
  EditorTemplate,
  ImageSticker as ImageStickerType,
} from "../types/types";
import { Sticker } from "./sticker";

interface ImageStickerProps {
  sticker: ImageStickerType;
  template: EditorTemplate;
  isSelected: boolean;
  setIsSelected: () => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setRotation: (rotation: number) => void;
  setScale: (scale: number) => void;
  setSize: (size: { width: number; height: number }) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const ImageSticker = ({
  sticker,
  template,
  isSelected,
  setIsSelected,
  setPosition,
  setRotation,
  setScale,
  setSize,
  onDragStart,
  onDragEnd,
}: ImageStickerProps) => {
  const [image] = useImage(sticker.stickerUrl, "anonymous");

  const imageWidth = image?.width;
  const imageHeight = image?.height;

  if (!imageWidth || !imageHeight) {
    return null;
  }

  // Default width is 1/3 the width of the shortest side of the template
  const width = Math.min(template.size.width, template.size.height) / 3;
  const height = width * (imageHeight / imageWidth);

  return (
    <Sticker
      width={width}
      height={height}
      x={sticker.x * template.size.width}
      y={sticker.y * template.size.height}
      rotation={sticker.rotation}
      scale={sticker.scale}
      isSelected={isSelected}
      setIsSelected={setIsSelected}
      setPosition={setPosition}
      setRotation={setRotation}
      setScale={setScale}
      template={template}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      setSize={setSize}
    >
      <Image image={image} width={width} height={height} />
    </Sticker>
  );
};
