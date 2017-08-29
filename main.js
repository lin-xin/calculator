/*
 * @Author: linxin 
 * @Date: 2017-08-23 11:03:44 
 * @Last Modified time: 2017-08-29 11:03:44 
 */
const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');

require('./config/menu.js');

let win;
global['version'] = app.getVersion();

function createWindow() {
    win = new BrowserWindow({
        width: 390,
        height: 672,
        fullscreen: false,
        resizable: false
    });
    // win.webContents.openDevTools();
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
})