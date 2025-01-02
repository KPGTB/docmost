import React, {useState} from "react"

import {Group, Input} from "@mantine/core"
import {NodeViewContent, NodeViewProps, NodeViewWrapper} from "@tiptap/react"

import classes from "./tabs.module.css"

export default function TabView(props: NodeViewProps) {
	const {node, updateAttributes, extension, editor, getPos} = props
	const {language, title} = node.attrs
	const [languageValue, setLanguageValue] = useState<string | null>(
		language || null
	)
	const [titleValue, setTitleValue] = useState<string>(title || "")
	const [isSelected, setIsSelected] = useState(false)

	function changeTitle(title: string) {
		setTitleValue(title)
		updateAttributes({
			title: title,
		})
	}

	return (
		<NodeViewWrapper className={classes.tabContainer}>
			<Group
				justify="flex-end"
				contentEditable={false}
			>
				<Input
					placeholder="title"
					value={titleValue}
					onChange={(el) => changeTitle(el.target.value)}
					style={{flex: 1}}
					classNames={{input: classes.selectInput}}
					disabled={!editor.isEditable}
				/>
			</Group>

			<NodeViewContent data-title={titleValue} />
		</NodeViewWrapper>
	)
}
