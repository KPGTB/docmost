import {findParentNode, mergeAttributes, Node} from "@tiptap/core"
import {TextSelection} from "@tiptap/pm/state"
import {ReactNodeViewRenderer} from "@tiptap/react"

export interface TabsOptions {
	HTMLAttributes: Record<string, any>
	view: any
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		tabs: {
			setTabs: () => ReturnType
			toggleTabs: () => ReturnType
		}
	}
}

export const Tabs = Node.create<TabsOptions>({
	name: "tabs",

	addOptions() {
		return {
			HTMLAttributes: {},
			view: null,
		}
	},

	content: "block+",
	group: "block",
	defining: true,

	parseHTML() {
		return [
			{
				tag: `div[data-type="${this.name}"]`,
			},
		]
	},

	renderHTML({HTMLAttributes}) {
		return [
			"div",
			mergeAttributes(
				{"data-type": this.name},
				this.options.HTMLAttributes,
				HTMLAttributes
			),
			0,
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(this.options.view)
	},

	addKeyboardShortcuts() {
		return {
			//"Mod-Shift-c": () => this.editor.commands.toggleCallout(),

			/**
			 * Handle the backspace key when deleting content.
			 * Aims to stop merging callouts when deleting content in between.
			 */
			Backspace: ({editor}) => {
				const {state, view} = editor
				const {selection} = state

				// If the selection is not empty, return false
				// and let other extension handle the deletion.
				if (!selection.empty) {
					return false
				}

				const {$from} = selection

				// If not at the start of current node, no joining will happen
				if ($from.parentOffset !== 0) {
					return false
				}

				const previousPosition = $from.before($from.depth) - 1

				// If nothing above to join with
				if (previousPosition < 1) {
					return false
				}

				const previousPos = state.doc.resolve(previousPosition)

				// If resolving previous position fails, bail out
				if (!previousPos?.parent) {
					return false
				}

				const previousNode = previousPos.parent
				const parentNode = findParentNode(() => true)(selection)

				if (!parentNode) {
					return false
				}

				const {node, pos, depth} = parentNode

				// If current node is nested
				if (depth !== 1) {
					return false
				}

				// If previous node is a callout, cut current node's content into it
				if (
					node.type !== this.type &&
					previousNode.type === this.type
				) {
					const {content, nodeSize} = node
					const {tr} = state

					tr.delete(pos, pos + nodeSize)
					tr.setSelection(
						TextSelection.near(tr.doc.resolve(previousPosition - 1))
					)
					tr.insert(previousPosition - 1, content)

					view.dispatch(tr)

					return true
				}
				return false
			},
		}
	},

	addCommands() {
		return {
			setTabs:
				() =>
				({commands}) => {
					return commands.setNode(this.name, {})
				},
			toggleTabs:
				() =>
				({commands}) => {
					return commands.toggleWrap(this.name, {})
				},
		}
	},
})
