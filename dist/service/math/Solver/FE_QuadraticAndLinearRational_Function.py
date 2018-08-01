from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import json
from FE_QuadraticAndLinearRational_Function_Diagram import quadraticandlinearrationaldiagram
from TexQuadRationalLinearImage import RenderTexQuadRationalLinear
def quadraticAndLinearRationalFunction(expr, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    a, b, c, d, e = symbols('a b c d e')
    exp = parse_expr(expr)
    
    numerExp = numer(exp)
    denomExp = denom(exp)

    pre = quo(numerExp, denomExp)
    dataPre = Poly(pre, x).all_coeffs()
    alpha = dataPre[0]
    beta = dataPre[1]

    tetra = simplify((exp - pre) * denomExp)
    polNumer = Poly(numerExp, x)
    polDenom = Poly(denomExp, x)

    dataNumer = polNumer.all_coeffs()
    dataDenom = polDenom.all_coeffs()

    a = dataNumer[0]
    b = dataNumer[1]
    c = dataNumer[2]
    d = dataDenom[0]
    e = dataDenom[1]

    arr_sign = []
    arr_val = []
    arr_change = []

    result = {}
    result["lim"] = {}

    result["a"] = latex(a)
    result["b"] = latex(b)
    result["c"] = latex(c)
    result["d"] = latex(d)
    result["e"] = latex(e)
    result["alpha"] = latex(alpha)
    result["beta"] = latex(beta)
    result["tetra"] = latex(tetra)
    functionLatex = latex(Eq(y, cancel(exp)))
    result["func"] = {}
    result["func"]["expr"] = functionLatex
    result["func"]["floor"] = latex(pre)
    result["func"]["rest"] = latex(nsimplify(tetra / denomExp))
    result["noexist"] = latex(-e/d)
    result["asymptote"] = {}
    result["asymptote"]["vertical"] = latex(-e / d)
    result["asymptote"]["cross"] = latex(alpha * x + beta)

    deriExpr = (a * d * x * x + 2 * e * a * x + b *e - c * d) / (denomExp * denomExp)
    delta = (2 * a * e)**2 - 4 * a * d * (b * e - c * d)
    result["deri"] = {}
    result["deri"]["expr"] = latex(deriExpr)
    result["deri"]["root"] = []
    result["val"] = []
    if(delta < 0):
        if( a * d < 0):
            result["deri"]["sign"] = "neg"
            result["lim"]["posinf"] = "posinf"
            result["lim"]["neginf"] = "neginf"
            result["lim"]["posnoexist"] = "neginf"
            result["lim"]["negnoexist"] = "posinf"

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(-e / d) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_sign.append("$$")
            arr_sign.append("$+$")
            arr_sign.append("d")
            arr_sign.append("$+$")
            arr_sign.append("$$")

            arr_change.append("-/ $-\infty$")
            arr_change.append("+D-/ $+\infty$ / $-\infty$")
            arr_change.append("+/ $+\infty$")
        else:
            result["deri"]["sign"] = "pos"
            result["lim"]["posinf"] = "neginf"
            result["lim"]["neginf"] = "posinf"
            result["lim"]["posnoexist"] = "posinf"
            result["lim"]["negnoexist"] = "neginf"

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(-e / d) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_sign.append("$$")
            arr_sign.append("$-$")
            arr_sign.append("d")
            arr_sign.append("$-$")
            arr_sign.append("$$")

            arr_change.append("+/ $+\infty$")
            arr_change.append("-D+/ $-\infty$ / $+\infty$")
            arr_change.append("-/ $-\infty$")
    if(delta > 0):

        sol = solveset(deriExpr, x, domain=S.Reals)
        arr_res = []

        for re in sol:
            arr_res.append(re)
        arr_res.sort()

        arr_root_latex = []
        arr_val_y = []
        for re in arr_res:
            arr_root_latex.append(latex(re))
            arr_val_y.append(latex(exp.subs(x,re)))
        result["val"] = arr_val_y
        result["deri"]["sign"] = "pos"
        result["deri"]["root"] = arr_root_latex
        if a * d > 0:
            result["lim"]["posinf"] = "posinf"
            result["lim"]["neginf"] = "neginf"
            result["lim"]["posnoexist"] = "posinf"
            result["lim"]["negnoexist"] = "neginf"

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(arr_res[0]) + "$")
            arr_val.append("$" + latex(-e / d) + "$")
            arr_val.append("$" + latex(arr_res[1]) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_sign.append("$$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("d")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$$")

            arr_change.append("-/ $-\infty$")
            arr_change.append("+/ $" + latex(exp.subs(x, arr_res[0])) + "$")
            arr_change.append("-D+/ $-\infty$ / $+\infty$")
            arr_change.append("-/ $" + latex(exp.subs(x, arr_res[1])) + "$")
            arr_change.append("+/ $+\infty$")

        else:
            result["lim"]["posinf"] = "neginf"
            result["lim"]["neginf"] = "posinf"
            result["lim"]["posnoexist"] = "neginf"
            result["lim"]["negnoexist"] = "posinf"

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(arr_res[0]) + "$")
            arr_val.append("$" + latex(-e / d) + "$")
            arr_val.append("$" + latex(arr_res[1]) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_sign.append("$$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("d")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$$")

            arr_change.append("+/ $+\infty$")
            arr_change.append("-/ $" + latex(exp.subs(x, arr_res[0])) + "$")
            arr_change.append("+D-/ $-\infty$ / $+\infty$")
            arr_change.append("+/ $" + latex(exp.subs(x, arr_res[1])) + "$")
            arr_change.append("-/ $-\infty$")

    else:
        if (a * d > 0):
            result["lim"]["posinf"] = "posinf"
            result["lim"]["neginf"] = "neginf"
            result["lim"]["posnoexist"] = "neginf"
            result["lim"]["negnoexist"] = "posinf"

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" +latex(-e / d) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_sign.append("$$")
            arr_sign.append("$+$")
            arr_sign.append("d")
            arr_sign.append("$+$")
            arr_sign.append("$$")

            arr_change.append("-/ $-\infty$")
            arr_change.append("+D-/ $+\infty$ / $-\infty$")
            arr_change.append("+/ $+\infty$")

        else:
            result["lim"]["posinf"] = "neginf"
            result["lim"]["neginf"] = "posinf"
            result["lim"]["posnoexist"] = "posinf"
            result["lim"]["negnoexist"] = "neginf"


            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(-e / d) + "$")
            arr_val.append("$+" + latex(oo) + "$")


            arr_sign.append("$$")
            arr_sign.append("$-$")
            arr_sign.append("d")
            arr_sign.append("$-$")
            arr_sign.append("$$")

            arr_change.append("+/ $+\infty$")
            arr_change.append("-D+/ $-\infty$ / $+\infty$")
            arr_change.append("-/ $-\infty$")

    #for considering val
    result["considering_change"] = {}
    result["considering_change"]["val"] = arr_val
    result["considering_change"]["sign"] = arr_sign
    result["considering_change"]["change"] = arr_change

    result["ad"] = {}
    result["ad"]["val"]  = latex(nsimplify(a*d))
    if a * d > 0:
        result["ad"]["sign"] = "pos"
    else:
        result["ad"]["sign"] = "neg"
    #result["image"] = quadraticandlinearrationaldiagram(expr, -e/d, str(alpha)+"*x+"+ str(beta))
    tcd = -Rational(e.evalf(), d.evalf()).evalf()
    arr_y = []
    arr_y.append(exp.subs(x, tcd - 0.1).evalf())
    arr_y.append(exp.subs(x, tcd + 0.1).evalf())
    ytop = max(arr_y)
    ybot = min(arr_y)
    if(ytop > 40):
        ytop = 40
    if(ybot < -40):
        ybot = -40

    result["diagramInput"] = {}
    result["diagramInput"]["arr_fig"] = [str(a), str(b), str(c),str(d),str(e),str(alpha),str(beta)]
    result["diagramInput"]["ytop"] = str(ytop)
    result["diagramInput"]["ybot"] = str(ybot)
    result["diagramInput"]["functionLatex"] = str(functionLatex)    
    #result["image"] = RenderTexQuadRationalLinear([a,b,c,d,e,alpha,beta],-10,10,ytop,ybot,functionLatex)
    return result
