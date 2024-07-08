import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect } from "react";
import { Group, Image, Rect } from "react-konva";
import useImage from "use-image";
import { DropImage } from "@/components/editor/images/images";
import type {
  ImageData,
  Viewport as ViewportType,
} from "@/components/editor/types/types";
import { UploadPlus } from "@/components/editor/upload/upload-plus";
import { useUpload } from "@/components/editor/upload/useUpload";
import { relativePositionToPx } from "../utils";

interface ViewportProps {
  isSelected: boolean;
  setSelected: () => void;
  viewport: ViewportType;
  setViewportImage: (imageURL: string) => void;
  removeViewportImage: () => void;
  setCoords: (x: number, y: number) => void;
  setSize: (width: number, height: number) => void;
  imageData?: ImageData;
  viewportClickAlwaysOpensUpload: boolean;
  onV2EditorViewportClick: () => void;
  isV2Editor: boolean;
  uploadPlusScale: number;
  couldBeDropped: boolean;
}

export const Viewport = ({
  isSelected,
  setSelected,
  viewport,
  setViewportImage,
  removeViewportImage,
  setCoords,
  setSize,
  imageData,
  viewportClickAlwaysOpensUpload,
  onV2EditorViewportClick,
  isV2Editor,
  uploadPlusScale,
  couldBeDropped,
}: ViewportProps) => {
  const {
    x: viewportX,
    y: viewportY,
    height: viewportHeight,
    width: viewportWidth,
  } = viewport;
  const [img, imgStatus] = useImage(imageData?.imageURL ?? "", "anonymous");

  // Since we are storing blob URLs for user "uploads", it is possible for a user
  // to get to checkout and pay with a third party (eg. PayPal) which causes the
  // blob to get deleted (since they are redirected away from this site). The
  // following logic, checks to make sure the first blob URL is still valid.
  //
  // Once we are persisting drafts in localstorage, this logic can be removed.
  useEffect(() => {
    if (imgStatus === "failed") {
      removeViewportImage();
    }
  }, [imgStatus]);

  const openUploadDialog = useUpload({
    singleFileCallback: (imageURL: string) => setViewportImage(imageURL),
  });

  const handleClick = () => {
    setSelected();

    if (isV2Editor) {
      onV2EditorViewportClick();
    } else if (viewportClickAlwaysOpensUpload || !imageData?.imageURL) {
      openUploadDialog();
    }
  };

  const initImageSize = () => {
    if (!imageData || !img) {
      return;
    }

    const isRotatedByMultipleOf90 = [0, 180].includes(imageData.rotate);

    const imgWidth = isRotatedByMultipleOf90 ? img.width : img.height;
    const imgHeight = isRotatedByMultipleOf90 ? img.height : img.width;

    const imgRatio = imgWidth / imgHeight;
    const containerRatio = viewport.width / viewport.height;

    let newWidthRatio;
    let newHeightRatio;

    // Image is wider than viewport
    if (imgRatio > containerRatio) {
      newWidthRatio =
        (img.width / img.height) * (viewport.height / viewport.width);
      newHeightRatio = 1;
      // Image is taller than viewport
    } else {
      newWidthRatio = 1;
      newHeightRatio =
        (img.height / img.width) * (viewport.width / viewport.height);
    }

    if (!isRotatedByMultipleOf90) {
      newWidthRatio *= img.width / img.height;
      newHeightRatio *= img.width / img.height;
    }

    setSize(newWidthRatio, newHeightRatio);
  };

  useEffect(initImageSize, [
    img,
    viewport.width,
    viewport.height,
    imageData?.rotate,
  ]);

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!imageData || !img) {
      return;
    }

    const pointerPosition =
      e.currentTarget.parent?.getRelativePointerPosition();
    if (!pointerPosition) {
      return;
    }

    const imgX = e.target.x();
    const imgY = e.target.y();

    const trueImageWidth = imageData.width * imageData.zoom * viewportWidth;
    const trueImageHeight = imageData.height * imageData.zoom * viewportHeight;
    const imageWidth = [0, 180].includes(imageData.rotate)
      ? trueImageWidth
      : trueImageHeight;
    const imageHeight = [0, 180].includes(imageData.rotate)
      ? trueImageHeight
      : trueImageWidth;

    const leftBound = viewportWidth - imageWidth / 2;
    const rightBound = imageWidth / 2;
    const topBound = viewportHeight - imageHeight / 2;
    const bottomBound = imageHeight / 2;

    if (imgX < leftBound) {
      e.target.x(leftBound);
    } else if (imgX > rightBound) {
      e.target.x(rightBound);
    }

    if (imgY < topBound) {
      e.target.y(topBound);
    } else if (imgY > bottomBound) {
      e.target.y(bottomBound);
    }
  };
  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!imageData) {
      return;
    }

    const imgX = e.target.x();
    const imgY = e.target.y();

    const imageWidth = viewportWidth * imageData.width * imageData.zoom;
    const imageHeight = viewportHeight * imageData.height * imageData.zoom;

    const fractionalX = (imgX - imageWidth / 2) / (viewportWidth - imageWidth);
    const fractionalY =
      (imgY - imageHeight / 2) / (viewportHeight - imageHeight);

    setCoords(
      Number.isFinite(fractionalX) ? fractionalX : 0.5,
      Number.isFinite(fractionalY) ? fractionalY : 0.5
    );
  };

  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;

  const curriedSetCursor =
    (cursor: string) => (e: KonvaEventObject<unknown>) => {
      const stage = e.target.getStage();
      if (!stage) {
        return;
      }
      stage.container().style.cursor = cursor;
    };

  return (
    <Group
      onClick={handleClick}
      onTap={handleClick}
      x={viewportX}
      y={viewportY}
      width={viewportWidth}
      height={viewportHeight}
      clipWidth={viewportWidth}
      clipHeight={viewportHeight}
      clipX={0}
      clipY={0}
      onMouseMove={curriedSetCursor("pointer")}
      onMouseOut={curriedSetCursor("default")}
      onDragStart={curriedSetCursor("grabbing")}
      onDragEnd={curriedSetCursor("default")}
    >
      <Rect
        x={0}
        y={0}
        width={viewportWidth}
        height={viewportHeight}
        fill={
          !imageData?.imageURL
            ? isSelected
              ? "#dbeef1"
              : "#EDF7F8"
            : undefined
        }
      />
      {imageData?.imageURL && (
        <Image
          draggable
          alt="Uploaded Image"
          image={img}
          width={viewportWidth * imageData.width}
          height={viewportHeight * imageData.height}
          x={relativePositionToPx(
            imageData.x,
            imageData.width * imageData.zoom,
            viewportWidth
          )}
          y={relativePositionToPx(
            imageData.y,
            imageData.height * imageData.zoom,
            viewportHeight
          )}
          offsetX={(viewportWidth * imageData.width) / 2}
          offsetY={(viewportHeight * imageData.height) / 2}
          rotation={imageData.rotate}
          scale={{ x: imageData.zoom, y: imageData.zoom }}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
        />
      )}
      {imageData?.imageURL === undefined && (
        <UploadPlus
          x={centerX} // Center position in pixels
          y={centerY} // Center position in pixels
          backgroundSize={uploadPlusScale * 300}
          crossThickness={17 * uploadPlusScale}
          crossLength={170 * uploadPlusScale}
        />
      )}
      {couldBeDropped && (
        <DropImage
          centerX={centerX}
          centerY={centerY}
          viewportHeight={viewportHeight}
          viewportWidth={viewportWidth}
        />
      )}
    </Group>
  );
};
