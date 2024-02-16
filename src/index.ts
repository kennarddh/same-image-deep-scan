import Jimp from 'jimp'
import path from 'node:path'

import { XXHash3 } from 'xxhash-addon'

interface IImage {
	path: string
	width: number
	height: number
	hash: Buffer
}

const CreateImage = async (pathStr: string): Promise<IImage> => {
	const absolutePath = path.resolve(pathStr)

	const image = await Jimp.read(pathStr)

	const width = image.getWidth()
	const height = image.getHeight()

	return {
		path: absolutePath,
		width,
		height,
		hash: XXHash3.hash(image.bitmap.data),
	}
}

console.log(await CreateImage('./data/image1.jpg'))
