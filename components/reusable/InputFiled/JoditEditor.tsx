"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const JoditEditors = dynamic(() => import("jodit-react"), { ssr: false });

interface JoditEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  showToolbar?: boolean;
  height?: number;
}

function JoditEditor({
  value = "",
  placeholder,
  onChange,
  onBlur,
  showToolbar = true,
  height = 100,
}: JoditEditorProps) {
  const config = useMemo(
    () => ({
      readonly: false,
      height,
      placeholder,
      toolbar: showToolbar,
      toolbarAdaptive: false,
      toolbarSticky: false,
      enableDragAndDropFileToEditor: true,
      showXPathInStatusbar: false,
      showBrowserColorPicker: false,
      showCharsCounter: false,
      showWordsCounter: false,
      statusbar: false,
      cleanHTML: {
        fillEmptyParagraph: true,
      },
      list: {
        indent: 20,
      },
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "png", "jpeg", "gif"],
        maximumImageFileSize: 1000000,
      },
      buttons: showToolbar
        ? [
            "source",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "|",
            "ul",
            "ol",
            "|",
            "paragraph",
            "fontsize",
            "brush",
            "|",
            "image",
            "link",
            "|",
            "align",
            "|",
            "undo",
            "redo",
          ]
        : [],
    }),
    [height, placeholder, showToolbar],
  );

  return (
    <JoditEditors
      value={value}
      config={config}
      onChange={(content: string) => onChange?.(content || "")}
      onBlur={() => onBlur?.()}
    />
  );
}

export default JoditEditor;
