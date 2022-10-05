/* eslint-env jest */
import { transform } from 'next/dist/build/swc'

const swc = async (code) => {
  let output = await transform(code)
  return output.code
}

const trim = (s) => s.join('\n').trim().replace(/^\s+/gm, '')

describe('next/swc', () => {
  describe('hook_optimizer', () => {
    it('should transform Array-destructured hook return values use object destructuring', async () => {
      const output = await swc(
        trim`
        import { useState, useReducer, useMemo } from 'react';
        const [count, setCount] = useState(0);
        const [state, dispatch] = useReducer((s) => s, {});
        const memeState = useMemo(() => {})
      `
      )

      expect(output).toMatch(trim`
        var ref = useState(0), count = ref[0], setCount = ref[1];

      `)

      expect(output).toMatchInlineSnapshot(`
        "import { useState, useReducer, useMemo } from \\"react\\";
        var ref = useState(0), count = ref[0], setCount = ref[1];
        var ref1 = useReducer(function(s) {
            return s;
        }, {}), state = ref1[0], dispatch = ref1[1];
        var memeState = useMemo(function() {});
        "
      `)
    })

    it('should be able to ignore some Array-destructured hook return values', async () => {
      const output = await swc(
        trim`
        import { useState } from 'react';
        const [, setCount] = useState(0);
      `
      )

      expect(output).toMatch(trim`
        var ref = useState(0), setCount = ref[1];
      `)

      expect(output).toMatchInlineSnapshot(`
        "import { useState } from \\"react\\";
        var ref = useState(0), setCount = ref[1];
        "
      `)
    })
  })
})
