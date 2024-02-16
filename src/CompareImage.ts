import { IImage } from 'Types.js'

const CompareImage = (image1: IImage, image2: IImage): boolean => {
	if (image1.path === image2.path) return true

	if (image1.width !== image2.width) return false
	if (image1.height !== image2.height) return false

	return image1.hash === image2.hash
}

export default CompareImage
