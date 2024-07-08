import { viewportIndexPositioning } from "@/utils/constants/viewports";
import type { Orientation } from "../types/types";

export const getViewportPositioning = (
  noOfViewports: number,
  cardOrientation: Orientation
) => {
  switch (noOfViewports) {
    case 2:
      return viewportIndexPositioning["2-viewports"][cardOrientation];
    case 3:
      return viewportIndexPositioning["3-viewports"][cardOrientation];
    case 4:
      return viewportIndexPositioning["4-viewports"][cardOrientation];
    case 6:
      return viewportIndexPositioning["6-viewports"][cardOrientation];
    default:
      return [];
  }
};
