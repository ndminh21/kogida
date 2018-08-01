from sympy import *
import timeit
import sys, json
from sympy.parsing.sympy_parser import parse_expr
import re


#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    #return lines[0]
def deetect_trigonometic(function):
    match = re.search(r'sin', function)
    if match:
        return True
    match = re.search(r'cos', function)
    if match:
        return True
    match = re.search(r'tan', function)
    if match:
        return True
    match = re.search(r'cot', function)
    if match:
        return True
    return False

def trigon_equation(expr, varList, angleMode,numberMode):
    start = timeit.default_timer()
    for varName in varList:
        exec(varName + "=Symbol(varName)")
    exec("results = solve(expr," + str(varList[0]) + ", domain=S.Reals)")
    # results = solve(data['sympy'], domain=S.Reals)
    stop = timeit.default_timer()
    time = stop - start 
    res = {}
    degree = []
    radian = []
    k = Symbol("k")
    if angleMode == "rad":
        for result in results:
            if(result.is_real == true):
                degree.append(latex(result) + " + " + latex(2*k) + latex(pi))
            # if type(result) != dict:
            #     radian.append(latex(result*pi/180 + 2*k*pi))
    else:
        for result in results:
            if(result.is_real == true):
                degree.append(latex(result) + " + " + latex(360*k))
            # if type(result) != dict:
            #     radian.append(latex(result*pi/180 + 2*k*pi))
            
    res["accurate"] = degree
    res["approximate"] = radian
    datareturn = {}
    datareturn["time"] = time
    datareturn["root"] = res
    json_data = json.dumps(datareturn)
    return json_data

def poly_equation(expr, varList,numberMode):
    start = timeit.default_timer()
    for varName in varList:
        exec(varName + "=Symbol(varName)")
    exec("results = solveset(expr," + str(varList[0]) + ")")
    stop = timeit.default_timer()
    time = stop - start 
    res = {}
    acc = []
    appx = []
    for result in results:
        if(result.is_real == true):
            acc.append(latex(result))
            appx.append(latex(result.evalf(9)))
        if(numberMode == "complex" and result.is_real == false):
            acc.append(latex(result))
            appx.append(latex(result))

    res["accurate"] = acc
    res["approximate"] = appx
    datareturn = {}
    datareturn["time"] = time
    datareturn["root"] = res
    json_data = json.dumps(datareturn)
    return json_data

def main():
    data = read_in()
    varList = data['varList']
    expr = data['sympy']
    angleMode = data['angleMode']
    numberMode = data['numberMode']
    if deetect_trigonometic(expr):
        json_data = trigon_equation(expr, varList, angleMode,numberMode)
    else:
        json_data = poly_equation(expr, varList,numberMode)
    # result = {"sympy": sympyTrim, "numpy": normalTrim}
    # json_data = json.dumps(result)
    print json_data
    #print lines['node'][0]['node']
    # Start process

if __name__ == '__main__':
    main()
