from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from TexLinearRationalImage import RenderTexLinearRational
def linearRationalFunction(expr, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    a, b, c, d = symbols('a b c d')
    exp = nsimplify(expr)
    #print expStr

    numerExp = numer(exp)
    denomExp = denom(exp)

    polNumer = Poly(numerExp, x)
    polDenom = Poly(denomExp, x)

    dataNumer = polNumer.all_coeffs()
    dataDenom = polDenom.all_coeffs()

    a = dataNumer[0]
    b = dataNumer[1]
    c = dataDenom[0]
    d = dataDenom[1]

    T = a * d - b * c

    deriExpr = T / (denomExp * denomExp)

    arr_sign = []
    arr_val = []
    arr_change = []
    
    result = {}
    result["lim"] = {}

    result["a"] = latex(a)
    result["b"] = latex(b)
    result["c"] = latex(c)
    result["d"] = latex(d)
    functionLatex = latex(Eq(y, exp))
    result["func"] = functionLatex
    result["noexist"] = latex(-d/c)
    result["deri"] = {}
    result["deri"]["expr"] = latex(deriExpr)

    if(T > 0):
        result["lim"]["posinf"] = latex(a / c)
        result["lim"]["neginf"] = latex(a / c)
        result["lim"]["posnoexist"] = "neginf"
        result["lim"]["negnoexist"] = "posinf"
        result["deri"]["sign"] = "pos"

        arr_sign.append("$$")
        arr_sign.append("$+$")
        arr_sign.append("d")
        arr_sign.append("$+$")
        arr_sign.append("$$")

        arr_val.append("$" + latex(-oo) + "$")
        arr_val.append("$" + latex(-d / c) + "$")
        arr_val.append("$+" + latex(oo) + "$")

        arr_change.append("-/ $" + latex(a / c) + "$")
        arr_change.append("+D-/ $+\infty$ / $-\infty$")
        arr_change.append("+/ $" + latex(a / c) + "$")

    else:
        result["lim"]["posinf"] = latex(a / c)
        result["lim"]["neginf"] = latex(a / c)
        result["lim"]["posnoexist"] = "posinf"
        result["lim"]["negnoexist"] = "neginf"
        result["deri"]["sign"] = "neg"

        arr_sign.append("$$")
        arr_sign.append("$-$")
        arr_sign.append("d")
        arr_sign.append("$-$")
        arr_sign.append("$$")

        arr_val.append("$" + latex(-oo)+"$")
        arr_val.append("$" + latex(-d / c) + "$")
        arr_val.append("$+" + latex(oo) + "$")

        arr_change.append("+/ $" + latex(a / c) + "$")
        arr_change.append("-D+/ $-\infty$ / $+\infty$")
        arr_change.append("-/ $" + latex(a / c) + "$")
    #for considering val
    result["considering_change"] = {}
    result["considering_change"]["val"] = arr_val
    result["considering_change"]["sign"] = arr_sign
    result["considering_change"]["change"] = arr_change

    result["asymptote"] = {}
    result["asymptote"]["vertical"] = latex(-d / c)
    result["asymptote"]["horizontal"] = latex(a / c)
    #result["image"] = linearrationaldiagram(expr, -d/c, a/c)
    tcd = -Rational(d.evalf(),c.evalf()).evalf(3)
    arr_y = []
    arr_y.append(exp.subs(x,tcd-0.1).evalf(3))
    arr_y.append(exp.subs(x,tcd+0.1).evalf(3))
    ytop = max(arr_y)
    ybot = min(arr_y)
    if(ytop > 50):
        ytop = 50
    if(ybot < -50):
        ybot = -50
    result["diagramInput"] = {}
    result["diagramInput"]["arr_fig"] = [str(a), str(b), str(c),str(d)]
    result["diagramInput"]["ytop"] = str(ytop)
    result["diagramInput"]["ybot"] = str(ybot)
    result["diagramInput"]["functionLatex"] = str(functionLatex)

    #result["image"] = RenderTexLinearRational([a,b,c,d],-10,10,ytop,ybot,functionLatex)
    return result
