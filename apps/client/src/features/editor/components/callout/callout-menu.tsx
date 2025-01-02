import {Node as PMNode} from "prosemirror-model"
import React, {useCallback} from "react"

import {
	EditorMenuProps,
	ShouldShowProps,
} from "@/features/editor/components/table/types/types.ts"
import {CalloutType} from "@docmost/editor-ext"
import {ActionIcon, Tooltip} from "@mantine/core"
import {
	IconAlertTriangleFilled,
	IconBulb,
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconInfoCircleFilled,
} from "@tabler/icons-react"
import {
	BubbleMenu as BaseBubbleMenu,
	findParentNode,
	posToDOMRect,
} from "@tiptap/react"

export function CalloutMenu({editor}: EditorMenuProps) {
	const shouldShow = useCallback(
		({state}: ShouldShowProps) => {
			if (!state) {
				return false
			}

			return editor.isActive("callout")
		},
		[editor]
	)

	const getReferenceClientRect = useCallback(() => {
		const {selection} = editor.state
		const predicate = (node: PMNode) => node.type.name === "callout"
		const parent = findParentNode(predicate)(selection)

		if (parent) {
			const dom = editor.view.nodeDOM(parent?.pos) as HTMLElement
			return dom.getBoundingClientRect()
		}

		return posToDOMRect(editor.view, selection.from, selection.to)
	}, [editor])

	const setCalloutType = useCallback(
		(calloutType: CalloutType) => {
			editor
				.chain()
				.focus(undefined, {scrollIntoView: false})
				.updateCalloutType(calloutType)
				.run()
		},
		[editor]
	)

	return (
		<BaseBubbleMenu
			editor={editor}
			pluginKey={`callout-menu}`}
			updateDelay={0}
			tippyOptions={{
				getReferenceClientRect,
				offset: [0, 10],
				placement: "bottom",
				zIndex: 99,
				popperOptions: {
					modifiers: [{name: "flip", enabled: false}],
				},
			}}
			shouldShow={shouldShow}
		>
			<ActionIcon.Group className="actionIconGroup">
				<Tooltip
					position="top"
					label="Info"
				>
					<ActionIcon
						onClick={() => setCalloutType("info")}
						size="lg"
						aria-label="Info"
						variant={
							editor.isActive("callout", {type: "info"})
								? "light"
								: "default"
						}
					>
						<IconInfoCircleFilled size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip
					position="top"
					label="Success"
				>
					<ActionIcon
						onClick={() => setCalloutType("success")}
						size="lg"
						aria-label="Success"
						variant={
							editor.isActive("callout", {type: "success"})
								? "light"
								: "default"
						}
					>
						<IconCircleCheckFilled size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip
					position="top"
					label="Tip"
				>
					<ActionIcon
						onClick={() => setCalloutType("tip")}
						size="lg"
						aria-label="Tip"
						variant={
							editor.isActive("callout", {type: "tip"})
								? "light"
								: "default"
						}
					>
						<IconBulb size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip
					position="top"
					label="Warning"
				>
					<ActionIcon
						onClick={() => setCalloutType("warning")}
						size="lg"
						aria-label="Warning"
						variant={
							editor.isActive("callout", {type: "warning"})
								? "light"
								: "default"
						}
					>
						<IconAlertTriangleFilled size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip
					position="top"
					label="Danger"
				>
					<ActionIcon
						onClick={() => setCalloutType("danger")}
						size="lg"
						aria-label="Danger"
						variant={
							editor.isActive("callout", {type: "danger"})
								? "light"
								: "default"
						}
					>
						<IconCircleXFilled size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip
					position="top"
					label="Note"
				>
					<ActionIcon
						onClick={() => setCalloutType("note")}
						size="lg"
						aria-label="Note"
						variant={
							editor.isActive("callout", {type: "note"})
								? "light"
								: "default"
						}
					>
						<IconInfoCircleFilled size={18} />
					</ActionIcon>
				</Tooltip>
			</ActionIcon.Group>
		</BaseBubbleMenu>
	)
}

export default CalloutMenu
