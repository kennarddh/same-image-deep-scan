import CreateImage from 'CreateImage.js'
import { IImage } from 'Types.js'

import { Glob } from 'glob'

const images: IImage[] = []

const imageFilesGlob = new Glob('./data/**/*.{png,jpg,jpeg}', {})

for await (const imagePath of imageFilesGlob) {
	const image = await CreateImage(imagePath)

	images.push(image)
}

console.log(images)
