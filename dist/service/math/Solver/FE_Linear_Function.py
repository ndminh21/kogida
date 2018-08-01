import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from FE_Linear_Function_Diagram import lineardiagram
import base64
from io import BytesIO
from TexLinearImage import RenderTexLinear
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
    latexFunction = latex(Eq(y, fncStr))
    result["func"] = latexFunction
    result["Ox"] = latex(-b / a)
    result["Oy"] = latex(b)
    result["diagramInput"] = {}
    result["diagramInput"]["a"] = str(a)
    result["diagramInput"]["b"] = str(b)
    result["diagramInput"]["functionLatex"] = str(latexFunction)

    #result["image"] = lineardiagram(expr, -b/a, b, 2)
    #result["image"] = RenderTexLinear(str(a), str(b), latexFunction)
    if(a > 0):
        result["a"]["sign"] = "pos"
    else:
        result["a"]["sign"] = "neg"

    return result


