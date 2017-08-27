const {
    ipcRenderer
} = require('electron');
const math = require('mathjs');

math.config({
    number: "BigNumber",
    precision: 32
});

let expression = '';
let result = '0';
let max_length = 9;

let main = {
    isEqual: false, // 上一步是否等号键
    isExpress: false, // 上一步是否运算符
    flag: true, // 标识是否重新输入数字
    history: {}, // 用于记录输入的数字和运算符
    register: {},// 用于记录四则运算优先计算的寄存器
    // 点击数字键
    clickNumber(num) {
        const _this = this,
            res = document.querySelector('.result-text'),
            isPoint = num === '.';

        if (!_this.flag) {
            // 数字转为字符串
            result = result.toString();
            
            // 如果输入小数点并且已经结果中已经有小数点了
            if (result.indexOf('.') !== -1 && isPoint) {
                return;
            }

            // 限制长度
            if (result.length >= max_length) {
                return;
            }

            result = result + num;
        } else {
            // _this.resize();
            result = isPoint ? '0' + num : num;
            if (_this.isEqual) {
                _this.history = {};
                _this.isEqual = false;
            }
            _this.flag = false;
        }
        res.innerHTML = result;
    },
    // 点击运算符
    clickOperat(ope) {
        const _this = this,
            res = document.querySelector('.result-text');
        switch (ope) {
            case '+/-':
                res.innerHTML = result = math.eval(result + '*-1');
                // _this.resize();
                res.innerHTML = result;
                _this.isEqual ? _this.flag = true : '';
                break;
            case '%':
                res.innerHTML = result = math.eval(res.innerHTML + '/100');
                _this.flag = true;
                // _this.resize();
                break;
            default:
                _this.flag = true;
                if (_this.isEqual) {
                    // 如果点了等号后又点运算符，则把当前的结果再进行运算
                    _this.history.operator = ope;
                    _this.history.before = _this.checkIsMinus(result);
                    _this.isEqual = false;
                } else {
                    if(_this.register.number){
                        res.innerHTML = result =  math.eval(_this.register.number + _this.register.ope + result);
                        _this.register = {};
                    }
                    // 四则运算，乘除优先
                    if((ope == '*' || ope == '/') && (_this.history.operator == '+' || _this.history.operator == '-')){
                        // 如果上一步是加减法，这时输入乘除，则优先乘除
                        // 把当前数字和运算符存到计算乘除的寄存器 register 中
                        _this.register.number = _this.checkIsMinus(result);
                        _this.register.ope = ope;
                    }else{
                        // 顺序运算
                        if(!!_this.history.before){
                            res.innerHTML = result = math.eval(_this.history.before + _this.history.operator + result);
                        }
                        _this.history.before = _this.checkIsMinus(result);
                        _this.history.operator = ope;
                    }
                    _this.flag = true;
                }
                break;
        }
    },
    // 获取结果
    clickEqual() {
        const _this = this,
            res = document.querySelector('.result-text');

        _this.flag = true;

        if(_this.isEqual){
            _this.history.before = _this.checkIsMinus(result);
        }else{
            if(_this.register.number){
                _this.register.after = result;
                _this.history.after =  _this.checkIsMinus(math.eval(_this.register.number + _this.register.ope + result));
            }else{
                _this.history.after = _this.checkIsMinus(result);
            }
            _this.isEqual = true;
        }
        // switch (register.operator) {
        //     case 'pow':
        //         result = Math.pow(expression, register.number);
        //         break;

        //     default:
                try {
                    result = _this.resultHandle(math.eval(_this.history.before + _this.history.operator + _this.history.after).toString());
                    
                    if(_this.register.number){
                        _this.history.operator = _this.register.ope;
                        _this.history.after = _this.register.after;
                        _this.register = {};
                    }
                } catch (error) {
                    result = 'error';
                }
        //         break;
        // }
        res.innerHTML = result;
    },
    // 重置寄存器
    reset() {
        const _this = this,
            res = document.querySelector('.result-text');
        _this.flag = true;
        _this.history = {};
        _this.register = {};
        _this.isEqual = false;
        res.innerHTML = result = '0';
        
    },
    // 自适应结果长度
    resize() {
        const _this = this,
            res = document.querySelector('.result-text');
        const num = typeof result === 'number' ? result.toString() : result;
        if (num.length > max_length) {
            res.classList.add('small');
        } else {
            res.classList.remove('small');
        }
    },
    // 运算结果处理
    resultHandle(num) {
        if (typeof num == "number") {
            num = num.toString();
        }
        const idx = num.indexOf('.');
        
        if(num.length > max_length){
            if(idx !== -1){
                console.log(max_length - idx - 1);
                return new Number(num).toPrecision(max_length - idx - 1).replace('+', '');
            }else{
                return new Number(num).toPrecision(max_length - 4).replace('+', '');
            }
        }else{
            return num;
        }
    },
    clickSpecial(type) {
        const _this = this,
            res = document.querySelector('.result-text');
        console.log(type);
        switch (type) {
            case '1': // x 的平方
                console.log(1111);
                res.innerHTML = result = math.pow(result, 2);
                break;
            case '2': // x 的立方
                res.innerHTML = result = Math.pow(result, 3);
                break;
            case '3': // x 的 y 次幂
                register.operator = 'pow';
                expression = result;

                break;
            default:
                break;
        }
        result = '0';
    },

    /**
     * 检测数字为负数则加上括号后返回去计算
     * @param {*} num 
     */
    checkIsMinus(num){
        return num.toString().indexOf('-') > -1 ? '('+num+')' : num;
    }
}

// 监听菜单选择横屏或竖屏
ipcRenderer.on('change_event', (event, arg) => {
    const box = document.querySelector('.wrapper');
    if (arg === 'horizontal') {
        box.classList.add('horizontal');
        max_length = 20;
    } else {
        box.classList.remove('horizontal');
        max_length = 9;
    }
    main.reset();
})