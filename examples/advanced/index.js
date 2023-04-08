import io from 'socket.io-client'
const socket = io(`${process.env.WECHAT_SERVER_URL ?? 'http://localhost:3113'}/`)

function getReply() {
  const replies = ['典', '急', '麻', '乐', '孝', '啊对对对']
  return replies[Math.floor(Math.random() * replies.length)]
}

const enabled = ['22906722787@chatroom', '23333702307@chatroom']
const adminId = ['wxid_k5w9iugg43l621']

const actions = [
  {
    match: /\/time/,
    reply: () => `现在的时间是：${new Date().toLocaleString()}`
  },
  {
    match: /\/help/,
    reply: () => `智慧的人无需帮助。`
  }
]

socket.on('notify', async (ev) => {
  if (ev.typeName === 'kMessageUpdateEvent') {
    const msg = ev.decoded.newMsg
    const { conversationName, content, chatroomMemberUsername } = msg
    if (enabled.includes(conversationName)) {
      if (/@贴吧机器人/.test(content)) {
        const isAdmin = adminId.includes(chatroomMemberUsername)
        for (const acton of actions) {
          const result = content.match(acton.match)
          if (result) {
            const reply = await acton.reply({
              isAdmin,
              result
            })
            await socket.emitWithAck('invoke', 'MessageManager.sendTextMessageAsync', [
              [0, conversationName, reply]
            ])
            return
          }
        }
        await socket.emitWithAck('invoke', 'MessageManager.sendTextMessageAsync', [
          [0, conversationName, getReply()]
        ])
      }
    }
  }
})
