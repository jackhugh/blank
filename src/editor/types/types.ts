import type { PremiumFeature } from "@/api/utils/subscription";
import type { CardProductHandle } from "@/pages/[locale]/[personalised_cards]/card-products";
import type { FontId } from "@/utils/constants/font";

export type Orientation = "landscape" | "portrait";

/**
 * Represents a template (which uses relative measurements) that has been
 * applied to a set of canvas dimensions (becoming absolute).
 */
export interface EditorTemplate {
  /** Template ID as defined in database */
  id: string;
  /** Template handle as defined in database */
  handle: string;
  viewports: Viewport[];
  /** Number of pixels that should be hidden from the user (but still rendered) per edge. */
  bleed: {
    x: number;
    y: number;
  };
  /** An image (usually with transparency), that is placed on top of the template */
  frame: string | null;
  /** Pixel size of the canvas */
  size: {
    width: number;
    height: number;
  };
  caption: Caption | null;
}

/**
 * Space in a Template that can have an image
 */
export interface Viewport {
  /** Top left X position in pixels relative to template */
  x: number;
  /** Top left Y position in pixels relative to template */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Sized and positioned image to be used in a `Viewport`
 */
export interface ImageData {
  imageURL: string;
  illustrationID?: string;
  /** Between 0 and 1, represents the minimum and maximum X position. Note - this
   * can be above/below 0 or 1 when a rotation is made. */
  x: number;
  /** Between 0 and 1, represents the minimum and maximum Y position. Note - this
   * can be above/below 0 or 1 when a rotation is made. */
  y: number;
  /** Width as a percentage of the viewport width */
  width: number;
  /** Height as a percentage of the viewport height */
  height: number;
  /** Multiplier to apply to width and height - default is 1 */
  zoom: number;
  /** Rotation - default is 0 */
  rotate: number;
}

export interface Caption {
  image: CaptionImage;
  text: CaptionText;
}

export interface CaptionImage {
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptionText {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontSize: number;
}

export interface MapType {
  mapUrl: string;
  place: string;
  latitude: number;
  longitude: number;
  date?: string;
  type: "map" | "place";
}

export type TextAlign = "left" | "center" | "right";

export interface DraftFlowMetadata {
  membershipIntroViewedForFeatures: PremiumFeature[];
}

export const defaultDraftFlowMetadata: DraftFlowMetadata = {
  membershipIntroViewedForFeatures: [],
};

export interface StickerBase {
  id: string;
  /** Between 0 and 1, represents the minimum and maximum Y position */
  x: number;
  /** Between 0 and 1, represents the minimum and maximum Y position */
  y: number;
  scale: number;
  rotation: number;
  /** Width of the sticker when the scale is set to 1. We store this so that
   * the toolbar position can be calculated. */
  width: number | null;
  /** Height of the sticker when the scale is set to 1. We store this so that
   * the toolbar position can be calculated. */
  height: number | null;
}
export interface ImageSticker extends StickerBase {
  type: "image_sticker";
  stickerUrl: string;
}
export interface TextSticker extends StickerBase {
  type: "text_sticker";
  text: string;
}
export type Sticker = ImageSticker | TextSticker;

/**
 * Required data needed to restore `CardEditor` state
 */
export interface EditorDraft {
  productHandle: CardProductHandle;
  /** Generated on the client - to be used for restoration */
  draftID: string;
  /** Theme ID that this draft was initialized with */
  initialThemeId: string;
  /** Current template handle being used */
  templateHandle: string;
  /**
   * Array of `ImageData`, indexed by viewport index
   *
   * Note: elements can be `undefined` since array iterators such as `find` still traverse
   * `EMPTY` elements which are used for indexing viewports.
   */
  imageData: (ImageData | undefined)[];
  /** Current draft orientation */
  orientation: Orientation;
  /** Inside message for this draft */
  orderMessage: string;
  /** Rendered image of the canvas - this can be `undefined` if the flow has not been completed */
  renderedImageURL?: string;
  /** Stamp URL if chosen by user - renderer will use default stamp if left `undefined` */
  stampUrl?: string;
  /** Map Object which holds map image url, map location and date if added otherwise empty */
  map?: MapType | null;
  /** Rendered image of the message - this can be `undefined` if the flow has not been
   * completed
   */
  renderedMessageURL?: string;

  /* Order message styles */
  fontId: FontId;
  fontAlignment: TextAlign;

  captionText?: string;

  flowMetadata: DraftFlowMetadata;

  stickers: Sticker[];
}
