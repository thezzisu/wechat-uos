import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'url'
import path from 'path'
import { Server, Socket } from 'socket.io'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = fastify({ logger: true })
const io = new Server(server.server, {})

io.on('connection', (socket) => {
  const type = socket.handshake.query.type ?? 'client'
  console.log(`Socket ${socket.id} (${type}) connected`)
  if (type === 'agent_home') {
    socket.join('agent_home')
    socket.on('event', (channel, args) => {
      io.to('client').emit('event', channel, args)
    })
    socket.on('notify', (msg) => {
      io.to('client').emit('notify', msg)
    })
  } else {
    socket.join('client')
    socket.on('invoke', async (channel, args, cb) => {
      try {
        const results = await io
          .to('agent_home')
          .timeout(10000)
          .emitWithAck('invoke', channel, args)
        cb(results[0])
      } catch (err) {
        console.log(err)
        cb(null)
      }
    })
  }
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`)
  })
})

await server.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'static')
})

server.get('/health', async () => {
  return 'ok'
})

await server.listen({
  port: 3113,
  host: '0.0.0.0'
})
