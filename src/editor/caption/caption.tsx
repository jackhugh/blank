import { Image, Text } from "react-konva";
import useImage from "use-image";
import type { Caption as CaptionType } from "../types/types";

interface CaptionProps {
  caption: CaptionType;
  captionText: string;
}

export const Caption = ({ caption, captionText }: CaptionProps) => {
  const [captionImage] = useImage(caption.image.imageUrl, "anonymous");

  return (
    <>
      <Image
        image={captionImage}
        width={caption.image.width}
        height={caption.image.height}
        x={caption.image.x}
        y={caption.image.y}
      />
      <Text
        x={caption.text.x}
        y={caption.text.y}
        width={caption.text.width}
        height={caption.text.height}
        text={captionText}
        fontSize={caption.text.fontSize}
        align="center"
        verticalAlign="middle"
        fontFamily="Montserrat"
        fill={caption.text.color}
      />
    </>
  );
};
