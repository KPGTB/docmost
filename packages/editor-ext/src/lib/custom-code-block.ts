import CodeBlockLowlight, {
	CodeBlockLowlightOptions,
} from "@tiptap/extension-code-block-lowlight"
import {mergeAttributes, ReactNodeViewRenderer} from "@tiptap/react"

export interface CustomCodeBlockOptions extends CodeBlockLowlightOptions {
	view: any
}

const TAB_CHAR = "\u00A0\u00A0"

export const CustomCodeBlock = CodeBlockLowlight.extend<CustomCodeBlockOptions>(
	{
		selectable: true,

		addOptions() {
			return {
				...this.parent?.(),
				view: null,
			}
		},

		addKeyboardShortcuts() {
			return {
				...this.parent?.(),
				Tab: () => {
					if (this.editor.isActive("codeBlock")) {
						this.editor
							.chain()
							.command(({tr}) => {
								tr.insertText(TAB_CHAR)
								return true
							})
							.run()
						return true
					}
				},
			}
		},

		addNodeView() {
			return ReactNodeViewRenderer(this.options.view)
		},

		addAttributes() {
			return {
				language: {
					default: this.options.defaultLanguage,
					parseHTML: (element) => {
						const {languageClassPrefix} = this.options
						const classNames = [
							...(element.firstElementChild?.classList || []),
						]
						const languages = classNames
							.filter((className) =>
								className.startsWith(languageClassPrefix)
							)
							.map((className) =>
								className.replace(languageClassPrefix, "")
							)
						const language = languages[0]

						if (!language) {
							return null
						}

						return language
					},
					rendered: false,
				},
				title: {
					default: "",
					parseHTML: (element) => {
						const title =
							element.firstElementChild?.getAttribute(
								"data-title"
							)

						if (!title) {
							return null
						}

						return title
					},
					rendered: false,
				},
			}
		},

		renderHTML({node, HTMLAttributes}) {
			return [
				"pre",
				mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
				[
					"code",
					{
						class: node.attrs.language
							? this.options.languageClassPrefix +
								node.attrs.language
							: null,
						"data-title": node.attrs.title,
					},
					0,
				],
			]
		},
	}
)
