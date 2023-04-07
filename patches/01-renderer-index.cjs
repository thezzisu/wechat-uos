const oldRequire = require
const injectedLog = (...args) => {
  console.log(`INJECT[${process.pid}]`, ...args)
}
require = (mod) => {
  injectedLog('require', mod)
  if (mod !== 'electron') return oldRequire(mod)
  const electron = oldRequire('electron')
  const ipcRendererOverrides = {
    on(channel, listener) {
      injectedLog('ipcRenderer.on', channel)
      return electron.ipcRenderer.on(channel, listener)
    },
    handle(channel, listener) {
      injectedLog('ipcRenderer.handle', channel)
      return electron.ipcRenderer.handle(channel, listener)
    },
    send(channel, ...args) {
      injectedLog('ipcRenderer.send', channel, ...args)
      return electron.ipcRenderer.send(channel, ...args)
    },
    invoke(channel, ...args) {
      injectedLog('ipcRenderer.invoke', channel, ...args)
      return electron.ipcRenderer.invoke(channel, ...args)
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
