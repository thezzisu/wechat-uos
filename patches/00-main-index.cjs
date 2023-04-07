const oldRequire = require
const injectedLog = (...args) => {
  console.log(`INJECT[${process.pid}]`, ...args)
}
require = (mod) => {
  injectedLog('require', mod)
  if (mod !== 'electron') return oldRequire(mod)
  const electron = oldRequire('electron')
  const ipcMainOverrides = {
    on(channel, listener) {
      injectedLog('ipcMain.on', channel)
      return electron.ipcMain.on(channel, listener)
    },
    handle(channel, listener) {
      injectedLog('ipcMain.handle', channel)
      return electron.ipcMain.handle(channel, listener)
    }
  }
  const overrides = {
    BrowserWindow: class extends electron.BrowserWindow {
      constructor(...args) {
        injectedLog('BrowserWindow', JSON.stringify(args))
        super(...args)
      }
    },
    ipcMain: new Proxy(electron.ipcMain, {
      get: (target, prop) => {
        injectedLog('ipcMain', prop)
        return ipcMainOverrides[prop] ?? electron.ipcMain[prop]
      }
    })
  }
  return new Proxy(electron, {
    get: (target, prop) => {
      injectedLog('electron', prop)
      return overrides[prop] ?? electron[prop]
    }
  })
}
