// 寄存器
let register = {};
let expression = '';
let result = '0';
let main = {
    // 上一步是否等号键
    isEqual: false,
    // 点击数字键
    clickNumber(num){
        const _this = this,
            res = document.querySelector('.result-text'),
            isPoint = num === '.';
        // 如果输入小数点并且已经结果中已经有小数点了
        if(result.indexOf('.') !== -1 && isPoint){
            return;
        }
        // 如果结果长度已经达到了9位数了
        if(result.length >= 9){
            return;
        }
        if(result !== '0'){
            result = result + num;
        }else{
            _this.resize();
            result = isPoint ? '0' + num : num;
            if(_this.isEqual){
                expression = '';
                _this.isEqual = false;
            }
        }
        register.number = result;
        res.innerHTML = result;
    },
    // 点击运算符
    clickOperat(ope){
        const _this = this,
            res = document.querySelector('.result-text');
        switch (ope) {
            case '+/-':
                register.number = result = eval(res.innerHTML + '*-1').toString();
                _this.resize();
                res.innerHTML = result;
                _this.isEqual ? result = '0' : '';
                break;
            case '%':
                result = eval(res.innerHTML + '/100');
                _this.resize();
                res.innerHTML = result;
                result = '0';
                break;
            default:
                if(_this.isEqual){
                    // 如果点了等号后又点运算符，则把当前的结果再进行运算
                    expression = res.innerHTML + ope;
                    _this.isEqual = false;
                }else{
                    if(expression === ''){
                        expression = result + ope;
                    }else{
                        result = eval(expression + result);
                        expression = result + ope;
                        res.innerHTML = result;
                    }
                    register.operator = ope;
                    result = '0';
                }
                break;
        }
    },
    // 获取结果
    getResult(){
        const _this = this,
            res = document.querySelector('.result-text');
        _this.isEqual = true;
        result = _this.resultHandle(eval(expression + register.number));
        expression = result + register.operator;
        res.innerHTML = result;
        result = '0';
    },
    // 重置寄存器
    reset(){
        const _this = this,
            res = document.querySelector('.result-text');
        register = {};
        expression = '';
        result = '0';
        res.innerHTML = result;
    },
    // 自适应结果长度
    resize(){
        const _this = this,
            res = document.querySelector('.result-text');
        var num = typeof result === 'number' ? result.toString() : result;
        if(num.length > 9){
            res.classList.add('small');
        }else{
            res.classList.remove('small');
        }
    },
    // 运算结果处理
    resultHandle(num){
        if(typeof num == "number"){
            num = num.toString();
        }
        return num.length > 9 ? new Number(num).toPrecision(5).replace('+','') : num;
    }
}