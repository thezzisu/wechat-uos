import 'zx/globals'

const file = fs.readFileSync('packages/main/dist/index.js', 'utf-8')
let lines = file.split('\n').filter((line) => !line.startsWith('/*PATCH*/'))
let patch = fs.readFileSync(path.join(__dirname, '00-main-index.cjs'), 'utf-8')
lines = [
  ...patch.split('\n').map((line) => `/*PATCH*/${line}`),
  '/*PATCH*/;',
  ...lines
]
fs.writeFileSync('packages/main/dist/index.js', lines.join('\n'))
