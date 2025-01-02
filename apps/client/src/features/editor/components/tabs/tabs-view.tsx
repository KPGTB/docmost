import {NodeViewContent, NodeViewProps, NodeViewWrapper} from "@tiptap/react"

import classes from "./tabs.module.css"

export default function TabsView(props: NodeViewProps) {
	return (
		<NodeViewWrapper>
			<div className={classes.tabsContainer}>
				<NodeViewContent />
			</div>
		</NodeViewWrapper>
	)
}
