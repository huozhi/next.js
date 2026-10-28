'use client'

import Image from 'next/image'
import clientSvg from './client.svg'

export function ClientImages() {
  return (
    <>
      <Image id="client-next-image" src={clientSvg} alt="" />
      <img id="client-img" src={clientSvg.src} alt="" />
    </>
  )
}
