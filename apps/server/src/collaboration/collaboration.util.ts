import {
  Attachment,
  Callout,
  Comment,
  CustomCodeBlock,
  Details,
  DetailsContent,
  DetailsSummary,
  Drawio,
  Embed,
  Excalidraw,
  LinkExtension,
  MathBlock,
  MathInline,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  TiptapImage,
  TiptapVideo,
  TrailingNode,
} from '@docmost/editor-ext';
import { generateText, getSchema, JSONContent } from '@tiptap/core';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableHeader from '@tiptap/extension-table-header';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { Youtube } from '@tiptap/extension-youtube';
// @tiptap/html library works best for generating prosemirror json state but not HTML
// see: https://github.com/ueberdosis/tiptap/issues/5352
// see:https://github.com/ueberdosis/tiptap/issues/4089
import { generateJSON } from '@tiptap/html';
import { Node } from '@tiptap/pm/model';
import { StarterKit } from '@tiptap/starter-kit';

import { generateHTML } from '../common/helpers/prosemirror/html';

export const tiptapExtensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  Comment,
  TextAlign,
  TaskList,
  TaskItem,
  Underline,
  LinkExtension,
  Superscript,
  SubScript,
  Highlight,
  Typography,
  TrailingNode,
  TextStyle,
  Color,
  MathInline,
  MathBlock,
  Details,
  DetailsContent,
  DetailsSummary,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Youtube,
  TiptapImage,
  TiptapVideo,
  Callout,
  Attachment,
  CustomCodeBlock,
  Drawio,
  Excalidraw,
  Embed,
  Tabs,
  Tab,
] as any;

export function jsonToHtml(tiptapJson: any) {
  return generateHTML(tiptapJson, tiptapExtensions);
}

export function htmlToJson(html: string) {
  return generateJSON(html, tiptapExtensions);
}

export function jsonToText(tiptapJson: JSONContent) {
  return generateText(tiptapJson, tiptapExtensions);
}

export function jsonToNode(tiptapJson: JSONContent) {
  return Node.fromJSON(getSchema(tiptapExtensions), tiptapJson);
}

export function getPageId(documentName: string) {
  return documentName.split('.')[1];
}
