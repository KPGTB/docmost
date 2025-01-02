export type CalloutType =
	| "default"
	| "info"
	| "success"
	| "warning"
	| "danger"
	| "note"
	| "tip"
const validCalloutTypes = [
	"default",
	"info",
	"success",
	"warning",
	"danger",
	"note",
	"tip",
]

export function getValidCalloutType(value: string): string {
	if (value) {
		return validCalloutTypes.includes(value) ? value : "info"
	}
}
