import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from FE_Classification import classification
from FE_Linear_Function import linearFunction
from FE_Quadratic_Function import quadraticFunction
from FE_Cubic_Function import cubicFunction
from FE_Biquadratic_Function import biquadraticFunction
from FE_Linear_Rational_Function import linearRationalFunction
from FE_QuadraticAndLinearRational_Function import quadraticAndLinearRationalFunction

def function_explorer(expr, varList):
    
    datareturn = {}
    classifi = classification(expr)
    if classifi == 1:
        datareturn["classification"] = "linearfunction"
        datareturn["result"] = linearFunction(expr, varList)
    elif classifi == 2:
        datareturn["classification"] = "quadraticfunction"
        datareturn["result"] = quadraticFunction(expr, varList)
    elif classifi == 3:
        datareturn["classification"] = "cubicfunction"
        datareturn["result"] = cubicFunction(expr, varList)
    elif classifi == 4:
        datareturn["classification"] = "linearrationalfunction"
        datareturn["result"] = linearRationalFunction(expr, varList)
    elif classifi == 5:
        datareturn["classification"] = "biquadraticfunction"
        datareturn["result"] = biquadraticFunction(expr, varList)
    elif classifi == 6:
        datareturn["classification"] = "quadraticandlinearrationalfunction"
        datareturn["result"] = quadraticAndLinearRationalFunction(expr, varList)
    else:
        datareturn["classification"] = "nosupport"        
    return datareturn
def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def main():
    data = read_in()
    results = function_explorer(data['expr'],data['varList'])
    print json.dumps(results)

if __name__ == '__main__':
    main()


