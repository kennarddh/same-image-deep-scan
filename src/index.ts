import { IImage } from 'Types.js'
import FormatTimeSince from './FormatTimeSince.js'

import { Glob } from 'glob'

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

import workerpool, { Promise as WorkerPoolPromise } from 'workerpool'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const pool = workerpool.pool(`${__dirname}/CreateImage.js`, {
	workerType: 'thread',
})

console.log('Creating images')

const createImageStart = process.hrtime.bigint()

const imageFilesGlob = new Glob('./data/**/*.{png,jpg,jpeg}', {})

const createImagePromises: WorkerPoolPromise<Promise<IImage>>[] = []

for await (const imagePath of imageFilesGlob) {
	const exec = pool.exec('CreateImage', [imagePath])

	createImagePromises.push(exec)
}

const images = await Promise.all(createImagePromises)

await pool.terminate()

console.log(`Images created in ${FormatTimeSince(createImageStart)}`)

console.log(`Found ${images.length} images`)

console.log('Checking duplicates')

const checkDuplicateStart = process.hrtime.bigint()

const imageMap: Map<string, string[]> = new Map()

for (const image of images) {
	const strHash = image.hash

	if (imageMap.has(strHash)) {
		imageMap.get(strHash)?.push(image.path)
	} else {
		imageMap.set(strHash, [image.path])
	}
}

console.log(`Duplicates checked in ${FormatTimeSince(checkDuplicateStart)}`)

console.log(
	`Found ${imageMap.size} unique images and ${
		images.length - imageMap.size
	} redundant duplicated images.`
)

console.log('Writing output')

const writeOutputStart = process.hrtime.bigint()

const allImagesFileStream = fs.createWriteStream('./allImages.txt')
const allImagesJSONFileStream = fs.createWriteStream('./allImages.json')
const duplicateImagesFileStream = fs.createWriteStream('./duplicateImages.txt')

const imageObj: Record<string, string[]> = {}

for (const [hash, images] of imageMap) {
	imageObj[hash] = images

	const msg = `${hash}\n${images.join('\n')}\n\n`

	if (images.length > 1) duplicateImagesFileStream.write(msg)

	allImagesFileStream.write(msg)
}

allImagesJSONFileStream.write(JSON.stringify(imageObj, null, 4))

allImagesFileStream.end()
allImagesJSONFileStream.end()
duplicateImagesFileStream.end()

console.log(`Output written in ${FormatTimeSince(writeOutputStart)}`)
