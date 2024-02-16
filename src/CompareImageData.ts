import Jimp from 'jimp'
import Pixelmatch from 'pixelmatch'
import path from 'node:path'

const DIFFERENT_PIXEL_THRESHOLD = 100

const CompareImageData = async (
	image1Path: string,
	image2Path: string
): Promise<[boolean, number]> => {
	const image1AbsolutePath = path.resolve(image1Path)
	const image2AbsolutePath = path.resolve(image2Path)

	const image1 = await Jimp.read(image1AbsolutePath)
	const image2 = await Jimp.read(image2AbsolutePath)

	const image1Width = image1.getWidth()
	const image1Height = image1.getHeight()
	const image2Width = image2.getWidth()
	const image2Height = image2.getHeight()

	if (image1Width !== image2Width) return [false, -1]
	if (image1Height !== image2Height) return [false, -2]

	const image1Data = image1.bitmap.data
	const image2Data = image2.bitmap.data

	const numDiffPixels = Pixelmatch(
		image1Data,
		image2Data,
		null,
		image1Width,
		image1Height,
		{ threshold: 0.1 }
	)

	return [numDiffPixels <= DIFFERENT_PIXEL_THRESHOLD, numDiffPixels]
}

export default CompareImageData
