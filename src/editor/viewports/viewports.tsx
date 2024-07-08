import type { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";
import { Group, Rect } from "react-konva";
import { Frame } from "@/components/editor/images/images";
import type {
  EditorDraft,
  EditorTemplate,
  Viewport as ViewportType,
} from "@/components/editor/types/types";
import { Viewport } from "@/components/editor/viewports/viewport";
import type { SelectedItem } from "@/pages/[locale]/[personalised_cards]/create/[side]/types";
import { Caption } from "../caption/caption";
import type { EditorDraftDispatch } from "../reducer";
import { ImageSticker } from "../stickers/image-sticker";

interface ViewportsProps {
  editorDraft: EditorDraft;
  dispatchEditorDraft: EditorDraftDispatch;
  selectedItem: SelectedItem | null;
  setSelectedItem: (i: SelectedItem) => void;
  template: EditorTemplate;
  viewportClickAlwaysOpensUpload: boolean;
  onV2EditorViewportClick: () => void;
  isV2Editor: boolean;
  onStickerChangeStart: () => void;
  onStickerChangeEnd: () => void;
}

export const Viewports = ({
  editorDraft,
  dispatchEditorDraft,
  selectedItem,
  setSelectedItem,
  template,
  viewportClickAlwaysOpensUpload,
  onV2EditorViewportClick,
  isV2Editor,
  onStickerChangeStart,
  onStickerChangeEnd,
}: ViewportsProps) => {
  const { width, height } = template.size;

  const { viewports } = template;

  const selectedViewport =
    selectedItem?.type === "viewport"
      ? viewports[selectedItem.viewportIndex]
      : null;

  const selectedBorderBounds = selectedViewport
    ? calcVisibleViewportBorder(selectedViewport, template)
    : null;
  const selectedBorderWidth = 10;

  const setViewportImage = (viewportIndex: number, imageURL: string) => {
    dispatchEditorDraft({
      type: "set_viewport_image",
      index: viewportIndex,
      imageUrl: imageURL,
    });
  };

  const [viewportBeingDragged, setViewportBeingDragged] = useState<
    number | null
  >(null);
  const [viewportBeingDropped, setViewportBeingDropped] = useState<
    number | null
  >(null);

  const getViewportFromCoordinates = (
    coordinates: {
      x: number;
      y: number;
    } | null
  ): number | null => {
    if (!coordinates) {
      return null;
    }
    const { x, y } = coordinates;
    const viewport = template.viewports.findIndex(
      (viewport) =>
        x >= viewport.x &&
        y >= viewport.y &&
        x <= viewport.x + viewport.width &&
        y <= viewport.y + viewport.height
    );
    return viewport >= 0 ? viewport : null;
  };

  const onDragStart = (e: KonvaEventObject<DragEvent>) => {
    const viewport = getViewportFromCoordinates(
      e.currentTarget.getRelativePointerPosition()
    );
    setViewportBeingDragged(viewport);
    if (viewport === null) {
      return;
    }
    setSelectedItem({ type: "viewport", viewportIndex: viewport });
  };

  const onDragMove = (e: KonvaEventObject<DragEvent>) => {
    const hoveredViewport = getViewportFromCoordinates(
      e.currentTarget.getRelativePointerPosition()
    );

    if (
      viewportBeingDragged === null ||
      viewportBeingDragged === hoveredViewport
    ) {
      setViewportBeingDropped(null);
      return;
    }

    if (hoveredViewport === null) {
      return;
    }

    setViewportBeingDropped(hoveredViewport);
  };

  const onDragEnd = () => {
    setViewportBeingDragged(null);
    setViewportBeingDropped(null);

    if (
      viewportBeingDragged === null ||
      viewportBeingDropped === null ||
      viewportBeingDragged === viewportBeingDropped
    ) {
      return;
    }

    setSelectedItem({ type: "viewport", viewportIndex: viewportBeingDropped });

    dispatchEditorDraft({
      type: "swap_viewports",
      viewportAIndex: viewportBeingDragged,
      viewportBIndex: viewportBeingDropped,
    });
  };

  // For the + icon (and any other viewport decorative element we add in future), we need to make sure that the size is
  // - the same size in all viewports
  // - relative to viewport number (smaller with more viewports)
  // - the same size between GC and PC, even though the template size is different. The canvas on screen is visual the
  //      same size between PC and GC, but it's different px sizes with scale applied.
  // Tweak the number constant to adjust the decoration's size.
  const viewportDecorationScale =
    (Math.min(template.size.width, template.size.height) / 15600) *
    Math.max(10 - template.viewports.length, template.viewports.length);

  return (
    <>
      <Group
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
      >
        {viewports.map((viewport, i) => (
          <Viewport
            couldBeDropped={viewportBeingDropped === i}
            key={i}
            isSelected={
              selectedItem?.type === "viewport"
                ? selectedItem.viewportIndex === i
                : false
            }
            setSelected={() => {
              setSelectedItem({ type: "viewport", viewportIndex: i });
            }}
            setViewportImage={(imageURL) => setViewportImage(i, imageURL)}
            removeViewportImage={() =>
              dispatchEditorDraft({ type: "remove_viewport_image", index: i })
            }
            setCoords={(x, y) =>
              dispatchEditorDraft({
                type: "set_viewport_image_position",
                index: i,
                x,
                y,
              })
            }
            setSize={(width, height) =>
              dispatchEditorDraft({
                type: "set_viewport_image_size",
                index: i,
                width,
                height,
              })
            }
            imageData={editorDraft.imageData[i]}
            viewport={viewport}
            viewportClickAlwaysOpensUpload={viewportClickAlwaysOpensUpload}
            onV2EditorViewportClick={onV2EditorViewportClick}
            isV2Editor={isV2Editor}
            uploadPlusScale={viewportDecorationScale}
          />
        ))}
      </Group>

      {template.frame && (
        <Frame
          frameURL={template.frame}
          width={width}
          height={height}
          x={0}
          y={0}
        />
      )}
      {selectedBorderBounds && viewports.length >= 2 && (
        <Rect
          x={selectedBorderBounds.x + selectedBorderWidth / 2}
          y={selectedBorderBounds.y + selectedBorderWidth / 2}
          width={selectedBorderBounds.width - selectedBorderWidth}
          height={selectedBorderBounds.height - selectedBorderWidth}
          cornerRadius={25}
          stroke="#37b1bf"
          strokeWidth={selectedBorderWidth}
          listening={false}
        />
      )}
      {typeof editorDraft.captionText === "string" && template.caption && (
        <Caption
          caption={template.caption}
          captionText={editorDraft.captionText}
        />
      )}
      {editorDraft.stickers.map((sticker) =>
        sticker.type === "image_sticker" ? (
          <ImageSticker
            isSelected={
              selectedItem?.type === "sticker"
                ? selectedItem.stickerId === sticker.id
                : false
            }
            setIsSelected={() => {
              setSelectedItem({ type: "sticker", stickerId: sticker.id });
              dispatchEditorDraft({
                type: "bring_sticker_to_top",
                id: sticker.id,
              });
            }}
            key={sticker.id}
            sticker={sticker}
            template={template}
            setSize={({ width, height }) =>
              dispatchEditorDraft({
                type: "set_sticker_size",
                id: sticker.id,
                width,
                height,
              })
            }
            setPosition={({ x, y }) =>
              dispatchEditorDraft({
                type: "set_sticker_position",
                id: sticker.id,
                x,
                y,
              })
            }
            setRotation={(rotation) =>
              dispatchEditorDraft({
                type: "set_sticker_rotation",
                id: sticker.id,
                rotation,
              })
            }
            setScale={(scale) =>
              dispatchEditorDraft({
                type: "set_sticker_scale",
                id: sticker.id,
                scale,
              })
            }
            onDragStart={onStickerChangeStart}
            onDragEnd={onStickerChangeEnd}
          />
        ) : null
      )}
    </>
  );
};

/**
 * Calculates the border for a viewport so that it does not cover
 * the canvas bleed
 */
const calcVisibleViewportBorder = (
  selectedViewport: ViewportType,
  template: EditorTemplate
) => {
  const topLeftX = Math.max(selectedViewport.x, template.bleed.x);
  const topLeftY = Math.max(selectedViewport.y, template.bleed.y);
  const bottomRightX = Math.min(
    selectedViewport.width + selectedViewport.x,
    template.size.width - template.bleed.x
  );
  const bottomRightY = Math.min(
    selectedViewport.height + selectedViewport.y,
    template.size.height - template.bleed.y
  );

  return {
    x: topLeftX,
    y: topLeftY,
    width: bottomRightX - topLeftX,
    height: bottomRightY - topLeftY,
  };
};
