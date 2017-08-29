/*
 * @Author: linxin 
 * @Date: 2017-08-23 11:04:01 
 * @Last Modified time: 2017-08-29 11:04:01 
 */
const { ipcRenderer } = require('electron');
const math = require('mathjs');

math.config({
    number: "BigNumber",
    precision: 32
});

let result = '0';
let max_length = 9;

let main = {
    isEqual: false, // 上一步是否等号键
    isExpress: false, // 上一步是否运算符
    flag: true, // 标识是否重新输入数字
    history: {}, // 用于记录输入的数字和运算符
    register: {}, // 用于记录四则运算优先计算的寄存器
    events: null,
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
            _this.resize();
            result = isPoint ? '0' + num : num;
            if (_this.isEqual) {
                _this.history = {};
                _this.register = {};
                _this.isEqual = false;
            }
            _this.flag = false;
        }
        _this.removeActive();
        res.innerHTML = result;
    },
    // 点击运算符
    clickOperat(ope, event) {
        const _this = this,
            res = document.querySelector('.result-text');
        switch (ope) {
            case '+/-':
                res.innerHTML = result = math.eval(result + '*-1');
                _this.resize();
                _this.isEqual ? _this.flag = true : '';
                break;
            case '%':
                res.innerHTML = result = math.format(math.eval(res.innerHTML + '/100'),16);
                _this.flag = true;
                _this.resize();
                break;
            default:
                _this.flag = true;
                if (!event.classList.contains('active')) {
                    _this.removeActive();
                    event.classList.add('active');

                    if (_this.isEqual) {
                        _this.register = {};
                        // 如果点了等号后又点运算符，则把当前的结果再进行运算
                        _this.history.operator = ope;
                        _this.history.before = _this.checkIsMinus(result);
                        _this.isEqual = false;
                    } else {
                        if (_this.register.number) {
                            res.innerHTML = result = math.eval(_this.register.number + _this.register.ope + result);
                            _this.register = {};
                        }
                        // 四则运算，乘除优先
                        if ((ope == '*' || ope == '/') && (_this.history.operator == '+' || _this.history.operator == '-')) {
                            // 如果上一步是加减法，这时输入乘除，则优先乘除
                            // 把当前数字和运算符存到计算乘除的寄存器 register 中
                            _this.register.number = _this.checkIsMinus(result);
                            _this.register.ope = ope;
                        } else {
                            _this.register = {};
                            // 顺序运算
                            if (!!_this.history.before) {
                                res.innerHTML = result = math.eval(_this.history.before + _this.history.operator + result);
                            }
                            _this.history.before = _this.checkIsMinus(result);
                            _this.history.operator = ope;
                        }
                        _this.flag = true;
                    }
                }
                break;
        }
    },
    // 获取结果
    clickEqual() {
        const _this = this,
            res = document.querySelector('.result-text');

        _this.flag = true;
        _this.removeActive();

        if (_this.isEqual) {
            _this.history.before = _this.checkIsMinus(result);
        } else {
            if (_this.register.number) {

                if (_this.register.ope === '*' || _this.register.ope === '/') {
                    _this.register.after = result;
                    _this.history.after = _this.checkIsMinus(math.eval(_this.register.number + _this.register.ope + result));
                }
            } else {
                _this.history.after = _this.checkIsMinus(result);
            }

        }
        console.log(_this.register.ope);
        // 如果不是加减乘除运算
        if (_this.register.ope && _this.register.ope !== '*' && _this.register.ope !== '/') {
            
            _this.clickSpecial(_this.register.ope, _this.events);
        } else {
            if (_this.history.before && _this.history.operator && _this.history.after) {
                try {

                    result = _this.resultHandle(math.eval(_this.history.before + _this.history.operator + _this.history.after).toString());
                    // result = math.format(math.eval(_this.history.before + _this.history.operator + _this.history.after), 7);

                    if (_this.register.number) {
                        _this.history.operator = _this.register.ope;
                        _this.history.after = _this.register.after;
                        _this.register = {};
                    }
                } catch (error) {
                    result = 'error';
                }

                res.innerHTML = result;
            }
        }
        _this.isEqual = true;
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
        const num = (!!result.toString) ? result.toString() : result;
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

        if (num.length > max_length) {
            if (idx !== -1) {
                return new Number(num).toPrecision(max_length - idx - 1).replace('+', '').substring(0,max_length);
            } else {
                return new Number(num).toPrecision(max_length - 4).replace('+', '').substring(0,max_length);
            }
        } else {
            return num;
        }
    },
    // 横屏时特殊运算
    clickSpecial(type, event) {
        const _this = this,
            res = document.querySelector('.result-text');
        _this.flag = true;
        _this.removeActive();
        switch (type) {
            case '1': // x 的平方
                res.innerHTML = result = math.format(math.pow(result, 2), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;

                break;
            case '2': // x 的立方
                res.innerHTML = result = math.format(math.pow(result, 3), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '3': // x 的 y 次幂
                _this.events = event;
                if (!event.classList.contains('active')) {
                    if (_this.register.ope === '3') {
                        if (_this.isEqual) {
                            _this.register.number = result;
                        } else {
                            _this.register.after = result;
                            _this.isEqual = true;
                        }

                        res.innerHTML = result = math.format(math.pow(_this.register.number, _this.register.after), {
                            precision: 16
                        });

                    } else {
                        _this.removeActive();
                        event.classList.add('active');
                        _this.register.number = result;
                        _this.register.ope = type;
                    }
                }
                break;
            case '4': // 10 的 x 次幂
                res.innerHTML = result = math.format(math.pow(10, result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '5': // 1/x
                res.innerHTML = result = math.format(math.divide(1, result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '6': // x 开平方根
                res.innerHTML = result = math.format(math.sqrt(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '7': // x 开立方根
                res.innerHTML = result = math.format(math.cbrt(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '8': // x 的开 y 次方根
                _this.events = event;
                if (!event.classList.contains('active')) {
                    if (_this.register.ope === '8') {
                        if (_this.isEqual) {
                            _this.register.number = result;
                        } else {
                            _this.register.after = result;
                            _this.isEqual = true;
                        }

                        res.innerHTML = result = math.format(math.nthRoot(_this.register.number, _this.register.after), {
                            precision: 16
                        });

                    } else {
                        _this.removeActive();
                        event.classList.add('active');
                        _this.register.number = result;
                        _this.register.ope = type;
                    }
                }
                break;
            case '9': // sin 正弦
                res.innerHTML = result = math.format(math.sin(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '10': // cos 余弦
                res.innerHTML = result = math.format(math.cos(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '11': // tan 正切
                res.innerHTML = result = math.format(math.tan(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '12': // 算术常量 e
                res.innerHTML = result = Math.E;
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '13': // sinh 双曲正弦
                res.innerHTML = result = math.format(math.sinh(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '14': // cosh 双曲余弦
                res.innerHTML = result = math.format(math.cosh(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '15': // tanh 双曲正切
                res.innerHTML = result = math.format(math.tanh(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '16': // 圆周率
                res.innerHTML = result = Math.PI;
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '17': // x 的阶乘
                if (result.indexOf('.') > -1 || result.indexOf('-') > -1) {
                    _this.reset();
                    res.innerHTML = 'error';
                } else {
                    res.innerHTML = result = math.factorial(result);
                    _this.register.ope = type;
                    _this.isEqual = true;
                }
                break;
            case '18': // 底数为 e 的对数
                res.innerHTML = result = math.format(math.log(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '19': // 底数为 10 的对数
                res.innerHTML = result = math.format(math.log10(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            case '20': // e 的指数
                res.innerHTML = result = math.format(math.exp(result), {
                    precision: 16
                });
                _this.register.ope = type;
                _this.isEqual = true;
                break;
            default:
                break;
        }
    },

    /**
     * 检测数字为负数则加上括号后返回去计算
     * @param {*} num 
     */
    checkIsMinus(num) {
        return num.toString().indexOf('-') > -1 ? '(' + num + ')' : num;
    },
    /**
     * 移除 active 类
     */
    removeActive() {
        const _act = document.querySelector('.active');
        _act && _act.classList.remove('active');
    }
}

// 监听菜单选择横屏或竖屏
ipcRenderer.on('change_event', (event, arg) => {
    const box = document.querySelector('.wrapper');
    if (arg === 'horizontal') {
        box.classList.add('horizontal');
        max_length = 16;
    } else {
        box.classList.remove('horizontal');
        max_length = 9;
    }
    main.reset();
})