from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from FE_Quadratic_Function_Diagram import quaraticdiagram
from TexQuadImage import RenderTexQuad

def quadraticFunction(expr, varList):
    
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    a, b, c = symbols('a b c')
    a1, b1, c1 = symbols('a1 b1 c1')

    delta = Symbol('delta')
    delta = nsimplify(b1*b1 - 4*a1*c1)
    fncStr = nsimplify(expr)
    #print fncStr
    pol = Poly(fncStr, x)
    data =  pol.all_coeffs()
    a = data[0]                         
    b = data[1]
    c = data[2]
    result = {}
    result["a"] = {}
    result["a"]["val"] = latex(a)
    if(a > 0):
        result["a"]["sign"] = "pos"
    else:
        result["a"]["sign"] = "neg"
    result["b"] = latex(b)
    result["c"] = latex(c)

    # if(c != 0 or b != 0):

    result["delta"] = {}
    deltaExpr = delta
    replacements = [(a1, a), (b1, b), (c1, c)]
    for _from, _to in replacements:
        with evaluate(False):
            deltaExpr = deltaExpr.replace(_from, _to)

    deltaVal = delta.subs({a1 : a, b1: b, c1 : c})


    result["delta"]["expr"] = latex(deltaExpr)
    result["delta"]["val"] = latex(deltaVal)

    if(deltaVal > 0):
        result["delta"]["sign"] = "pos"
    elif(deltaVal < 0):
        result["delta"]["sign"] = "neg"
    else:
        result["delta"]["sign"] = "zero"


    functionLatex =latex(Eq(y, fncStr))
    result["func"] = functionLatex
    result["I"] = {}
    result["I"]["x"] = latex(-b/(2*a))
    result["I"]["y"] = latex(-deltaVal / (4 * a))
    #result["image"] = quaraticdiagram(expr,[a, b, c], [-b/(2*a),-deltaVal / (4 * a)], 4)
    deltaDraw = 4
    yvalue = fncStr.subs(x, -b / (2 * a) + deltaDraw - 1).evalf()
    result["diagramInput"] ={}
    result["diagramInput"]["arr_fig"] = [str(a), str(b), str(c)]
    result["diagramInput"]["point"] = [str(-b / (2 * a)), str(-deltaVal / (4 * a))]
    result["diagramInput"]["delta"] = str(deltaDraw)
    result["diagramInput"]["y"] = str(yvalue)
    result["diagramInput"]["functionLatex"] = str(functionLatex)
    #result["image"] = RenderTexQuad([a, b, c], [-b / (2 * a), -deltaVal / (4 * a)], deltaDraw, yvalue, functionLatex)
    return result
