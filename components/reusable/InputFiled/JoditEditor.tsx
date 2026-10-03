"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const JoditEditors = dynamic(() => import("jodit-react"), { ssr: false });

interface JoditEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

function JoditEditor({
  value = "",
  placeholder,
  onChange,
  onBlur,
}: JoditEditorProps) {
  const config = useMemo(() => ({
    readonly: false,
    height: 300,
    placeholder,
    toolbarAdaptive: false,
    toolbarSticky: false,
    enableDragAndDropFileToEditor: true,
    showXPathInStatusbar: false,
    showBrowserColorPicker: false,
    showCharsCounter: false,
    showWordsCounter: false,
    statusbar: false,
    enter: "P",
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
    buttons: [
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
    ],
  }), [placeholder]);

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
