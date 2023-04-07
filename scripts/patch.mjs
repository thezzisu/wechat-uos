// @ts-check
import 'zx/globals'

const patches = await glob(path.join(__dirname, '..', 'patches', '*.mjs'))
cd(path.join(__dirname, '..', 'dist', 'app'))
for (const patch of patches) {
  await $`zx ${patch}`
}
