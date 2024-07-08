import { useRef, useState } from "react";
import { useTemplate } from "@/api/content/template";
import { CallToActionButton } from "@/components/buttons";
import { Container } from "@/components/container";
import type { EditorCanvasRef } from "@/components/editor/editor-canvas";
import { EditorCanvas } from "@/components/editor/editor-canvas";
import type { EditorDraft } from "@/components/editor/types/types";
import type { CardProduct } from "@/pages/[locale]/[personalised_cards]/card-products";
import type { SelectedItem } from "@/pages/[locale]/[personalised_cards]/create/[side]/types";
import styles from "./card-editor.module.scss";
import type { EditorDraftDispatch } from "./reducer";
import { Toolbar } from "./toolbar/toolbar";
import { uploadToS3 } from "./useAWSUpload";
import { applyTemplateToCanvas } from "./utils";

interface CardEditorProps {
  editorDraft: EditorDraft;
  dispatchEditorDraft: EditorDraftDispatch;
  onComplete: () => void;
  cardProduct: CardProduct;
}

export const CardEditor = ({
  editorDraft,
  dispatchEditorDraft,
  onComplete,
  cardProduct,
}: CardEditorProps) => {
  const editorCanvasRef = useRef<EditorCanvasRef>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: template } = useTemplate({
    handle: editorDraft.templateHandle,
  });
  const editorTemplate = template
    ? applyTemplateToCanvas(
        template,
        {
          longSide: cardProduct.frontImageDimensions.longSide,
          shortSide: cardProduct.frontImageDimensions.shortSide,
        },
        editorDraft.orientation
      )
    : null;

  if (!editorTemplate) {
    return null;
  }

  const nextEnabled =
    editorTemplate.viewports.length === editorDraft.imageData.length;

  const onNextClicked = async () => {
    setIsLoading(true);

    const renderedCard = await editorCanvasRef.current?.toImage();
    if (!renderedCard) {
      throw new Error("Error exporting card canvas");
    }

    // Run onComplete now and let upload continue in background
    onComplete();

    const renderedCardUpload = await uploadToS3(renderedCard);
    dispatchEditorDraft({
      type: "set_rendered_image",
      imageUrl: renderedCardUpload,
    });
  };

  return (
    <Container
      className={styles.outerContainer}
      contentClassName={styles.innerContainer}
    >
      <div className={styles.container}>
        <div className={styles.canvasContainer}>
          <EditorCanvas
            ref={editorCanvasRef}
            editorDraft={editorDraft}
            dispatchEditorDraft={dispatchEditorDraft}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            template={editorTemplate}
            sizingMode="contain"
          />
        </div>
        <Toolbar
          className={styles.toolbar}
          changeOrientation={() =>
            dispatchEditorDraft({ type: "toggle_orientation" })
          }
          setViewportImage={(imageUrl) =>
            selectedItem?.type === "viewport" &&
            dispatchEditorDraft({
              type: "set_viewport_image",
              imageUrl,
              index: selectedItem.viewportIndex,
            })
          }
          setZoomIn={() =>
            selectedItem?.type === "viewport" &&
            dispatchEditorDraft({
              type: "increment_viewport_image_zoom",
              zoomIncrement: 0.1,
              index: selectedItem.viewportIndex,
              template: editorTemplate,
            })
          }
          setZoomOut={() =>
            selectedItem?.type === "viewport" &&
            dispatchEditorDraft({
              type: "increment_viewport_image_zoom",
              zoomIncrement: -0.1,
              index: selectedItem.viewportIndex,
              template: editorTemplate,
            })
          }
        />
        <CallToActionButton
          disabled={!nextEnabled || isLoading}
          variant="primary"
          size="large"
          className={styles.CTA}
          onClick={onNextClicked}
          isLoading={isLoading}
        >
          Next
        </CallToActionButton>
      </div>
    </Container>
  );
};

export default CardEditor;
