import { v4 as uuid } from "uuid";
import type {
  EstimateOrderedProduct,
  EstimateOrderedProductOrientation,
} from "@/api/checkout/estimate";
import type { Illustration } from "@/api/content/illustrations";
import type { Template, Viewport } from "@/api/content/template";
import type { Theme } from "@/api/theme-content";
import type { CardProductHandle } from "@/pages/[locale]/[personalised_cards]/card-products";
import { CardDefaults } from "@/pages/[locale]/[personalised_cards]/card-products";
import { getFontStyle } from "@/utils/constants/font";
import type {
  Caption,
  EditorDraft,
  EditorTemplate,
  MapType,
  Orientation,
} from "./types/types";
import { defaultDraftFlowMetadata } from "./types/types";

export const createDraftFromThemeAndIllustrations = (
  theme: Theme,
  illustrations: Illustration[],
  productHandle: CardProductHandle,
  orientation: Orientation
): EditorDraft => {
  const draft: EditorDraft = {
    productHandle,
    draftID: uuid(),
    initialThemeId: theme.themeId,
    templateHandle: theme.templateHandle,
    imageData: [],
    fontId: "Montserrat_Medium",
    fontAlignment: "left",
    orientation,
    orderMessage: "",
    flowMetadata: defaultDraftFlowMetadata,
    stickers: [],
  };

  theme.illustrations.forEach((illustration, i) => {
    if (!illustration) {
      return;
    }
    const illustrationData = illustrations[i];
    if (!illustrationData) {
      throw new Error(`No illustration for id ${illustration.id}`);
    }
    draft.imageData[illustration.viewportIndex] = {
      imageURL: illustrationData.productAssetUrl,
      x: 0.5,
      y: 0.5,
      height: 0,
      width: 0,
      zoom: 1,
      rotate: 0,
    };
  });

  return draft;
};

