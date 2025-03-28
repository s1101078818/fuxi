/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "jsoneditor-react" {
  import { Component } from "react";
  import { JSONEditorOptions } from "jsoneditor";

  export interface JsonEditorProps {
    value: any;
    onChange?: (value: any) => void;
    mode?: "tree" | "view" | "form" | "code" | "text";
    htmlElementProps?: React.HTMLAttributes<HTMLDivElement>;
    options?: JSONEditorOptions;
  }

  export class JsonEditor extends Component<JsonEditorProps> {}
}
