import Image from 'next/image'
import serverSvg from './server.svg'
import { ClientImages } from './client-images'

export default function Page() {
  return (
    <>
      <Image id="server-next-image" src={serverSvg} alt="" />
      <img id="server-img" src={serverSvg.src} alt="" />
      <img id="public-img" src="/public.svg" alt="" />
      <Image
        id="public-next-image"
        src="/public.svg"
        width={32}
        height={32}
        alt=""
      />
      <ClientImages />
    </>
  )
}
