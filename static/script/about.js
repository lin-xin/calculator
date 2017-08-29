/*
 * @Author: linxin 
 * @Date: 2017-08-29 11:02:40 
 * @Last Modified time: 2017-08-29 11:02:40 
 */
const { shell, remote } = require('electron');

const main = {
    init(){
        main.getAppVersion();
        main.eventHandle();
    },
    eventHandle(){
        document.querySelector('.author').onclick = (e) => {
            shell.openExternal('http://blog.gdfengshuo.com');
        };
        document.querySelector('.code').onclick = (e) => {
            shell.openExternal('https://github.com/lin-xin/calculator');
        }
    },
    getAppVersion(){
        document.querySelector('.version').innerHTML = remote.getGlobal('version');
    }
}
main.init();