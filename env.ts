const fs = require("fs")
const path = require("path")

const envData = Object.entries(process.env)
	.map(([key, value]) => `${key}=${value}`)
	.join("\n")

const outputPath = path.join(__dirname, ".env")

fs.writeFile(outputPath, envData, (err) => {
	if (err) {
		console.error("Error writing to file:", err)
	} else {
		console.log(`Environment variables saved to ${outputPath}`)
	}
})
