import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from getCondition import getCondition


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def getConsideringChangeJson(fnc, xmin, xmax, conditionLeq, conditionEq, open_left, open_right):
    x = symbols('x')
    result = {}
    condition = getCondition(fnc, conditionLeq, conditionEq)
    domainSet = condition["interval"]
    fnc = parse_expr(fnc)
    deriExp = diff(fnc, x)
    try:
        solDeri = solve(deriExp, x)
    except Exception, e:
        solDeri = []
        result["solveErr"] = str(e)
    arr_sol = []
    datax = []

    for re in solDeri:
        if (re.is_real == True):
            arr_sol.append(re)
            datax.append(re)
    
    arr_sol.sort()
    
    
    if domainSet.is_Interval:
        datax.append(domainSet.args[0])
        datax.append(domainSet.args[1])
    elif domainSet.is_Union:
        args = domainSet.args
        for arg in args:
            datax.append(arg.args[0])
            datax.append(arg.args[1])
    
    datax = list(set(datax))
    datax.sort()
    result["considering_change"] = {}
    result["considering_change"]["change"] = []
    result["considering_change"]["val"] = []
    result["considering_change"]["sign"] = []

    sign = []
    for idx, data in enumerate(datax):
        if len(str(data)) > 40:
            result["considering_change"]["val"].append("$" + latex(data.evalf(4)) + "$")
        else:
            if(data == oo):
                result["considering_change"]["val"].append("$+\\infty$")
            else:        
                result["considering_change"]["val"].append("$" + latex(data) + "$")

        if(idx != 0):
            valueLeft = fnc.subs(x, datax[idx - 1])
            if (valueLeft.is_real or valueLeft == nan):
                if(datax[idx - 1] in arr_sol):
                    result["considering_change"]["sign"].append("$0$")
                else:
                    result["considering_change"]["sign"].append("$$")
            else:
                result["considering_change"]["sign"].append("d")

            if(datax[idx - 1] == -oo):
                value = deriExp.subs(x, data - 1)
                if(value == nan):
                    value = limit(deriExpr,x,data,"-")
                if(value.is_real):
                    if value > 0:
                        result["considering_change"]["sign"].append("$+$")
                        sign.append(1)
                    else:
                        result["considering_change"]["sign"].append("$-$")
                        sign.append(0)
                else:
                    result["considering_change"]["sign"].append("h")
                    sign.append(2)
            else:
                if(datax[idx] == oo):
                    value = deriExp.subs(x, (datax[idx - 1] + 1))
                else:
                    value = deriExp.subs(x, (data + datax[idx - 1]) / 2)
                if (value.is_real or value == nan):
                    if value > 0:
                        result["considering_change"]["sign"].append("$+$")
                        sign.append(1)
                    else:
                        result["considering_change"]["sign"].append("$-$")
                        sign.append(0)
                else:
                    result["considering_change"]["sign"].append("h")
                    sign.append(2)

            if (sign[len(sign) - 1] == 0):
                if (len(sign) >= 2):
                    if(datax[idx - 1] in (domainSet)):
                        if (sign[len(sign) - 2] == 0):
                            result["considering_change"]["change"].append("R/")
                        else:
                            limResult = fnc.subs(x, datax[idx - 1])
                            if len(str(limResult))>40:
                                limResult = limResult.evalf(4)
                            latexLimResult = latex(limResult).replace("log","ln")    
                            if(latexLimResult == "\\infty"):
                                latexLimResult = "+\\infty"       
                            result["considering_change"]["change"].append("+/$" + latexLimResult + "$")
                    else:
                        limResultLeft = limit(fnc, x, datax[idx - 1], "-")
                        limResultRight = limit(fnc, x, datax[idx - 1], "+")
                        if len(str(limResultLeft)) > 40:
                            limResultLeft = limResultLeft.evalf(4)
                        if len(str(limResultRight)) > 40:
                            limResultRight = limResultRight.evalf(4)
                        latexLeft = latex(limResultLeft).replace("log","ln")
                        latexRight = latex(limResultRight).replace("log","ln")
                        if(latexLeft == "\\infty"):
                            latexLeft = "+\\infty"

                        if(latexRight == "\\infty"):
                            latexRight = "+\\infty"

                        if (sign[len(sign) - 2] == 0):
                            
                            result["considering_change"]["change"].append("-D+/ $" + latexLeft + "$ / $" + latexRight + "$")
                        else:
                            result["considering_change"]["change"].append("-D-/ $" + latexLeft + "$ / $" + latexRight + "$")
                else:
                    limResult = limit(fnc, x, datax[idx - 1], "-")
                    if len(str(limResult)) > 40:
                        limResult = limResult.evalf(4)
                    latexLimResult = latex(limResult).replace("log","ln")
                    if(latexLimResult == "\\infty"):
                        latexLimResult = "+\\infty"

                    result["considering_change"]["change"].append("+/$" + latexLimResult + "$")
            elif (sign[len(sign) - 1] == 1):
                if (len(sign) >= 2):
                    if(datax[idx-1] in (domainSet)):
                        if (sign[len(sign) - 2] == 1):
                            result["considering_change"]["change"].append("R/")
                        else:
                            limResult = fnc.subs(x, datax[idx - 1])
                            if len(str(limResult)) > 40:
                                limResult=limResult.evalf(4)
                            latexLimResult = latex(limResult).replace("log","ln")       
                            if(latexLimResult == "\\infty"):
                                latexLimResult = "+\\infty"
                            result["considering_change"]["change"].append("-/$" + latexLimResult + "$")
                    else:
                        limResultLeft = limit(fnc, x, datax[idx - 1], "-")
                        limResultRight = limit(fnc, x, datax[idx - 1], "+")
                       
                        if len(str(limResultLeft)) > 40:
                            limResultLeft = limResultLeft.evalf(4)
                        if len(str(limResultRight)) > 40:
                            limResultRight = limResultRight.evalf(4)
                        latexLeft = latex(limResultLeft).replace("log", "ln")
                        latexRight = latex(limResultRight).replace("log", "ln")
                        if(latexLeft == "\\infty"):
                            latexLeft = "+\\infty"
                        if(latexRight == "\\infty"):
                            latexRight = "+\\infty"
                        if (sign[len(sign) - 2] == 1):
                            result["considering_change"]["change"].append("+D-/ $" +latexLeft + "$ / $" + latexRight+"$")
                        else:
                            result["considering_change"]["change"].append("+D+/ $" + latexLeft + "$ / $" + latexRight + "$")
                else:
                    #limResult = fnc.subs(x, datax[idx - 1])
                    limResult = limit(fnc, x, datax[idx - 1], "+")
                    if len(str(limResult)) > 40:
                        limResult = limResult.evalf(4)
                    latexLimResult = latex(limResult).replace("log","ln")    

                    if(latexLimResult == "\\infty"):
                        latexLimResult = "+\\infty"
                    result["considering_change"]["change"].append("-/$" + latexLimResult + "$")
            else:
                limResult = limit(fnc, x, datax[idx - 1], "-")
                if len(str(limResult)) > 40:
                    limResult = limResult.evalf(4)
                latexLimResult = latex(limResult).replace("log","ln")
                if(latexLimResult == "\\infty"):
                        latexLimResult = "+\\infty"
                if(len(sign) >= 2):
                    if (sign[len(sign) - 2] == 0):
                        result["considering_change"]["change"].append("-H/$" + latexLimResult + "$")
                    else:
                        result["considering_change"]["change"].append("+H/$" + latexLimResult + "$")
                else:
                    result["considering_change"]["change"].append("-H/$" + latexLimResult + "$")

        if idx == (len(datax) - 1):
            valueLeft = fnc.subs(x, datax[idx])
            if (valueLeft.is_real or valueLeft == nan):
                result["considering_change"]["sign"].append("$$")
            else:
                result["considering_change"]["sign"].append("d")

    if (sign[len(sign) - 1] == 0):
        limResult = limit(fnc, x, datax[len(datax) - 1], "-")
        if len(str(limResult)) > 40:
            limResult=limResult.evalf(4)
        latexLimResult = latex(limResult).replace("log","ln")
        if(latexLimResult == "\\infty"):
            latexLimResult = "+\\infty"
        result["considering_change"]["change"].append("-/$" + latexLimResult + "$")
    elif (sign[len(sign) - 1] == 1):
        limResult = limit(fnc, x, datax[len(datax) - 1], "+")
        if len(str(limResult)) > 40:
            limResult=limResult.evalf(4)
        latexLimResult = latex(limResult).replace("log","ln")
        if(latexLimResult == "\\infty"):
            latexLimResult = "+\\infty"
        result["considering_change"]["change"].append("+/$" + latexLimResult + "$")
    return result


def main():
    data = read_in()
    results = getConsideringChangeJson(str(data["function"]), data["xmin"], data["xmax"],data["conditionLeq"], data["conditionEq"], data["open_left"],data["open_right"])
    print json.dumps(results)


if __name__ == '__main__':
    main()
