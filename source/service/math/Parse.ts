import KogidaTree from './Tree'
export default class Parse {

    constructor() {
    }

    public static checkHaveVariable = function (data) {
        let left;
        let Tree = new KogidaTree(data);
        return (left = Tree.findOutVariables().length > 0) != null ? left : { true: false };
    };

    public static checkHaveVariableWithName = function (data, varName) {
        let Tree = new KogidaTree(data);
        return Tree.findOutVariables().map(x => x.value).indexOf(varName) !== -1;
    };

    public static checkIsLinear = function (data) {
        switch (data.operation) {

            case 'Number':
                return true;
                
            case 'Variable':
                return true;
                
            case 'Eq':
                return this.checkIsLinear(data.children[0]) && this.checkIsLinear(data.children[1]);
                
            case 'AddExp':
                return this.checkIsLinear(data.children[0]) && this.checkIsLinear(data.children[1]);
                
            case 'SubExp':
                return this.checkIsLinear(data.children[0]) && this.checkIsLinear(data.children[1]);
                
            case 'MulExp':
                if (this.checkHaveVariable(data.children[0]) && this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsLinear(data.children[0]) && this.checkIsLinear(data.children[1]);
                }
                
            case 'HiddenMulExp':
                if (this.checkHaveVariable(data.children[0]) && this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsLinear(data.children[0]) && this.checkIsLinear(data.children[1]);
                }
                
            case 'DivExp':
                if (this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsLinear(data.children[0]);
                }
                
            case 'RootExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'SqrtExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'PowerExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'BracketExp':
                return this.checkIsLinear(data.children[0]);
                
            case 'FracExp':
                if (this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsLinear(data.children[0]);
                }
                
            case 'LnExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'LogExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'LogDecExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'SinExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'CosExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'TanExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'CotExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'PI':
                return true;
                
            default:
                return true;
        }
    };

    public static checkIsPoly = function (data) {
        switch (data.operation) {

            case 'Number':
                return true;
                
            case 'Variable':
                return true;
                

            case 'Eq':
                return this.checkIsPoly(data.children[0]) && this.checkIsPoly(data.children[1]);
                

            case 'AddExp':
                return this.checkIsPoly(data.children[0]) && this.checkIsPoly(data.children[1]);
                

            case 'SubExp':
                return this.checkIsPoly(data.children[0]) && this.checkIsPoly(data.children[1]);
                

            case 'MulExp':
                if (this.checkHaveVariable(data.children[0]) && this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsPoly(data.children[0]) && this.checkIsPoly(data.children[1]);
                }
                

            case 'HiddenMulExp':
                if (this.checkHaveVariable(data.children[0]) && this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsPoly(data.children[0]) && this.checkIsPoly(data.children[1]);
                }
                

            case 'DivExp':
                if (this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsPoly(data.children[0]);
                }
                

            case 'RootExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'SqrtExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }

            case 'BracketExp':
                return this.checkIsPoly(data.children[0]);
                
            case 'FracExp':
                if (this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return this.checkIsPoly(data.children[0]);
                }
                
            case 'LnExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'LogExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'LogDecExp':
                if (this.checkHaveVariable(data.children[0]) || this.checkHaveVariable(data.children[1])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'SinExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'CosExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                

            case 'TanExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'CotExp':
                if (this.checkHaveVariable(data.children[0])) {
                    return false;
                } else {
                    return true;
                }
                
            case 'PI':
                return true;
                
            default:
                return true;
        }
    };

