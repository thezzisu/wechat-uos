import io from 'socket.io-client'
const socket = io(`${process.env.WECHAT_SERVER_URL ?? 'http://localhost:3113'}/`)

function getReply() {
  const replies = ['典', '急', '麻', '乐', '孝', '啊对对对']
  return replies[Math.floor(Math.random() * replies.length)]
}

const enabled = ['22906722787@chatroom', '23333702307@chatroom']

socket.on('notify', async (msg) => {
  if (msg.typeName === 'kMessageUpdateEvent') {
    if (enabled.includes(msg.decoded.newMsg.conversationName)) {
      console.log(msg.decoded.newMsg.content)
      if (/@贴吧机器人/.test(msg.decoded.newMsg.content)) {
        await socket.emitWithAck('invoke', 'MessageManager.sendTextMessageAsync', [
          [0, msg.decoded.newMsg.conversationName, getReply()]
        ])
      }
    }
  }
})
