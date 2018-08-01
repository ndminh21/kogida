import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def cal(conditions, expr):
    # get our data as an array from read_in()
    #dataond = read_in()
    #conditions = data['conditions']
    
    expr = parse_expr(expr)

    result = EmptySet()
    conditionSet = Interval(-oo, oo)
    for condition in conditions:
        sols = solve(condition, x)
        sols.sort()
        solLen = len(sols)
        result = EmptySet()
        for index, sol in enumerate(sols):
            complexSubs = complex(parse_expr(condition).subs(x, sol - 0.1))
            realSubs = complexSubs.real
            imagSubs = complexSubs.imag
            if (float(imagSubs) == 0.0):
                if (float(realSubs) > 0):
                    if index == 0:
                        result = result + Interval(-oo, sol)
                    else:
                        result = result + Interval(sols[index - 1], sol)
            complexSubs = complex(parse_expr(condition).subs(x, sol + 0.1))
            realSubs = complexSubs.real
            imagSubs = complexSubs.imag
            if (float(realSubs) > 0):
                if index == solLen - 1:
                    result = result + Interval(sol, oo)
                else:
                    result = result + Interval(sol, sols[index + 1])
        conditionSet = conditionSet.intersect(result)
    mauso = []
    for d in denoms(expr):
        for s in solve(d, x):
            sComplex = complex(s)
            if(sComplex.imag == 0.0):
                mauso.append(s)
    for cond in mauso:
        conditionSet = Interval(cond, cond).complement(conditionSet)

    # json_data = json.dumps(result)
    print latex(conditionSet)

    # print lines['node'][0]['node']




def solveSystem(input,varList):
    for varName in varList:
        exec(varName + "=Symbol(varName)")
    exec(input)    
    return result
    

def main():
    data = read_in()

    results = solveSystem(data['data'],data['varList'])
    numberMode = data['numberMode']
    root = {}
    root["accurate"] = []
    root["approximate"] = []
    if(results != EmptySet()):
        for idx, val in enumerate(list(results)):
            resultText = []
            resultTextApp = []
            isComplex = false    
            for result in list(val):
                if result.is_real == false:
                    isComplex = true
                    resultText.append(latex(result))
                    resultTextApp.append(latex(result))
                else :     
                    resultText.append(latex(result))
                    resultTextApp.append(latex(result.evalf(4)))
            if (numberMode == "complex" or isComplex == false):        
                root["accurate"].append(resultText)
                root["approximate"].append(resultTextApp)

    print json.dumps(root)
    
if __name__ == '__main__':
    main()

