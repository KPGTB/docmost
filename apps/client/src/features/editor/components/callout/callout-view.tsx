import {CalloutType} from "@docmost/editor-ext"
import {Alert} from "@mantine/core"
import {
	IconAlertTriangleFilled,
	IconBulb,
	IconCircleCheckFilled,
	IconCircleXFilled,
	IconInfoCircleFilled,
} from "@tabler/icons-react"
import {NodeViewContent, NodeViewProps, NodeViewWrapper} from "@tiptap/react"

import classes from "./callout.module.css"

export default function CalloutView(props: NodeViewProps) {
	const {node} = props
	const {type} = node.attrs

	return (
		<NodeViewWrapper>
			<Alert
				variant="light"
				title=""
				color={getCalloutColor(type)}
				icon={getCalloutIcon(type)}
				p="xs"
				classNames={{
					message: classes.message,
					icon: classes.icon,
				}}
			>
				<NodeViewContent />
			</Alert>
		</NodeViewWrapper>
	)
}

function getCalloutIcon(type: CalloutType) {
	switch (type) {
		case "info":
			return <IconInfoCircleFilled />
		case "success":
			return <IconCircleCheckFilled />
		case "warning":
			return <IconAlertTriangleFilled />
		case "danger":
			return <IconCircleXFilled />
		case "note":
			return <IconInfoCircleFilled />
		case "tip":
			return <IconBulb />
		default:
			return <IconInfoCircleFilled />
	}
}

function getCalloutColor(type: CalloutType) {
	switch (type) {
		case "info":
			return "blue"
		case "success":
		case "tip":
			return "green"
		case "warning":
			return "orange"
		case "danger":
			return "red"
		case "default":
		case "note":
			return "gray"
		default:
			return "blue"
	}
}
