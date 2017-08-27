const { Menu, dialog, BrowserWindow, shell} = require('electron');
const template = [
    {
        label: '查看',
        submenu: [
            {
                label: '竖屏',
                type: 'radio', 
                checked: true,
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.setSize(390,670);
                    win.webContents.send('change_event','vertical');
                }
            },
            {
                label: '横屏', 
                type: 'radio', 
                checked: false,
                click: () => {
                    const win = BrowserWindow.fromId(1);
                    win.setSize(670,455);
                    win.webContents.send('change_event','horizontal');
                }
            },
            {label: '重载',role:'reload'},
            {label: '退出',role:'quit'},
        ]
    },
    {
        label: '编辑',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: '帮助',
        submenu: [
            {label: '常见问题'},
            {
                label: '项目地址',
                click: () => {
                    shell.openExternal('https://github.com/lin-xin/calculator');
                }
            },
            {type: 'separator'},
            {
                label: '关于作者',
                click: () => {
                    shell.openExternal('http://blog.gdfengshuo.com/about/');
                }
            },
            {label: '关于计算器'}
        ]
    }
]
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);