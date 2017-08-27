const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');

require('./config/menu.js');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 390,
        height: 670,
        fullscreen: false,
        // resizable: false
    });
    win.webContents.openDevTools();
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