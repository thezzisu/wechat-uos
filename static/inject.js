const socket = io('http://localhost:3113/?type=agent')
const { ipcRenderer } = require('electron')

function getEventType(t) {
  return {
    eventType: t,
    typeName: Object.keys(alita.AlitaEventType).find((e) => alita.AlitaEventType[e] === t) ?? null
  }
}

function decodeEvent(t) {
  switch (t.eventType) {
    case alita.AlitaEventType.kNetworkStateChangeEvent:
      return alita.NetworkStateChangeRequest.decode(t.content)
    case alita.AlitaEventType.kForegroundChangeEvent:
      return alita.ForegroundChangeRequest.decode(t.content)
    case alita.AlitaEventType.kGetExtSpamInfoEvent:
      return alita.GetExtSpamInfoRequest.decode(t.content)
    case alita.AlitaEventType.kDynamicConfigUpdateEvent:
      return alita.DynamicConfigUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kUserUpdateEvent:
      return alita.UserUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kLoggedInUserProfileUpdateEvent:
      return alita.LoggedInUserProfileUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kLoginStateChangeEvent:
      return alita.LoginStateChangeRequest.decode(t.content)
    case alita.AlitaEventType.kLoginQrCodeStateChangeEvent:
      return alita.LoginQrCodeStateChangeRequest.decode(t.content)
    case alita.AlitaEventType.kContactUpdateEvent:
      return alita.ContactUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kNewVerifyEvent:
      return alita.NewVerifyRequest.decode(t.content)
    case alita.AlitaEventType.kVerifyContactUpdateEvent:
      return alita.VerifyContactUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kMessageUpdateEvent:
      return alita.MessageUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kMessageNotifyEvent:
      return alita.MessageNotifyRequest.decode(t.content)
    case alita.AlitaEventType.kMessageProgressEvent:
      return alita.MessageProgressRequest.decode(t.content)
    case alita.AlitaEventType.kConversationUpdateEvent:
      return alita.ConversationUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kConversationListSyncUpdateEvent:
      return alita.ConversationListSyncUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kEnterConversationEvent:
      return alita.EnterConversationRequest.decode(t.content)
    case alita.AlitaEventType.kChatRoomVersionUpdateEvent:
      return alita.ChatRoomVersionUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kAvatarUpdateEvent:
      return alita.AvatarUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kAudioFormatChangeEvent:
      return alita.AudioFormatChangeRequest.decode(t.content)
    case alita.AlitaEventType.kVoipStateChangeEvent:
      return alita.VoipStateChangeRequest.decode(t.content)
    case alita.AlitaEventType.kVoipFinishEvent:
      return alita.VoipFinishRequest.decode(t.content)
    case alita.AlitaEventType.kReceiveInviteEvent:
      return alita.ReceiveInviteRequest.decode(t.content)
    case alita.AlitaEventType.kRemoteCloseCameraEvent:
      return alita.RemarkContactRequest.decode(t.content)
    case alita.AlitaEventType.kCanAnswerVoipEvent:
      return alita.CanAnswerVoipResponse.decode(t.content)
    case alita.AlitaEventType.kEmojiUpdateEvent:
      return alita.EmojiUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kBindStateChangeEvent:
      return alita.BindStateChangeRequest.decode(t.content)
    case alita.AlitaEventType.kReceivePayMessageEvent:
      return alita.ReceivePayMessageRequest.decode(t.content)
    case alita.AlitaEventType.kPayCodeUpdateEvent:
      return alita.PayCodeUpdateRequest.decode(t.content)
    case alita.AlitaEventType.kReceiveNotifyEvent:
      return alita.ReceiveNotifyRequest.decode(t.content)
    default:
      console.log('Unknown event', t)
  }
  return null
}

socket.on('invoke', (channel, args, callback) => {
  console.log('invoke', channel, args)
  ipcRenderer.invoke(channel, ...args).then(callback)
})

socket.on('send', (channel, args) => {
  console.log('send', channel, args)
  ipcRenderer.send(channel, ...args)
})

window.socket = socket
window.onNotify = (t) => {
  const decoded = decodeEvent(t)
  socket.emit('notify', { decoded, ...getEventType(t.eventType) })
}
