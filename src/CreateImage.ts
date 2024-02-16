import { IImage } from 'Types.js'
import Jimp from 'jimp'
import path from 'node:path'

import xxhash from 'xxhash-addon'

const CreateImage = async (pathStr: string): Promise<IImage> => {
	const absolutePath = path.resolve(pathStr)

	const image = await Jimp.read(pathStr)

	const width = image.getWidth()
	const height = image.getHeight()

	return {
		path: absolutePath,
		width,
		height,
		hash: xxhash.XXHash3.hash(image.bitmap.data),
	}
}

export default CreateImage
