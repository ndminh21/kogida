import sys, json
from sympy import *
import time

# x = Symbol('x')
def json_interval_finite(res):
    data = {}
    boundary = {}
    if res == Interval(-oo, oo):
        args = res.args
        boundary["max"] = "+" + latex(args[1])
        boundary["min"] = latex(args[0])
        data["open_set"] = boundary
    elif res.is_Interval:
        args = res.args
        if args[1] == oo:
            boundary["max"] = "+" + latex(args[1])
        else:
            # boundary["max"] = latex(args[1])
            if len(str(latex(args[1]))) < 80:
                boundary["max"] = latex(args[1])
            else:
                boundary["max"] = latex(args[1].evalf(4))

        # boundary["min"] = latex(args[0])
        if len(str(latex(args[0]))) < 80:
            boundary["min"] = latex(args[0])
        else:
            boundary["min"] = latex(args[0].evalf(4))

        if res.left_open and not res.right_open:
            data["left_open_set"] = boundary
        elif res.right_open and not res.left_open:
            data["right_open_set"] = boundary
        elif res.is_closed:
            data["closed_set"] = boundary
        else:
            data["open_set"] = boundary
    elif res.is_FiniteSet:
        data["listed_set"] = latex(res)
    return data

def solveSimply(function, varlist):
    
    start_time = time.time()
    for varName in varlist:
        exec(varName + "=Symbol(varName)")
    res = solve_univariate_inequality(simplify(function), str(varlist[0]), relational=False)
    datareturn = {}
    data = {}
    childs = []
    if res.is_Interval:
        data = json_interval_finite(res)
    elif res.is_FiniteSet:
        data = json_interval_finite(res)
    elif res.is_Union:
        args = res.args
        for arg in args:
            childs.append(json_interval_finite(arg))
        data["unions"] = childs
    # print(data)
    datareturn["rootset"] = data
    # print(type(datareturn))
    datareturn["time"] = time.time() - start_time
    json_data = json.dumps(datareturn)
    
    return json_data

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    #return lines[0]

def main():
    data = read_in()
    results = solveSimply(data['sympy'], data['varList']) 
    
    # result = {"sympy": sympyTrim, "numpy": normalTrim}
    # json_data = json.dumps(result)
    print results
    #print lines['node'][0]['node']
    # Start process

if __name__ == '__main__':
    main()