    public static parseToSymPyDegree = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",",".").replace("empty","");
                
            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")            
            
                case 'AbsExp':
                return `Abs(${this.parseToSymPyDegree(data.children[0])})`
                
            case 'Eq':
                return this.parseToSymPyDegree(data.children[0]) + '-' + this.parseToSymPyDegree(data.children[1]);
                
            case 'AddExp':
                return `${this.parseToSymPyDegree(data.children[0])}+${this.parseToSymPyDegree(data.children[1])}`;
                
            case 'SubExp':
                return `${this.parseToSymPyDegree(data.children[0])}-${this.parseToSymPyDegree(data.children[1])}`;
                
            case 'MulExp':
                return `${this.parseToSymPyDegree(data.children[0])}*${this.parseToSymPyDegree(data.children[1])}`;
                
            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value === "empty")
                    return this.parseToSymPyDegree(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.parseToSymPyDegree(data.children[0])
                else
                    return `${this.parseToSymPyDegree(data.children[0])}*${this.parseToSymPyDegree(data.children[1])}`;
     
            case 'DivExp':
                return `(${this.parseToSymPyDegree(data.children[0])})/(${this.parseToSymPyDegree(data.children[1])})`;
                
            case 'RootExp':
                return `${this.parseToSymPyDegree(data.children[0])})**(1/${this.parseToSymPyDegree(data.children[1])}`;
                
            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyDegree(data.children[0])}))`;
                
            case 'PowerExp':
                return `expand((${this.parseToSymPyDegree(data.children[0])})**(${this.parseToSymPyDegree(data.children[1])}))`;
                
            case 'BracketExp':
                return `(${this.parseToSymPyDegree(data.children[0])})`;
                
            case 'FracExp':
                return `(${this.parseToSymPyDegree(data.children[0])})/(${this.parseToSymPyDegree(data.children[1])})`;
                
            case 'LnExp':
                return `ln(${this.parseToSymPyDegree(data.children[0])}).evalf()`;
                
            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[1])}))`;
                
            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[1])}))`;
                
            case 'SinExp':
                return `sin(pi/180*(${this.parseToSymPyDegree(data.children[0])}))`;
                
            case 'CosExp':
                return `cos(pi/180*(${this.parseToSymPyDegree(data.children[0])}))`;
                
            case 'TanExp':
                return `tan(pi/180*(${this.parseToSymPyDegree(data.children[0])}))`;
                
            case 'CotExp':
                return `cot(pi/180*(${this.parseToSymPyDegree(data.children[0])}))`;
            
            case 'SumExp':
                return `Sum(${this.parseToSymPyDegree(data.children[0])},(${this.parseToSymPyDegree(data.children[3])},${this.parseToSymPyDegree(data.children[1])},${this.parseToSymPyDegree(data.children[2])})).doit()`
            
            case 'ProdExp':
                return `Product(${this.parseToSymPyDegree(data.children[0])},(${this.parseToSymPyDegree(data.children[3])},${this.parseToSymPyDegree(data.children[1])},${this.parseToSymPyDegree(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyDegree(data.children[0])},(${this.parseToSymPyDegree(data.children[3])},${this.parseToSymPyDegree(data.children[1])},${this.parseToSymPyDegree(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[1])}).doit()`

            case 'DeriExp':
                if(data.children.length == 1)
                    return `diff(${this.parseToSymPyDegree(data.children[0])},x)`
                else    
                    return `diff(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[1])})`

            case 'DeriLevelExp':
                if(data.children.length == 3)
                    return `diff(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[2])},${this.parseToSymPyDegree(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyDegree(data.children[0])},x,${this.parseToSymPyDegree(data.children[1])})`


            case 'LimitExp':
                if(data.children.length == 3)
                    return `limit(${this.parseToSymPyDegree(data.children[0])},${this.parseToSymPyDegree(data.children[1])},${this.parseToSymPyDegree(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyDegree(data.children[0])},n,oo)`
            
                    case 'PI':
                return 'pi';
                
            case 'LtEq':
                return this.parseToSymPyDegree(data.children[0]) + '<' + this.parseToSymPyDegree(data.children[1]);
            
            case 'LeqEq':
                return this.parseToSymPyDegree(data.children[0]) + '<=' + this.parseToSymPyDegree(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyDegree(data.children[0]) + '>=' + this.parseToSymPyDegree(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyDegree(data.children[0]) + '>' + this.parseToSymPyDegree(data.children[1]);

            case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
                
            default:
                return "";
        }
    };

    public static parseToSymPyRad = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");

            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")
            
            case 'AbsExp':
                return `Abs(${this.parseToSymPyRad(data.children[0])})`

            case 'Eq':
                return this.parseToSymPyRad(data.children[0]) + '-' + this.parseToSymPyRad(data.children[1]);

            case 'AddExp':
                return `${this.parseToSymPyRad(data.children[0])}+${this.parseToSymPyRad(data.children[1])}`;

            case 'SubExp':
                return `${this.parseToSymPyRad(data.children[0])}-${this.parseToSymPyRad(data.children[1])}`;

            case 'MulExp':
                return `${this.parseToSymPyRad(data.children[0])}*${this.parseToSymPyRad(data.children[1])}`;

            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value ==="empty")
                    return this.parseToSymPyRad(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.parseToSymPyRad(data.children[0])
                else
                    return `${this.parseToSymPyRad(data.children[0])}*${this.parseToSymPyRad(data.children[1])}`;

            case 'DivExp':
                return `(${this.parseToSymPyRad(data.children[0])})/(${this.parseToSymPyRad(data.children[1])})`;

            case 'RootExp':
                return `${this.parseToSymPyRad(data.children[0])}**(1/${this.parseToSymPyRad(data.children[1])})`;

            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyRad(data.children[0])}))`;

            case 'PowerExp':
                return `expand((${this.parseToSymPyRad(data.children[0])})**(${this.parseToSymPyRad(data.children[1])}))`;

            case 'BracketExp':
                return `(${this.parseToSymPyRad(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToSymPyRad(data.children[0])})/(${this.parseToSymPyRad(data.children[1])})`;

            case 'LnExp':
                return `ln(${this.parseToSymPyRad(data.children[0])}).evalf()`;

            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}))`;

            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}))`;

            case 'SinExp':
                return `sin(${this.parseToSymPyRad(data.children[0])})`;

            case 'CosExp':
                return `cos(${this.parseToSymPyRad(data.children[0])})`;

            case 'TanExp':
                return `tan(${this.parseToSymPyRad(data.children[0])})`;

            case 'CotExp':
                return `cot(${this.parseToSymPyRad(data.children[0])})`;

            case 'SumExp':
                return `Sum(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})).doit()`

            case 'ProdExp':
                return `Product(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}).doit()`

            case 'DeriExp':
                if (data.children.length == 1)
                    return `diff(${this.parseToSymPyRad(data.children[0])},x)`
                else
                    return `diff(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])})`

            case 'DeriLevelExp':
                if (data.children.length == 3)
                    return `diff(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[2])},${this.parseToSymPyRad(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyRad(data.children[0])},x,${this.parseToSymPyRad(data.children[1])})`

            case 'LimitExp':
                if (data.children.length == 3)
                    return `limit(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyRad(data.children[0])},n,oo)`

            case 'LtEq':
                return this.parseToSymPyRad(data.children[0]) + '<' + this.parseToSymPyRad(data.children[1]);

            case 'LeqEq':
                return this.parseToSymPyRad(data.children[0]) + '<=' + this.parseToSymPyRad(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyRad(data.children[0]) + '>=' + this.parseToSymPyRad(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyRad(data.children[0]) + '>' + this.parseToSymPyRad(data.children[1]);
           
            case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
           
            default:
                return "";
        }
    };

    public static parseToSymPyDegreeEq = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");
                
            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")
            
            case 'AbsExp':
                return `Abs(${this.parseToSymPyDegreeEq(data.children[0])})`    
            
            case 'Eq':
                return `Eq(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])})`;
                
            case 'AddExp':
                return `${this.parseToSymPyDegreeEq(data.children[0])}+${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'SubExp':
                return `${this.parseToSymPyDegreeEq(data.children[0])}-${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'MulExp':
                return `${this.parseToSymPyDegreeEq(data.children[0])}*${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value === "empty")
                    return this.parseToSymPyDegreeEq(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.parseToSymPyDegreeEq(data.children[0])
                else
                    return `${this.parseToSymPyDegreeEq(data.children[0])}*${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'DivExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})/(${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'RootExp':
                return `${this.parseToSymPyDegreeEq(data.children[0])})**(1/${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'PowerExp':
                return `expand((${this.parseToSymPyDegreeEq(data.children[0])})**(${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'BracketExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})/(${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'LnExp':
                return `ln(${this.parseToSymPyDegreeEq(data.children[0])}).evalf()`;

            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'SinExp':
                return `sin(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'CosExp':
                return `cos(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'TanExp':
                return `tan(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'CotExp':
                return `cot(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'SumExp':
                return `Sum(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})).doit()`

            case 'ProdExp':
                return `Product(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}).doit()`

            case 'DeriExp':
                if (data.children.length == 1)
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},x)`
                else
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])})`

            case 'DeriLevelExp':
                if (data.children.length == 3)
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[2])},${this.parseToSymPyDegreeEq(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},x,${this.parseToSymPyDegreeEq(data.children[1])})`

            case 'LimitExp':
                if (data.children.length == 3)
                    return `limit(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyDegreeEq(data.children[0])},n,oo)`

            case 'LtEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '<' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'LeqEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '<=' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '>=' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '>' + this.parseToSymPyDegreeEq(data.children[1]);
            
            case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
            default:
                return "";
        }
    };

    public static parseToSymPyRadEq = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");

            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")

            case 'AbsExp':
                return `Abs(${this.parseToSymPyRadEq(data.children[0])})`

            case 'Eq':
                return `Eq(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])})`;

            case 'AddExp':
                return `${this.parseToSymPyRadEq(data.children[0])}+${this.parseToSymPyRadEq(data.children[1])}`;

            case 'SubExp':
                return `${this.parseToSymPyRadEq(data.children[0])}-${this.parseToSymPyRadEq(data.children[1])}`;

            case 'MulExp':
                return `${this.parseToSymPyRadEq(data.children[0])}*${this.parseToSymPyRadEq(data.children[1])}`;

            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value === "empty")
                    return this.parseToSymPyRadEq(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.parseToSymPyRadEq(data.children[0])
                else
                    return `${this.parseToSymPyRadEq(data.children[0])}*${this.parseToSymPyRadEq(data.children[1])}`;


            case 'DivExp':
                return `(${this.parseToSymPyRadEq(data.children[0])})/(${this.parseToSymPyRadEq(data.children[1])})`;

            case 'RootExp':
                return `${this.parseToSymPyRadEq(data.children[0])}**(1/${this.parseToSymPyRadEq(data.children[1])})`;

            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyRadEq(data.children[0])}))`;

            case 'PowerExp':
                return `expand((${this.parseToSymPyRadEq(data.children[0])})**(${this.parseToSymPyRadEq(data.children[1])}))`;

            case 'BracketExp':
                return `(${this.parseToSymPyRadEq(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToSymPyRadEq(data.children[0])})/(${this.parseToSymPyRadEq(data.children[1])})`;

            case 'LnExp':
                return `ln(${this.parseToSymPyRadEq(data.children[0])}).evalf()`;

            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])}))`;

            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])}))`;

            case 'SinExp':
                return `sin(${this.parseToSymPyRadEq(data.children[0])})`;

            case 'CosExp':
                return `cos(${this.parseToSymPyRadEq(data.children[0])})`;

            case 'TanExp':
                return `tan(${this.parseToSymPyRadEq(data.children[0])})`;

            case 'CotExp':
                return `cot(${this.parseToSymPyRadEq(data.children[0])})`;

            case 'SumExp':
                return `Sum(${this.parseToSymPyRadEq(data.children[0])},(${this.parseToSymPyRadEq(data.children[3])},${this.parseToSymPyRadEq(data.children[1])},${this.parseToSymPyRadEq(data.children[2])})).doit()`

            case 'ProdExp':
                return `Product(${this.parseToSymPyRadEq(data.children[0])},(${this.parseToSymPyRadEq(data.children[3])},${this.parseToSymPyRadEq(data.children[1])},${this.parseToSymPyRadEq(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyRadEq(data.children[0])},(${this.parseToSymPyRadEq(data.children[3])},${this.parseToSymPyRadEq(data.children[1])},${this.parseToSymPyRadEq(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])}).doit()`

            case 'DeriExp':
                if (data.children.length == 1)
                    return `diff(${this.parseToSymPyRadEq(data.children[0])},x)`
                else
                    return `diff(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])})`

            case 'DeriLevelExp':
                if (data.children.length == 3)
                    return `diff(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[2])},${this.parseToSymPyRadEq(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyRadEq(data.children[0])},x,${this.parseToSymPyRadEq(data.children[1])})`

            case 'LimitExp':
                if (data.children.length == 3)
                    return `limit(${this.parseToSymPyRadEq(data.children[0])},${this.parseToSymPyRadEq(data.children[1])},${this.parseToSymPyRadEq(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyRadEq(data.children[0])},n,oo)`

            case 'LtEq':
                return this.parseToSymPyRadEq(data.children[0]) + '<' + this.parseToSymPyRadEq(data.children[1]);

            case 'LeqEq':
                return this.parseToSymPyRadEq(data.children[0]) + '<=' + this.parseToSymPyRadEq(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyRadEq(data.children[0]) + '>=' + this.parseToSymPyRadEq(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyRadEq(data.children[0]) + '>' + this.parseToSymPyRadEq(data.children[1]);
            
            case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
            default:
                return "0";
        }
    };
  
    public static parseToSymPyForSolutionRad = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");
            
            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")

            case 'Eq':
                return this.parseToSymPyRad(data.children[0]) + '=' + this.parseToSymPyRad(data.children[1]);

            case 'AddExp':
                return `(${this.parseToSymPyRad(data.children[0])}+${this.parseToSymPyRad(data.children[1])})`;

            case 'SubExp':
                return `(${this.parseToSymPyRad(data.children[0])}-${this.parseToSymPyRad(data.children[1])})`;

            case 'MulExp':
                return `(${this.parseToSymPyRad(data.children[0])}*${this.parseToSymPyRad(data.children[1])})`;

            case 'HiddenMulExp':
                return `(${this.parseToSymPyRad(data.children[0])}*${this.parseToSymPyRad(data.children[1])})`;

            case 'DivExp':
                return `(${this.parseToSymPyRad(data.children[0])})/(${this.parseToSymPyRad(data.children[1])})`;

            case 'RootExp':
                return `(${this.parseToSymPyRad(data.children[0])})**(1/${this.parseToSymPyRad(data.children[1])})`;

            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyRad(data.children[0])}))`;

            case 'PowerExp':
                return `expand((${this.parseToSymPyRad(data.children[0])})**(${this.parseToSymPyRad(data.children[1])}))`;

            case 'BracketExp':
                return `(${this.parseToSymPyRad(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToSymPyRad(data.children[0])})/(${this.parseToSymPyRad(data.children[1])})`;

            case 'LnExp':
                return `(ln(${this.parseToSymPyRad(data.children[0])}).evalf())`;

            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}))`;

            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}))`;

            case 'SinExp':
                return `sin(${this.parseToSymPyRad(data.children[0])})`;

            case 'CosExp':
                return `cos(${this.parseToSymPyRad(data.children[0])})`;

            case 'TanExp':
                return `tan(${this.parseToSymPyRad(data.children[0])})`;

            case 'CotExp':
                return `cot(${this.parseToSymPyRad(data.children[0])})`;

            case 'SumExp':
                return `Sum(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})).doit()`

            case 'ProdExp':
                return `Product(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyRad(data.children[0])},(${this.parseToSymPyRad(data.children[3])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])}).doit()`

            case 'DeriExp':
                if (data.children.length == 1)
                    return `diff(${this.parseToSymPyRad(data.children[0])},x)`
                else
                    return `diff(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])})`

            case 'DeriLevelExp':
                if (data.children.length == 3)
                    return `diff(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[2])},${this.parseToSymPyRad(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyRad(data.children[0])},x,${this.parseToSymPyRad(data.children[1])})`

            case 'LimitExp':
                if (data.children.length == 3)
                    return `limit(${this.parseToSymPyRad(data.children[0])},${this.parseToSymPyRad(data.children[1])},${this.parseToSymPyRad(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyRad(data.children[0])},n,oo)`

            case 'LtEq':
                return this.parseToSymPyRad(data.children[0]) + '<' + this.parseToSymPyRad(data.children[1]);

            case 'LeqEq':
                return this.parseToSymPyRad(data.children[0]) + '<=' + this.parseToSymPyRad(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyRad(data.children[0]) + '>=' + this.parseToSymPyRad(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyRad(data.children[0]) + '>' + this.parseToSymPyRad(data.children[1]);
            
            case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
            
            default:
                return "0";
        }
    };

    public static parseToSymPyForSolutionDegree = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");
            
            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")

            case 'Eq':
                return `${this.parseToSymPyDegreeEq(data.children[0])} = ${this.parseToSymPyDegreeEq(data.children[1])}`;

            case 'AddExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])}+${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'SubExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])}-${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'MulExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])}*${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'HiddenMulExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])}*${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'DivExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])}/${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'RootExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})**(1/${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'SqrtExp':
                return `nsimplify(sqrt(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'PowerExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})**(${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'BracketExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToSymPyDegreeEq(data.children[0])})/(${this.parseToSymPyDegreeEq(data.children[1])})`;

            case 'LnExp':
                return `(ln(${this.parseToSymPyDegreeEq(data.children[0])}).evalf())`;

            case 'LogExp':
                return `nsimplify(log(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'LogDecExp':
                return `nsimplify(log(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}))`;

            case 'SinExp':
                return `sin(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])}))`;

            case 'CosExp':
                return `cos(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])})`;

            case 'TanExp':
                return `tan(pi/180*(${this.parseToSymPyDegreeEq(data.children[0])})`;

            case 'CotExp':
                return `cot(pi/180*${this.parseToSymPyDegreeEq(data.children[0])})`;

            case 'SumExp':
                return `Sum(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})).doit()`

            case 'ProdExp':
                return `Product(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})).doit()`

            case 'IntegralExp':
                return `integrate(${this.parseToSymPyDegreeEq(data.children[0])},(${this.parseToSymPyDegreeEq(data.children[3])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])}))`

            case 'InfIntegralExp':
                return `Integral(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])}).doit()`

            case 'DeriExp':
                if (data.children.length == 1)
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},x)`
                else
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])})`

            case 'DeriLevelExp':
                if (data.children.length == 3)
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[2])},${this.parseToSymPyDegreeEq(data.children[1])})`
                else
                    return `diff(${this.parseToSymPyDegreeEq(data.children[0])},x,${this.parseToSymPyDegreeEq(data.children[1])})`

            case 'LimitExp':
                if (data.children.length == 3)
                    return `limit(${this.parseToSymPyDegreeEq(data.children[0])},${this.parseToSymPyDegreeEq(data.children[1])},${this.parseToSymPyDegreeEq(data.children[2])})`
                else
                    return `limit(${this.parseToSymPyDegreeEq(data.children[0])},n,oo)`

            case 'LtEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '<' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'LeqEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '<=' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'GeqEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '>=' + this.parseToSymPyDegreeEq(data.children[1]);

            case 'GtEq':
                return this.parseToSymPyDegreeEq(data.children[0]) + '>' + this.parseToSymPyDegreeEq(data.children[1]);
            
                case 'ExponentExp':
                return `exp(${this.parseToSymPyDegreeEq(data.children[0])})`
            default:
                return "0";
        }
    };

    public static getFactor = function (tree, varName) {
        switch (tree.operation) {
            case 'Number':
                return '0';
            case 'Variable':
                if (tree.value === varName) {
                    return '1';
                } else {
                    return '0';
                }
            case 'Eq':
                if (this.checkHaveVariableWithName(tree.children[0], varName) && this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)}-${this.getFactor(tree.children[1], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[1], varName)) {
                    return `-(${this.getFactor(tree.children[1], varName)})`;
                } else {
                    return '0';
                }
            case 'AddExp':
                if (this.checkHaveVariableWithName(tree.children[0], varName) && this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)}+${this.getFactor(tree.children[1], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[1], varName)) {
                    return `(${this.getFactor(tree.children[1], varName)})`;
                } else {
                    return '0';
                }
            case 'SubExp':
                if (this.checkHaveVariableWithName(tree.children[0], varName) && this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)}-${this.getFactor(tree.children[1], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})`;
                } else if (this.checkHaveVariableWithName(tree.children[1], varName)) {
                    return `(-${this.getFactor(tree.children[1], varName)})`;
                } else {
                    return '0';
                }
            case 'MulExp':
                if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})*(${this.parseToSymPyDegree(tree.children[1])})`;
                } else if (this.checkHaveVariableWithName(tree.children[1], varName)) {
                    return `(${this.getFactor(tree.children[1], varName)})*(${this.parseToSymPyDegree(tree.children[0])})`;
                } else {
                    return '0';
                }
            case 'HiddenMulExp':
                if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})*(${this.parseToSymPyDegree(tree.children[1])})`;
                } else if (this.checkHaveVariableWithName(tree.children[1], varName)) {
                    return `(${this.getFactor(tree.children[1], varName)})*(${this.parseToSymPyDegree(tree.children[0])})`;
                } else {
                    return '0';
                }
            case 'DivExp':
                if (this.checkHaveVariableWithName(tree.children[0], varName)) {
                    return `(${this.getFactor(tree.children[0], varName)})/(${this.parseToSymPyDegree(tree.children[1])})`;
                } else {
                    return '0';
                }
            default:
                return '0';
        }
    };
    
    public static parseToLatexExpr = function (data) {
        switch (data.operation) {
            case 'Number':
                return data.value.replace(",", ".").replace("empty", "");

            case 'Variable':
                return data.value.trim().replace("image", "I").replace("\\", "").replace("euler", "exp(1)")

            case 'AbsExp':
                return `abs(${this.parseToLatexExpr(data.children[0])})`

            case 'Eq':
                return `${this.parseToLatexExpr(data.children[0])}=${this.parseToLatexExpr(data.children[1])}`;

            case 'AddExp':
                return `${this.parseToLatexExpr(data.children[0])}+${this.parseToLatexExpr(data.children[1])}`;

            case 'SubExp':
                return `${this.parseToLatexExpr(data.children[0])}-${this.parseToLatexExpr(data.children[1])}`;

            case 'MulExp':
                return `${this.parseToLatexExpr(data.children[0])}*${this.parseToLatexExpr(data.children[1])}`;

            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value === "empty")
                    return this.parseToLatexExpr(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.parseToLatexExpr(data.children[0])
                else
                    return `${this.parseToLatexExpr(data.children[0])}*${this.parseToLatexExpr(data.children[1])}`;

            case 'DivExp':
                return `(${this.parseToLatexExpr(data.children[0])})/(${this.parseToLatexExpr(data.children[1])})`;

            case 'RootExp':
                return `${this.parseToLatexExpr(data.children[0])}^(1/${this.parseToLatexExpr(data.children[1])})`;

            case 'SqrtExp':
                return `sqrt(${this.parseToLatexExpr(data.children[0])})`;

            case 'PowerExp':
                return `(${this.parseToLatexExpr(data.children[0])}^${this.parseToLatexExpr(data.children[1])})`;

            case 'BracketExp':
                return `(${this.parseToLatexExpr(data.children[0])})`;

            case 'FracExp':
                return `(${this.parseToLatexExpr(data.children[0])})/(${this.parseToLatexExpr(data.children[1])})`;

            case 'LnExp':
                return `ln(${this.parseToLatexExpr(data.children[0])})`;

            case 'LogExp':
                return `ln(${this.parseToLatexExpr(data.children[0])})/ln(${this.parseToLatexExpr(data.children[1])})`;

            case 'LogDecExp':
                return `ln(${this.parseToLatexExpr(data.children[0])})/ln(${this.parseToLatexExpr(data.children[1])})`;

            case 'SinExp':
                return `sin(deg(${this.parseToLatexExpr(data.children[0])}))`;

            case 'CosExp':
                return `cos(deg(${this.parseToLatexExpr(data.children[0])}))`;

            case 'TanExp':
                return `tan(deg(${this.parseToLatexExpr(data.children[0])}))`;

            case 'CotExp':
                return `cot(deg(${this.parseToLatexExpr(data.children[0])}))`;

            
            default:
                return "nosupport";
        }
    };

    public static getConditions = function (data) {
        switch (data.operation) {
            case 'Number':
                return "";

            case 'Variable':
                return ""

            case 'AbsExp':
                return `${this.getConditions(data.children[0])}`

            case 'Eq':
                return this.getConditions(data.children[0])+this.getConditions(data.children[1])

            case 'AddExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'SubExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'MulExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'HiddenMulExp':
                if (data.children[0].operation === "Number" && data.children[0].value === "empty")
                    return this.getConditions(data.children[1])
                else if (data.children[1].operation === "Number" && data.children[1].value === "empty")
                    return this.getConditions(data.children[0])
                else
                    return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'DivExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'RootExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'SqrtExp':
                return `${this.parseToSymPyRadEq(data.children[0])}>=0;${this.getConditions(data.children[0])}`;

            case 'PowerExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'BracketExp':
                return `${this.getConditions(data.children[0])}`;

            case 'FracExp':
                return this.getConditions(data.children[0]) + this.getConditions(data.children[1])

            case 'LnExp':
                return `${this.parseToSymPyRadEq(data.children[0])}>0;${this.getConditions(data.children[0])}`;

            case 'LogExp':
                return `${this.parseToSymPyRadEq(data.children[0])}>0;Eq(${this.parseToSymPyRadEq(data.children[1])},1);${this.getConditions(data.children[0])}${this.getConditions(data.children[1])}`;

            case 'LogDecExp':
                return `${this.parseToSymPyRadEq(data.children[0])}>0;Eq(${this.parseToSymPyRadEq(data.children[1])},1);${this.getConditions(data.children[0])}${this.getConditions(data.children[1])}`;

            case 'SinExp':
                return `${this.getConditions(data.children[0])}`;

            case 'CosExp':
                return `${this.getConditions(data.children[0])}`;

            case 'TanExp':
                return `${this.getConditions(data.children[0])}`;

            case 'CotExp':
                return `${this.getConditions(data.children[0])}`;

            default:
                return "nosupport";
        }
    };
}