import CreateImage from 'CreateImage.js'
import { IImage } from 'Types.js'

import { Glob } from 'glob'

const images: IImage[] = []

const imageFilesGlob = new Glob('./data/**/*.{png,jpg,jpeg}', {})

for await (const imagePath of imageFilesGlob) {
	const image = await CreateImage(imagePath)

	images.push(image)
}

const imageMap: Map<string, string[]> = new Map()

for (const image of images) {
	const hexHash = image.hash.toString('hex')

	if (imageMap.has(hexHash)) {
		imageMap.get(hexHash)?.push(image.path)
	} else {
		imageMap.set(hexHash, [image.path])
	}
}

console.log(imageMap)
