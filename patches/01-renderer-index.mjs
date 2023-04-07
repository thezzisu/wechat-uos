import 'zx/globals'

const target = 'packages/renderer/dist/static/js/index.777ea863.js'

const file = fs.readFileSync(target, 'utf-8')
let lines = file.split('\n').filter((line) => !line.startsWith('/*PATCH*/'))
let patch = fs.readFileSync(path.join(__dirname, '01-renderer-index.cjs'), 'utf-8')
lines = [...patch.split('\n').map((line) => `/*PATCH*/${line}`), '/*PATCH*/;', ...lines]
fs.writeFileSync(target, lines.join('\n'))
