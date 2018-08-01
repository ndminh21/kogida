import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from getCondition import getCondition

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def findMinMax(fnc,xmin,xmax,conditionLeq,conditionEq):
    x = symbols('x')
    result = {}
    xmin = parse_expr(xmin)
    xmax = parse_expr(xmax)
    if xmax <= xmin:
        result["message"] = "invalid"
    else:
        condition = getCondition(fnc,conditionLeq,conditionEq)
        intervalx = Interval(xmin,xmax)
        result["domain"] = condition["json"]
        if(intervalx.is_subset(condition["interval"]) and not condition["interval"].is_FiniteSet):
            result["set"] = "closed"
            result["message"] = "valid"
            result["xmin"] = latex(xmin).replace("log", "ln")
            result["xmax"] = latex(xmax).replace("log", "ln")
            fnc = parse_expr(fnc)
            deriExp = diff(fnc,x)
            result["deri"] = {}
            result["deri"]["val"] = latex(simplify(deriExp)).replace("log", "ln")
            result["deri"]["root"] = []
            if(str(deriExp).find("x") == -1):
                if deriExp > 0 :
                    result["deri"]["constant"] = "pos"
                elif deriExp < 0 :
                    result["deri"]["constant"] = "pos"
                else:
                    result["deri"]["constant"] = "zero"
            result["point"] = []
            try:
                solDeri = solve(deriExp,x)
            except Exception, e:
                solDeri = []
                result["solveErr"] = str(e)
            arr_sol = []
            for re in solDeri:
                if(re.is_real == True):
                    arr_sol.append(re)
            # if(len(arr_sol) == 0):
            #     arr_sol = sorted([w.n(2, chop=True)for w in solve(deriExp)])
            arr_sol.sort()
            point = []
            point.append(latex(xmin).replace("log", "ln"))
            point.append(latex(fnc.subs(x, xmin)).replace("log", "ln"))
            result["point"].append(point)
            yminResult = fnc.subs(x,xmin)
            if yminResult > fnc.subs(x, xmax):
                yminResult = fnc.subs(x, xmax)
                ymaxResult = fnc.subs(x, xmin)
            else:
                ymaxResult = fnc.subs(x, xmax)
            arr_x = []
            arr_x.append(xmin)
            arr_x.append(xmax)
            for re in arr_sol:
                deriRoot = {}
                point = []
                deriRoot["val"] = latex(re).replace("log","ln")
                if re > xmin and re < xmax:
                    arr_x.append(re)
                    deriRoot["accept"] = "yes"
                    yre = fnc.subs(x,re)
                    if yre < yminResult:
                        yminResult = yre
                    if yre > ymaxResult : 
                        ymaxResult = yre    
                    point.append(latex(re).replace("log", "ln"))
                    point.append(latex(yre).replace("log", "ln"))
                    result["point"].append(point)
                else:
                    deriRoot["accpect"] = "no"
                result["deri"]["root"].append(deriRoot)   
            point = []
            point.append(latex(xmax).replace("log", "ln"))
            point.append(latex(fnc.subs(x, xmax)).replace("log", "ln"))
            result["point"].append(point)
            arr_x.sort()
            arr_x_min = []
            arr_x_max = []
            for val in arr_x:
                if(fnc.subs(x,val) == ymaxResult):
                    arr_x_max.append(latex(val).replace("log", "ln"))
                if(fnc.subs(x,val) == yminResult):
                    arr_x_min.append(latex(val).replace("log", "ln"))

            result["max"] = {}
            result["max"]["x"] = arr_x_max
            result["max"]["y"] = latex(ymaxResult).replace("log", "ln")
            
            result["min"] = {}
            result["min"]["x"] = arr_x_min
            result["min"]["y"] = latex(yminResult).replace("log", "ln")
            result["classification"] = "close_minmax"
        else:
            result["message"] = "notindomain"
    return result
def main():
    data = read_in()
    results = findMinMax(str(data["function"]),data["xmin"],data["xmax"],data["conditionLeq"],data["conditionEq"])
    print json.dumps(results)


if __name__ == '__main__':
    main()
