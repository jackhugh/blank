import type { Dispatch } from "react";
import type { ImmerReducer } from "use-immer";
import { v4 as uuid } from "uuid";
import type { FontId } from "@/utils/constants/font";
import type {
  DraftFlowMetadata,
  EditorDraft,
  EditorTemplate,
  MapType,
  TextAlign,
} from "./types/types";

interface SetRenderedImage {
  type: "set_rendered_image";
  imageUrl: string;
}
interface ToggleOrientation {
  type: "toggle_orientation";
}
interface RotateImage {
  type: "rotate_image";
  index: number;
  rotate: number;
  template: EditorTemplate;
}
interface SetViewportImage {
  type: "set_viewport_image";
  index: number;
  imageUrl: string;
}
interface SwapViewports {
  type: "swap_viewports";
  viewportAIndex: number;
  viewportBIndex: number;
}
interface RemoveViewportImage {
  type: "remove_viewport_image";
  index: number;
}
interface SetViewportImagePosition {
  type: "set_viewport_image_position";
  index: number;
  x: number;
  y: number;
}
interface SetViewportImageSize {
  type: "set_viewport_image_size";
  index: number;
  width: number;
  height: number;
}
interface IncrementViewportImageZoom {
  type: "increment_viewport_image_zoom";
  index: number;
  zoomIncrement: number;
  template: EditorTemplate;
}
interface SetStamp {
  type: "set_stamp";
  stampUrl: string | undefined;
}
interface SetMap {
  type: "set_map";
  map: MapType | null;
}
interface SetOrderMessage {
  type: "set_order_message";
  orderMessage: string;
}
interface SetFontId {
  type: "set_font_id";
  fontId: FontId;
}
interface SetFontAlignment {
  type: "set_font_alignment";
  fontAlignment: TextAlign;
}
interface SetEditorTemplate {
  type: "set_editor_template";
  template: string;
}
interface SetMessageImage {
  type: "set_message_image";
  messageImageUrl: string;
}
interface SetCaptionText {
  type: "set_caption_text";
  captionText: string | undefined;
}
interface SwitchProductType {
  type: "switch_product_type";
  productType: "PC" | "GC";
}

interface SetFlowMetadata {
  type: "set_flow_metadata";
  metadata: DraftFlowMetadata;
}
interface AddImageSticker {
  type: "add_image_sticker";
  stickerImageUrl: string;
  // Not a massive fan of doing this but I think I prefer it to having a useEffect listen for ID changes.
  callback: (id: string) => void;
}
interface SetStickerSize {
  type: "set_sticker_size";
  width: number | null;
  height: number | null;
  id: string;
}
interface SetStickerPosition {
  type: "set_sticker_position";
  x: number;
  y: number;
  id: string;
}
interface SetStickerRotation {
  type: "set_sticker_rotation";
  id: string;
  rotation: number;
}
interface SetStickerScale {
  type: "set_sticker_scale";
  id: string;
  scale: number;
}
interface RemoveSticker {
  type: "remove_sticker";
  id: string;
}
interface BringStickerToTop {
  type: "bring_sticker_to_top";
  id: string;
}

export type EditorDraftAction =
  | SetViewportImage
  | SetViewportImagePosition
  | SetViewportImageSize
  | IncrementViewportImageZoom
  | SetRenderedImage
  | ToggleOrientation
  | RotateImage
  | SetStamp
  | SetMap
  | SetOrderMessage
  | SetFontId
  | SetFontAlignment
  | SetEditorTemplate
  | SetMessageImage
  | SetCaptionText
  | SwitchProductType
  | RemoveViewportImage
  | SwapViewports
  | SetFlowMetadata
  | AddImageSticker
  | SetStickerSize
  | SetStickerPosition
  | SetStickerRotation
  | SetStickerScale
  | RemoveSticker
  | BringStickerToTop;

export type EditorDraftDispatch = Dispatch<EditorDraftAction>;

export const editorDraftReducer: ImmerReducer<
  EditorDraft,
  EditorDraftAction
