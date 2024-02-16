import CreateImage from 'CreateImage.js'
import { IImage } from 'Types.js'

import { Glob } from 'glob'

import fs from 'fs'

const images: IImage[] = []

console.log('Creating images')
console.time('Creating images done')

const imageFilesGlob = new Glob('./data/**/*.{png,jpg,jpeg}', {})

for await (const imagePath of imageFilesGlob) {
	const image = await CreateImage(imagePath)

	images.push(image)
}

console.timeEnd('Creating images done')

console.log(`Found ${images.length} images`)

console.log('Checking duplicates')

console.time('Checking duplicates')

const imageMap: Map<string, string[]> = new Map()

for (const image of images) {
	const hexHash = image.hash.toString('hex')

	if (imageMap.has(hexHash)) {
		imageMap.get(hexHash)?.push(image.path)
	} else {
		imageMap.set(hexHash, [image.path])
	}
}

console.timeEnd('Checking duplicates')

console.log(
	`Found ${imageMap.size} unique images and ${
		images.length - imageMap.size
	} redundant duplicated images.`
)

console.log('Writing output')

console.time('Writing output done')

const outputFileStream = fs.createWriteStream('./duplicateImages.txt')

for (const [hash, images] of imageMap) {
	outputFileStream.write(`${hash}\n${images.join('\n')}\n\n`)
}

outputFileStream.end()

console.timeEnd('Writing output done')
