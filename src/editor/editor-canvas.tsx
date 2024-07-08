import type Konva from "konva";
import type { CSSProperties } from "react";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { Layer, Rect, Stage } from "react-konva";
import { Viewports } from "@/components/editor/viewports/viewports";
import type { SelectedItem } from "@/pages/[locale]/[personalised_cards]/create/[side]/types";
import { rotateImage } from "@/utils/image";
import styles from "./editor-canvas.module.scss";
import type { EditorDraftDispatch } from "./reducer";
import type { EditorDraft, EditorTemplate } from "./types/types";

interface EditorCanvasProps {
  editorDraft: EditorDraft;
  dispatchEditorDraft: EditorDraftDispatch;
  selectedItem: SelectedItem | null;
  setSelectedItem: (i: SelectedItem | null) => void;
  template: EditorTemplate;
  /**
   * - `contain` Scales the canvas as large as possible whilst fitting
   *    within its container
   * - `expand` Expands the canvas to the full width of the parent, expanding
   *    height as needed
   */
  sizingMode: "contain" | "expand";
  /**
   * Sets whether clicking on a viewport that already has an image will
   * trigger a new upload dialog
   */
  viewportClickAlwaysOpensUpload?: boolean;
  disableInteraction?: boolean;
  style?: CSSProperties;
  onV2EditorViewportClick?: () => void;
  isV2Editor?: boolean;
  onStickerChangeStart?: () => void;
  onStickerChangeEnd?: () => void;
}

export interface EditorCanvasRef {
  toImage: () => Promise<string>;
}

export const EditorCanvas = forwardRef<EditorCanvasRef, EditorCanvasProps>(
  (
    {
      editorDraft,
      dispatchEditorDraft,
      selectedItem,
      setSelectedItem,
      template,
      sizingMode,
      viewportClickAlwaysOpensUpload = false,
      disableInteraction = false,
      style,
      onV2EditorViewportClick = () => {},
      isV2Editor = false,
      onStickerChangeStart = () => {},
      onStickerChangeEnd = () => {},
    },
    ref
  ) => {
    const stageRef = useRef<Konva.Stage>(null);
    const stageBorderRef = useRef<HTMLDivElement>(null);
    const stageContainerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState<number | null>(null);

    const { width, height } = template.size;

    useLayoutEffect(() => {
      const checkSize = () => {
        if (!stageContainerRef.current) {
          return;
        }
        const innerWidth = template.size.width - template.bleed.x * 2;
        const innerHeight = template.size.height - template.bleed.y * 2;

        // Temporarily hide child so the containing div resets to initial
        // height
        if (stageBorderRef.current) {
          stageBorderRef.current.style.display = "none";
        }

        const containerWidth = stageContainerRef.current.offsetWidth;
        const containerHeight = stageContainerRef.current.offsetHeight;
        const widthScale = containerWidth / innerWidth;
        const heightScale = containerHeight / innerHeight;

        if (sizingMode === "expand") {
          setScale(widthScale);
        } else if (sizingMode === "contain") {
          setScale(Math.min(widthScale, heightScale));
        }

        // Show child again
        if (stageBorderRef.current) {
          stageBorderRef.current.style.display = "";
        }
      };

      checkSize();
      window.addEventListener("resize", checkSize);
      return () => window.removeEventListener("resize", checkSize);
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      toImage: async () => {
        if (!stageRef.current || !scale) {
          throw new Error("Not ready to render canvas");
        }

        // Forces React to flush updates so that the border is gone before the export
        flushSync(() => {
          setSelectedItem(null);
        });

        const renderedCanvas = stageRef.current.toDataURL({
          pixelRatio: 1 / scale,
          mimeType: "image/jpeg",
          // Explicitly set quality to 1 - browsers can choose otherwise
          quality: 1,
        });

        // Restore selected viewport
        setSelectedItem(selectedItem);

        if (editorDraft.orientation === "landscape") {
          return renderedCanvas;
        }

        // The backend expects any portrait postcard images to be rotated by 270deg.
        // The following creates a new rotated canvas instance and loads the image
        // on to it.
        return rotateImage(renderedCanvas, 270);
      },
    }));

    let borderStyle;
    if (scale) {
      borderStyle = {
        width: `${(width - template.bleed.x * 2) * scale}px`,
        height: `${(height - template.bleed.y * 2) * scale}px`,
      };
    }

    return (
      <div className={styles.innerContainer} ref={stageContainerRef}>
        {scale ? (
          <div
            ref={stageBorderRef}
            style={{ ...style, ...borderStyle }}
            className={styles.border}
          >
            <Stage
              className={styles.canvas}
              ref={stageRef}
              width={width * scale}
              height={height * scale}
              scale={{ x: scale, y: scale }}
              listening={!disableInteraction}
            >
              <Layer>
                <Rect fill="white" height={height} width={width} />
                <Viewports
                  editorDraft={editorDraft}
                  dispatchEditorDraft={dispatchEditorDraft}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  template={template}
                  viewportClickAlwaysOpensUpload={
                    viewportClickAlwaysOpensUpload
                  }
                  onV2EditorViewportClick={onV2EditorViewportClick}
                  isV2Editor={isV2Editor}
                  onStickerChangeStart={onStickerChangeStart}
                  onStickerChangeEnd={onStickerChangeEnd}
                />
              </Layer>
            </Stage>
          </div>
        ) : null}
      </div>
    );
  }
);

EditorCanvas.displayName = "EditorCanvas";
