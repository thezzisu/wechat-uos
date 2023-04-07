const oldRequire = require
const injectedLog = (...args) => {
  console.log(`INJECTOR`, ...args)
}
const injectScript = (src) => {
  const script = document.createElement('script')
  script.src = src
  document.body.appendChild(script)
}
injectScript('http://localhost:3113/socket.io/socket.io.js')
injectScript('http://localhost:3113/inject.js')
require = (mod) => {
  injectedLog('require', mod)
  if (mod !== 'electron') return oldRequire(mod)
  const electron = oldRequire('electron')
  const ipcRendererOverrides = {
    on(channel, listener) {
      injectedLog('ipcRenderer.on', channel)
      return electron.ipcRenderer.on(channel, (ev, ...args) => {
        injectedLog('ipcRenderer.on event', channel, ...args)
        listener(ev, ...args)
        if (channel === 'alita_notify') {
          window.onNotify?.(...args)
        } else {
          window.socket?.emit('event', channel, args)
        }
      })
    },
    handle(channel, listener) {
      injectedLog('ipcRenderer.handle', channel)
      return electron.ipcRenderer.handle(channel, listener)
    },
    send(channel, ...args) {
      injectedLog('ipcRenderer.send', channel, ...args)
      return electron.ipcRenderer.send(channel, ...args)
    },
    async invoke(channel, ...args) {
      injectedLog('ipcRenderer.invoke', channel, ...args)
      const result = await electron.ipcRenderer.invoke(channel, ...args)
      injectedLog('ipcRenderer.invoke result', channel, ...args, result)
      return result
    }
  }
  const overrides = {
    ipcRenderer: new Proxy(electron.ipcRenderer, {
      get: (target, prop) => {
        return ipcRendererOverrides[prop] ?? electron.ipcRenderer[prop]
      }
    })
  }
  return new Proxy(electron, {
    get: (target, prop) => {
      return overrides[prop] ?? electron[prop]
    }
  })
}
