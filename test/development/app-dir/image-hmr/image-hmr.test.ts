import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

const blueSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="blue"/></svg>\n'

describe('image-hmr', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function fetchImage(src: string) {
    const res = await next.fetch(src)
    expect(res.status).toBe(200)
    return Buffer.from(await res.arrayBuffer())
  }

  async function expectImageToUpdate(
    id: string,
    changeImage: (assertUpdated: () => Promise<void>) => Promise<void>
  ) {
    const browser = await next.browser('/')
    await browser.eval('window.__noReload = true')
    const initialSrc = await browser.elementById(id).getAttribute('src')
    const initialImage = await fetchImage(initialSrc)

    await changeImage(async () => {
      let src: string
      await retry(async () => {
        src = await browser.elementById(id).getAttribute('src')
        expect(src).not.toBe(initialSrc)
      })

      expect((await fetchImage(src!)).equals(initialImage)).toBe(false)
      // The image was updated in place, not by reloading the page.
      expect(await browser.eval('window.__noReload')).toBe(true)
    })
  }

  it.each([
    ['server-next-image', 'app/server.svg'],
    ['server-img', 'app/server.svg'],
    ['client-next-image', 'app/client.svg'],
    ['client-img', 'app/client.svg'],
    ['public-img', 'public/public.svg'],
    ['public-next-image', 'public/public.svg'],
  ])('should update #%s when %s changes', async (id, file) => {
    await expectImageToUpdate(id, (assertUpdated) =>
      next.patchFile(file, blueSvg, assertUpdated)
    )
  })
})
