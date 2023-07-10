import Image from 'next/image'
import imageSrc from './image.png'

export default function Post() {
  return (
    <>
      <h1>Module with image</h1>
      <Image src={imageSrc} alt="" />
    </>
  )
}
