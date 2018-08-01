import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr


def linearFunction(expr, varList):
    for varName in varList:
        exec(varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    fncStr = nsimplify(expr)
    #print fncStr
    a = Poly(fncStr, x)
    data = a.all_coeffs()
    a = data[0]
    b = data[1]
    result = {}
    result["a"] = {}
    result["a"]["val"] = latex(a)
    result["b"] = latex(b)
    result["func"] = latex(Eq(y, fncStr))
    result["Ox"] = latex(-b / a)
    result["Oy"] = latex(b)
    if(a > 0):
        result["a"]["sign"] = "pos"
    else:
        result["a"]["sign"] = "neg"

    return result



def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def main():
    data = read_in()

    results = linearFunction(data['expr'],data['varList'])
    print json.dumps(results)

if __name__ == '__main__':
    main()


