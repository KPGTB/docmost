import clojure from "highlight.js/lib/languages/clojure"
import dockerfile from "highlight.js/lib/languages/dockerfile"
import elixir from "highlight.js/lib/languages/elixir"
import erlang from "highlight.js/lib/languages/erlang"
import fortran from "highlight.js/lib/languages/fortran"
import gradle from "highlight.js/lib/languages/gradle"
import haskell from "highlight.js/lib/languages/haskell"
import plaintext from "highlight.js/lib/languages/plaintext"
import powershell from "highlight.js/lib/languages/powershell"
import scala from "highlight.js/lib/languages/scala"
import {common, createLowlight} from "lowlight"
import GlobalDragHandle from "tiptap-extension-global-drag-handle"

import AttachmentView from "@/features/editor/components/attachment/attachment-view.tsx"
import CalloutView from "@/features/editor/components/callout/callout-view.tsx"
import CodeBlockView from "@/features/editor/components/code-block/code-block-view.tsx"
import EmbedView from "@/features/editor/components/embed/embed-view.tsx"
import ExcalidrawView from "@/features/editor/components/excalidraw/excalidraw-view.tsx"
import ImageView from "@/features/editor/components/image/image-view.tsx"
import MathBlockView from "@/features/editor/components/math/math-block.tsx"
import MathInlineView from "@/features/editor/components/math/math-inline.tsx"
import VideoView from "@/features/editor/components/video/video-view.tsx"
import SlashCommand from "@/features/editor/extensions/slash-command"
import {randomElement, userColors} from "@/features/editor/extensions/utils.ts"
import {IUser} from "@/features/user/types/user.types.ts"
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
	Selection,
	Tab,
	TableCell,
	TableRow,
	Tabs,
	TiptapImage,
	TiptapVideo,
	TrailingNode,
} from "@docmost/editor-ext"
import {HocuspocusProvider} from "@hocuspocus/provider"
import {Collaboration} from "@tiptap/extension-collaboration"
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor"
import {Color} from "@tiptap/extension-color"
import {Highlight} from "@tiptap/extension-highlight"
import {Placeholder} from "@tiptap/extension-placeholder"
import SubScript from "@tiptap/extension-subscript"
import {Superscript} from "@tiptap/extension-superscript"
import Table from "@tiptap/extension-table"
import TableHeader from "@tiptap/extension-table-header"
import {TaskItem} from "@tiptap/extension-task-item"
import {TaskList} from "@tiptap/extension-task-list"
import {TextAlign} from "@tiptap/extension-text-align"
import {TextStyle} from "@tiptap/extension-text-style"
import {Typography} from "@tiptap/extension-typography"
import {Underline} from "@tiptap/extension-underline"
import {Youtube} from "@tiptap/extension-youtube"
import {StarterKit} from "@tiptap/starter-kit"

import DrawioView from "../components/drawio/drawio-view"
import TabView from "../components/tabs/tab-view"
import TabsView from "../components/tabs/tabs-view"

const lowlight = createLowlight(common)
lowlight.register("mermaid", plaintext)
lowlight.register("powershell", powershell)
lowlight.register("powershell", powershell)
lowlight.register("erlang", erlang)
lowlight.register("elixir", elixir)
lowlight.register("dockerfile", dockerfile)
lowlight.register("clojure", clojure)
lowlight.register("fortran", fortran)
lowlight.register("haskell", haskell)
lowlight.register("scala", scala)
lowlight.register("gradle", gradle)

export const mainExtensions = [
	StarterKit.configure({
		history: false,
		dropcursor: {
			width: 3,
			color: "#70CFF8",
		},
		codeBlock: false,
		code: {
			HTMLAttributes: {
				spellcheck: false,
			},
		},
	}),
	Placeholder.configure({
		placeholder: ({node}) => {
			if (node.type.name === "heading") {
				return `Heading ${node.attrs.level}`
			}
			if (node.type.name === "detailsSummary") {
				return "Toggle title"
			}
			if (node.type.name === "paragraph") {
				return 'Write anything. Enter "/" for commands'
			}
		},
		includeChildren: true,
		showOnlyWhenEditable: true,
	}),
	TextAlign.configure({types: ["heading", "paragraph"]}),
	TaskList,
	TaskItem.configure({
		nested: true,
	}),
	Underline,
	LinkExtension.configure({
		openOnClick: false,
	}),
	Superscript,
	SubScript,
	Highlight.configure({
		multicolor: true,
	}),
	Typography,
	TrailingNode,
	GlobalDragHandle,
	TextStyle,
	Color,
	SlashCommand,
	Comment.configure({
		HTMLAttributes: {
			class: "comment-mark",
		},
	}),

	Table.configure({
		resizable: true,
		lastColumnResizable: false,
		allowTableNodeSelection: true,
	}),
	TableRow,
	TableCell,
	TableHeader,

	MathInline.configure({
		view: MathInlineView,
	}),
	MathBlock.configure({
		view: MathBlockView,
	}),
	Details,
	DetailsSummary,
	DetailsContent,
	Youtube.configure({
		addPasteHandler: false,
		controls: true,
		nocookie: true,
	}),
	TiptapImage.configure({
		view: ImageView,
		allowBase64: false,
	}),
	TiptapVideo.configure({
		view: VideoView,
	}),
	Callout.configure({
		view: CalloutView,
	}),
	CustomCodeBlock.configure({
		view: CodeBlockView,
		lowlight,
		HTMLAttributes: {
			spellcheck: false,
		},
	}),
	Selection,
	Attachment.configure({
		view: AttachmentView,
	}),
	Drawio.configure({
		view: DrawioView,
	}),
	Excalidraw.configure({
		view: ExcalidrawView,
	}),
	Embed.configure({
		view: EmbedView,
	}),
	Tabs.configure({
		view: TabsView,
	}),
	Tab.configure({
		view: TabView,
	}),
] as any

type CollabExtensions = (provider: HocuspocusProvider, user: IUser) => any[]

export const collabExtensions: CollabExtensions = (provider, user) => [
	Collaboration.configure({
		document: provider.document,
	}),
	CollaborationCursor.configure({
		provider,
		user: {
			name: user.name,
			color: randomElement(userColors),
		},
	}),
]