> = (draft, action) => {
  switch (action.type) {
    case "switch_product_type": {
      draft.productHandle = action.productType;
      break;
    }
    case "set_rendered_image": {
      draft.renderedImageURL = action.imageUrl;
      break;
    }
    case "toggle_orientation": {
      draft.orientation =
        draft.orientation === "portrait" ? "landscape" : "portrait";
      break;
    }
    case "set_stamp": {
      draft.stampUrl = action.stampUrl;
      break;
    }
    case "set_map": {
      draft.map = action.map;
      break;
    }
    case "set_order_message": {
      draft.orderMessage = action.orderMessage;
      // Invalidate old message render
      draft.renderedMessageURL = undefined;
      break;
    }
    case "set_font_id": {
      draft.fontId = action.fontId;
      break;
    }
    case "set_font_alignment": {
      draft.fontAlignment = action.fontAlignment;
      break;
    }
    case "set_viewport_image": {
      if (draft.imageData[action.index]?.imageURL === action.imageUrl) {
        return;
      }

      draft.imageData[action.index] = {
        height: 0,
        width: 0,
        x: 0.5,
        y: 0.5,
        zoom: 1,
        rotate: 0,
        imageURL: action.imageUrl,
      };
      break;
    }
    case "swap_viewports": {
      const imageA = draft.imageData[action.viewportAIndex];
      const imageB = draft.imageData[action.viewportBIndex];
      draft.imageData[action.viewportAIndex] = imageB;
      draft.imageData[action.viewportBIndex] = imageA;
      break;
    }
    case "set_viewport_image_position": {
      const imageData = draft.imageData[action.index];
      if (!imageData) {
        return;
      }

      imageData.x = action.x;
      imageData.y = action.y;
      break;
    }
    case "set_viewport_image_size": {
      const imageData = draft.imageData[action.index];
      if (!imageData) {
        return;
      }

      imageData.width = action.width;
      imageData.height = action.height;
      break;
    }
    case "increment_viewport_image_zoom": {
      const imageData = draft.imageData[action.index];
      const viewport = action.template.viewports[action.index];
      if (!imageData || !viewport) {
        return;
      }

      const idealZoom = imageData.zoom + action.zoomIncrement;
      const minZoom = 1;
      const maxZoom = 2.5;
      const newZoom = Math.max(Math.min(idealZoom, maxZoom), minZoom);

      imageData.zoom = newZoom;
      break;
    }
    case "rotate_image": {
      const imageData = draft.imageData[action.index];
      const viewport = action.template.viewports[action.index];
      if (!imageData || !viewport) {
        return;
      }

      const newRotation = (imageData.rotate + action.rotate) % 360;
      imageData.rotate = newRotation;

      break;
    }
    case "set_editor_template": {
      draft.templateHandle = action.template;
      break;
    }
    case "set_message_image": {
      draft.renderedMessageURL = action.messageImageUrl;
      break;
    }
    case "set_caption_text": {
      draft.captionText = action.captionText;
      break;
    }
    case "remove_viewport_image": {
      if (!draft.imageData[action.index]) {
        return;
      }

      draft.imageData[action.index] = undefined;

      break;
    }
    case "set_flow_metadata": {
      draft.flowMetadata = action.metadata;
      break;
    }
    case "add_image_sticker": {
      const id = uuid();
      draft.stickers.push({
        x: 0.5,
        y: 0.5,
        scale: 1,
        rotation: 0,
        type: "image_sticker",
        stickerUrl: action.stickerImageUrl,
        id,
        width: null,
        height: null,
      });
      action.callback(id);
      break;
    }
    case "set_sticker_size": {
      const sticker = draft.stickers.find(
        (sticker) => sticker.id === action.id
      );
      if (!sticker) {
        return;
      }
      sticker.width = action.width;
      sticker.height = action.height;
      break;
    }
    case "set_sticker_position": {
      const sticker = draft.stickers.find(
        (sticker) => sticker.id === action.id
      );
      if (!sticker) {
        return;
      }
      sticker.x = action.x;
      sticker.y = action.y;
      break;
    }
    case "set_sticker_rotation": {
      const sticker = draft.stickers.find(
        (sticker) => sticker.id === action.id
      );
      if (!sticker) {
        return;
      }
      sticker.rotation = action.rotation;
      break;
    }
    case "set_sticker_scale": {
      const sticker = draft.stickers.find(
        (sticker) => sticker.id === action.id
      );
      if (!sticker) {
        return;
      }
      sticker.scale = action.scale;
      break;
    }
    case "remove_sticker": {
      draft.stickers = draft.stickers.filter(
        (sticker) => sticker.id !== action.id
      );
      break;
    }
    case "bring_sticker_to_top": {
      const stickerIndex = draft.stickers.findIndex(
        (sticker) => sticker.id === action.id
      );
      if (stickerIndex < 0) {
        return;
      }
      const sticker = draft.stickers.splice(stickerIndex, 1)[0];
      if (!sticker) {
        return;
      }
      draft.stickers.push(sticker);
      break;
    }
    default: {
      throw new Error(`Unknown action`);
    }
  }
};
