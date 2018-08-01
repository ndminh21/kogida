import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from getCondition import getCondition

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def findMinMax(fnc, xmin, xmax, conditionLeq, conditionEq, option):
    x = symbols('x')
    result = {}
    xmin = parse_expr(xmin)
    xmax = parse_expr(xmax)
    if xmax <= xmin:
        result["message"] = "invalid"
    else:
        condition = getCondition(fnc, conditionLeq, conditionEq)
        if option == "full":
            intervalx = Interval(xmin, xmax, True, True)
        elif option == "left":
            intervalx = Interval(xmin, xmax, True, False)
        else:
            intervalx = Interval(xmin, xmax, False, True)
        result["domain"] = condition["json"]
        domainSet = condition["interval"]
        if (intervalx.is_subset(domainSet) and not domainSet.is_FiniteSet):
            datax = []
            result["lim"] = []
            result["set"] = "open"
            result["message"] = "valid"
            result["xmin"] = latex(xmin).replace("log", "ln")
            result["xmax"] = latex(xmax).replace("log", "ln")
            fnc = parse_expr(fnc)
            deriExp = diff(fnc, x)
            result["deri"] = {}
            result["deri"]["val"] = latex(
                simplify(deriExp)).replace("log", "ln")
            result["deri"]["root"] = []
            if (str(deriExp).find("x") == -1):
                if deriExp > 0:
                    result["deri"]["constant"] = "pos"
                elif deriExp < 0:
                    result["deri"]["constant"] = "pos"
                else:
                    result["deri"]["constant"] = "zero"
            result["point"] = []
            try:
                solDeri = solve(deriExp, x)
            except Exception, e:
                solDeri = []
                result["solveErr"] = str(e)
            arr_sol = []
            for re in solDeri:
                if (re.is_real == True):
                    arr_sol.append(re)
                    datax.append(re)
            # if(len(arr_sol) == 0):
            #     arr_sol = sorted([w.n(2, chop=True)for w in solve(deriExp)])
            arr_sol.sort()
            point = []
            if (option == "right"):
                point.append(latex(xmin).replace("log", "ln"))
                point.append(latex(fnc.subs(x, xmin)).replace("log", "ln"))
                result["point"].append(point)

                limRight = {}
                limRight["point"] = latex(xmax).replace("log", "ln")
                limRight["side"] = "left"
                limRight["value"] = latex(
                    limit(fnc, x, xmax, '-')).replace("log", "ln")
                result["lim"].append(limRight)

            limxmin = limit(fnc, x, xmin, '+')
            limxmax = limit(fnc, x, xmax, '-')
            if limxmin < limxmax:
                yminResult = limxmin
                ymaxResult = limxmax
            else:
                yminResult = limxmax
                ymaxResult = limxmin
            arr_x = []
            if option == "left":
                arr_x.append(xmax)
            elif option == "right":
                arr_x.append(xmin)
            for re in arr_sol:
                deriRoot = {}
                point = []
                deriRoot["val"] = latex(re).replace("log", "ln")
                if re > xmin and re < xmax:
                    arr_x.append(re)
                    deriRoot["accept"] = "yes"
                    yre = fnc.subs(x, re)
                    if yre < yminResult:
                        yminResult = yre
                    if yre > ymaxResult:
                        ymaxResult = yre
                    point.append(latex(re).replace("log", "ln"))
                    point.append(latex(yre).replace("log", "ln"))
                    result["point"].append(point)
                else:
                    deriRoot["accpect"] = "no"
                result["deri"]["root"].append(deriRoot)
            if (option == "left"):
                point = []
                point.append(latex(xmax).replace("log", "ln"))
                point.append(latex(fnc.subs(x, xmax)).replace("log", "ln"))
                result["point"].append(point)

                limLeft = {}
                limLeft["point"] = latex(xmin).replace("log", "ln")
                limLeft["side"] = "right"
                limLeft["value"] = latex(
                    limit(fnc, x, xmin, '+')).replace("log", "ln")
                result["lim"].append(limLeft)
            elif option == "full":

                limLeft = {}
                limLeft["point"] = latex(xmin).replace("log", "ln")
                limLeft["side"] = "right"
                limLeft["value"] = latex(
                    limit(fnc, x, xmin, '+')).replace("log", "ln")
                result["lim"].append(limLeft)

                limRight = {}
                limRight["point"] = latex(xmax).replace("log", "ln")
                limRight["side"] = "left"
                limRight["value"] = latex(
                    limit(fnc, x, xmax, '-')).replace("log", "ln")
                result["lim"].append(limRight)
            arr_x.sort()
            arr_x_min = []
            arr_x_max = []
            for val in arr_x:
                if (fnc.subs(x, val) == ymaxResult):
                    arr_x_max.append(latex(val).replace("log", "ln"))
                if (fnc.subs(x, val) == yminResult):
                    arr_x_min.append(latex(val).replace("log", "ln"))

            result["max"] = {}
            result["max"]["x"] = arr_x_max
            result["max"]["y"] = latex(ymaxResult).replace("log", "ln")

            result["min"] = {}
            result["min"]["x"] = arr_x_min
            result["min"]["y"] = latex(yminResult).replace("log", "ln")
            result["option"] = option
            result["classification"] = "open_minmax"

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
                result["considering_change"]["val"].append(
                    "$" + latex(data) + "$")

                if(idx != 0):
                    valueLeft = fnc.subs(x, datax[idx - 1])
                    if (valueLeft.is_real or valueLeft == nan):
                        result["considering_change"]["sign"].append("$$")
                    else:
                        result["considering_change"]["sign"].append("d")

                    if(datax[idx - 1] == -oo):
                        value = fnc.subs(x, data - 1)
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
                            value = fnc.subs(x, (datax[idx - 1] + 1))
                        else:
                            value = fnc.subs(x, (data + datax[idx - 1]) / 2)
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
                        limResult = limit(fnc, x, datax[idx - 1], "-")
                        result["considering_change"]["change"].append("+/$" + latex(limResult) + "$")
                    elif (sign[len(sign) - 1] == 1):
                        limResult = limit(fnc, x, datax[idx - 1], "+")
                        result["considering_change"]["change"].append("-/$" + latex(limResult) + "$")
                    else:
                        limResult = limit(fnc, x, datax[idx - 1], "-")
                        if(len(sign) >= 2):
                            if (sign[len(sign) - 2] == 0):
                                result["considering_change"]["change"].append("-H/$" + latex(limResult) + "$")
                            else:
                                result["considering_change"]["change"].append("+H/$" + latex(limResult) + "$")
                        else:
                            result["considering_change"]["change"].append("-H/$" + latex(limResult) + "$")

                if idx == (len(datax) - 1):
                    valueLeft = fnc.subs(x, datax[idx])
                    if (valueLeft.is_real or valueLeft == nan):
                        result["considering_change"]["sign"].append("$$")
                    else:
                        result["considering_change"]["sign"].append("d")

            if (sign[len(sign) - 1] == 0):
                limResult = limit(fnc, x, datax[len(datax) - 1], "-")
                result["considering_change"]["change"].append("-/$" + latex(limResult) + "$")
            elif (sign[len(sign) - 1] == 1):
                limResult = limit(fnc, x, datax[len(datax) - 1], "+")
                result["considering_change"]["change"].append("+/$" + latex(limResult) + "$")
        else:
            result["message"] = "notindomain"

    return result

def main():
    data = read_in()
    results = findMinMax(str(data["function"]),data["xmin"],data["xmax"],data["conditionLeq"],data["conditionEq"],data["option"])
    print json.dumps(results)


if __name__ == '__main__':
    main()
