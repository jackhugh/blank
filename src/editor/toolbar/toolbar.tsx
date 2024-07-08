import React from "react";
import { useUpload } from "@/components/editor/upload/useUpload";
import { filterClasses } from "@/utils";
import styles from "./toolbar.module.scss";

interface ToolbarProps {
  setViewportImage: (imageURL: string) => void;
  setZoomOut: () => void;
  setZoomIn: () => void;
  changeOrientation: () => void;
  className?: string;
}

export const Toolbar = ({
  setViewportImage,
  setZoomOut,
  setZoomIn,
  changeOrientation,
  className,
}: ToolbarProps) => {
  const openUploadDialog = useUpload({ singleFileCallback: setViewportImage });

  return (
    <div className={filterClasses(styles.toolbar, className)}>
      <ToolBarItem
        text="Photo"
        onClick={openUploadDialog}
        src="/assets/canvas/toolbar/Photo.png"
        alt="illustrations"
      />
      <ToolBarItem
        text="Rotate"
        onClick={changeOrientation}
        src="/assets/canvas/toolbar/Rotate Card.png"
        alt="illustrations"
      />
      <ToolBarItem
        text="Zoom In"
        onClick={setZoomIn}
        src="/assets/canvas/toolbar/Zoom in.png"
        alt="illustrations"
      />
      <ToolBarItem
        text="Zoom Out"
        onClick={setZoomOut}
        src="/assets/canvas/toolbar/Zoom out.png"
        alt="illustrations"
      />
    </div>
  );
};

interface ToolBarItemProps {
  text: string;
  onClick?: () => void;
  src: string;
  alt: string;
}

export const ToolBarItem = ({ onClick, src, alt, text }: ToolBarItemProps) => (
  <button onClick={onClick} className={styles.toolbarItem}>
    <img src={src} alt={alt} width={216} height={216} />
    <p>{text}</p>
  </button>
);