export const draftToProduct = (
  draft: EditorDraft,
  isUnlimitedUser: boolean,
  removeStamp: boolean
): EstimateOrderedProduct => {
  const { renderedImageURL: renderedCanvasURL, renderedMessageURL } = draft;
  if (!renderedCanvasURL) {
    throw new Error("Finished PC creation flow without exporting canvas");
  }

  const productId = CardDefaults[draft.productHandle].id;

  const product: EstimateOrderedProduct = {
    additionalImages: {},
    themeId: draft.initialThemeId,
    illustrationIds: draft.imageData
      .map((image) => image?.illustrationID)
      .filter((id): id is string => !!id),
    // TODO: for some reason adding this causes the estimate to fail
    // templateId: draft.templateHandle,
    productOptions: [],
    orderMessage: [
      {
        text: draft.orderMessage.trim(),
        font: getFontStyle(draft.fontId).id,
      },
    ],
    orientation: capitalize(
      draft.orientation
    ) as EstimateOrderedProductOrientation,
    productId,
    productImages: [renderedCanvasURL],
    quantity: 1,
    // TODO - investigate what this is
    sender: "",
  };

  if (draft.productHandle === "GC") {
    product.productOptions?.push(
      {
        // GC-TEXT-LAYOUT-1
        productOptionVariantId: "dbf61cb4-6453-4ab7-b5b3-85d9624e6441",
      },
      {
        // GC-INSIDE-COLOUR_WHITE
        productOptionVariantId: "88afd782-7bcb-4a4c-ac63-022bff9c1171",
      }
    );

    if (isUnlimitedUser) {
      product.productOptions?.push({
        // Envelope for unlimited users
        productOptionVariantId: "14e6c510-ded9-4eab-b908-16a299e5acf6",
      });
    }
  }

  if (draft.stampUrl && !removeStamp) {
    product.additionalImages.stampUrl = draft.stampUrl;
  }

  if (draft.map) {
    product.additionalImages.mapUrl = draft.map.mapUrl;
    product.geolocation = {
      mapCaption: generateMapCaption(draft.map),
      latitude: draft.map.latitude,
      longitude: draft.map.longitude,
    };
  }

  if (draft.renderedMessageURL) {
    product.orderMessageImageUrl = renderedMessageURL;
  }

  return product;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const absoluteViewports = (
  percentageViewports: Viewport[],
  canvasWidth: number,
  canvasHeight: number
) => {
  const pixelViewports = percentageViewports.map((viewport) => {
    const [x, y, width, height] = viewport;
    return {
      x: x * canvasWidth,
      y: y * canvasHeight,
      width: width * canvasWidth,
      height: height * canvasHeight,
    };
  });
  return pixelViewports;
};

export const applyTemplateToCanvas = (
  template: Template,
  productDimensions: { longSide: number; shortSide: number },
  orientation: Orientation
): EditorTemplate => {
  const dimensions =
    orientation === "landscape"
      ? {
          width: productDimensions.longSide,
          height: productDimensions.shortSide,
        }
      : {
          width: productDimensions.shortSide,
          height: productDimensions.longSide,
        };

  const landScapeFrame = template.payload?.frameRenderLandscape
    ? `https://cdn.touchnotes.com${template.payload.frameRenderLandscape}`
    : null;
  const portraitFrame = template.payload?.frameRenderPortrait
    ? `https://cdn.touchnotes.com${template.payload.frameRenderPortrait}`
    : null;
  const frame = orientation === "landscape" ? landScapeFrame : portraitFrame;

  const bleed =
    orientation === "landscape"
      ? {
          x: template.payload.bleedLargerSide * productDimensions.longSide,
          y: template.payload.bleedSmallerSide * productDimensions.shortSide,
        }
      : {
          x: template.payload.bleedSmallerSide * productDimensions.shortSide,
          y: template.payload.bleedLargerSide * productDimensions.longSide,
        };

  const templateCaption = template.payload.captions[0];
  let caption: Caption | null = null;
  if (templateCaption) {
    const [imageX, imageY, imageWidth, imageHeight] =
      templateCaption.frame.outsideFrame[orientation];
    const [textX, textY, textWidth, textHeight] =
      templateCaption.frame.textFrame[orientation];

    const calculatedImageX = imageX * dimensions.width;
    const calculatedImageY = imageY * dimensions.height;
    const calculatedImageWidth = imageWidth * dimensions.width;
    const calculatedImageHeight = imageHeight * dimensions.height;

    caption = {
      image: {
        imageUrl:
          orientation === "landscape"
            ? `https://cdn.touchnotes.com${templateCaption.imageSet.images.renderLandscape}`
            : `https://cdn.touchnotes.com${templateCaption.imageSet.images.renderPortrait}`,
        x: calculatedImageX,
        y: calculatedImageY,
        width: calculatedImageWidth,
        height: calculatedImageHeight,
      },
      text: {
        x: textX * calculatedImageWidth + calculatedImageX,
        y: textY * calculatedImageHeight + calculatedImageY,
        width: imageWidth * textWidth * dimensions.width,
        height: imageHeight * textHeight * dimensions.height,
        color: templateCaption.style.color,
        // Multiply by 5 to match our canvas sizing
        fontSize: templateCaption.style.fontSize * 5,
      },
    };
  }

  return {
    id: template.templateId,
    handle: template.handle,
    viewports: absoluteViewports(
      template.payload.viewports[orientation],
      dimensions.width,
      dimensions.height
    ),
    size: dimensions,
    bleed,
    frame,
    caption,
  };
};

/**
 * Converts a relative X or Y position (between 0 and 1 - 0 being the lowest
 * possible value and 1 being the largest possible value) to an absolute pixel
 * position.
 */
export const relativePositionToPx = (
  relativePos: number,
  relativeLength: number,
  viewportLength: number
) =>
  relativePos * (viewportLength - viewportLength * relativeLength) +
  (viewportLength * relativeLength) / 2;

export const generateMapCaption = (map: MapType) =>
  `This photo was taken ${map.date ? `on ${map.date}` : ""} in ${map.place}`;

interface CardDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export const getCardDimensions = (
  draft: Pick<EditorDraft, "orientation" | "productHandle">,
  side: "front" | "back" | "message"
): CardDimensions => {
  const product = CardDefaults[draft.productHandle];

  switch (side) {
    case "front": {
      if (draft.orientation === "portrait") {
        return {
          aspectRatio:
            product.frontImageDimensions.shortSide /
            product.frontImageDimensions.longSide,
          width: product.frontImageDimensions.shortSide,
          height: product.frontImageDimensions.longSide,
        };
      }
      return {
        aspectRatio:
          product.frontImageDimensions.longSide /
          product.frontImageDimensions.shortSide,
        width: product.frontImageDimensions.longSide,
        height: product.frontImageDimensions.shortSide,
      };
    }
    case "back": {
      if (draft.orientation === "landscape" || draft.productHandle === "PC") {
        return {
          aspectRatio:
            product.frontImageDimensions.longSide /
            product.frontImageDimensions.shortSide,
          width: product.frontImageDimensions.longSide,
          height: product.frontImageDimensions.shortSide,
        };
      }
      return {
        aspectRatio:
          product.frontImageDimensions.shortSide /
          product.frontImageDimensions.longSide,
        width: product.frontImageDimensions.shortSide,
        height: product.frontImageDimensions.longSide,
      };
    }
    case "message": {
      if (draft.productHandle === "PC" || draft.orientation === "landscape") {
        return {
          aspectRatio:
            product.messageImageDimensions.longSide /
            product.messageImageDimensions.shortSide,
          width: product.messageImageDimensions.longSide,
          height: product.messageImageDimensions.shortSide,
        };
      }
      return {
        aspectRatio:
          product.messageImageDimensions.shortSide /
          product.messageImageDimensions.longSide,
        width: product.messageImageDimensions.shortSide,
        height: product.messageImageDimensions.longSide,
      };
    }
    default: {
      throw new Error("Unexpected side");
    }
  }
};
