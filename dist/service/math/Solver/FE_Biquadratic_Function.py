from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from FE_Biquadratic_Function_Diagram import biquadraticdiagram
from TexBiQuadImage import RenderTexBiQuad

def biquadraticFunction(expr, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    a, b, c = symbols('a b c')
    a1, b1, c1 = symbols('a1 b1 c1')

    delta = Symbol('delta')
    delta = nsimplify(b1 * b1 - 4 * a1 * c1)
    exp = nsimplify(expr)
    #print exp
    pol = Poly(exp, x)
    data = pol.all_coeffs()

    a = data[0]
    b = data[2]
    c = data[4]
    result = {}
    result["a"] = {}
    result["a"]["val"] = latex(a)
    result["lim"] = {}
    result["a"]["val"] = latex(a)
    if (a > 0):
        result["a"]["sign"] = "pos"
        result["lim"]["posinf"] = "posinf"
        result["lim"]["neginf"] = "neginf"
    else:
        result["a"]["sign"] = "neg"
        result["lim"]["posinf"] = "neginf"
        result["lim"]["neginf"] = "posinf"

    result["b"] = latex(b)
    result["c"] = latex(c)
    functionLatex =  latex(Eq(y, exp))
    result["func"] = functionLatex

    deriExpr = diff(exp, x)

    result["deri"] = {}
    result["deri"]["expr"] = latex(deriExpr)
    arr_root_latex = []
    result["considering_change"] = {}

    arr_change = []
    arr_val = []
    arr_sign = []
    arr_res = []
    if a * b < 0:
        x1 = -sqrt(-b / (2 * a))
        x2 = sqrt(-b / (2 * a))
        arr_res.append(x1)
        arr_res.append(0)
        arr_res.append(x2)
        arr_root_latex.append(latex(x1))
        arr_root_latex.append(latex("0"))
        arr_root_latex.append(latex(x2))
        if(a > 0):
            arr_sign.append("$$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$$")

            arr_val.append("$"+ latex(-oo)+"$")
            arr_val.append("$"+ latex(x1) +"$")
            arr_val.append("$"+ latex(0) + "$")
            arr_val.append("$"+ latex(x2)+ "$")
            arr_val.append("$+" + latex(oo)+"$")

            arr_change.append("+/ $-\infty$")
            arr_change.append("-/$" + latex(exp.subs(x, x1)) + "$")
            arr_change.append("+/$" + latex(exp.subs(x, 0)) + "$")
            arr_change.append("-/$" + latex(exp.subs(x, x2)) + "$")
            arr_change.append("+/ $+\infty$")

        else:
            arr_sign.append("$$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$$")

            arr_val = []
            arr_val.append("$"+ latex(-oo) + "$")
            arr_val.append("$"+ latex(x1) + "$")
            arr_val.append("$"+ latex(0) + "$")
            arr_val.append("$"+ latex(x2)+ "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_change = []
            arr_change.append("-/ $-\infty$")
            arr_change.append("+/$" + latex(exp.subs(x, x1)) + "$")
            arr_change.append("-/$" + latex(exp.subs(x, 0)) + "$")
            arr_change.append("+/$" + latex(exp.subs(x, x2)) + "$")
            arr_change.append("-/ $+\infty$")

    else:
        arr_res.append(0)
        arr_root_latex.append(latex("0"))
        if a > 0:
            arr_sign.append("$$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$$")

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(0) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_change.append("+/ $-\infty$")
            arr_change.append("-/$" + latex(exp.subs(x, 0)) + "$")
            arr_change.append("+/ $+\infty$")

        else:
            arr_sign.append("$$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$$")

            arr_val.append("$" + latex(-oo) + "$")
            arr_val.append("$" + latex(0) + "$")
            arr_val.append("$+" + latex(oo) + "$")

            arr_change.append("-/ $-\infty$")
            arr_change.append("+/$" + latex(exp.subs(x, 0)) + "$")
            arr_change.append("-/ $+\infty$")
    arr_res_y = []
    for re in arr_res:
        arr_res_y.append(latex(exp.subs(x, re)))

    result["val"] = arr_res_y
    result["deri"]["root"] = arr_root_latex
    result["considering_change"]["val"] = arr_val
    result["considering_change"]["sign"] = arr_sign
    result["considering_change"]["change"] = arr_change

    # ve hinh
    deltaY = 3
    deltaX = 0
    arr_sol = []
    solexp = solveset(exp,x)
    for re in solexp:
        if(sympify(re).is_real):
            arr_sol.append(re.evalf())
    arr_sol.sort()    
    if ( a > 0 ):

        
        if(len(arr_sol)> 0):
            xleft = arr_sol[0] - deltaX -1
            xright = arr_sol[len(arr_sol)-1] + deltaX +1
        else:
            if(a*b<0):
                xleft = x1 - deltaX -2
                xright = -x1 + deltaX +2
            else:
                xleft = - 5
                xright = 5
        y = 0
        if (a * b < 0):
            x1 = -sqrt(-b / (2 * a))
            y = exp.subs(x, x1)
        else:
            y = exp.subs(x, 0)

        if (y >= 0):
            ybot = -2
            ytop = exp.subs(x, xleft+2) + deltaY
        else:
            ybot = y - 2
            ytop = exp.subs(x, xright-2) + deltaY
            

    else:
        y = 0

        if(len(arr_sol) > 0):
            xleft = arr_sol[0] - deltaX - 1
            xright = arr_sol[len(arr_sol) - 1] + deltaX + 1
        else:
            if(a * b < 0):
                xleft = x1 - deltaX - 2
                xright = -x1 + deltaX + 2
            else:
                xleft = - 5
                xright = 5
        if (a * b < 0):
            x1 = -sqrt(-b / (2 * a))
            y = exp.subs(x, x1)
        else:
            y = exp.subs(x, 0)
        if (y >= 0):
            ybot = -2
            ytop = y + 2
        else:
            ybot = -abs(exp.subs(x, xright-2)) - deltaY
            ytop = 2

    #result["image"] = biquadraticdiagram(expr, [a,b,c], [x1, x2], 4)
    arr_x = []
    arr_y = []
    for re in arr_res:
        arr_x.append(str(re))
        arr_y.append(str(exp.subs(x, re).evalf()))
    result["diagramInput"] = {}
    result["diagramInput"]["arr_fig"] = [str(a), str(b), str(c)]
    result["diagramInput"]["xleft"] = str(xleft)
    result["diagramInput"]["xright"] = str(xright)
    result["diagramInput"]["ytop"] = str(ytop)
    result["diagramInput"]["ybot"] = str(ybot)
    result["diagramInput"]["functionLatex"] = str(functionLatex)
    result["diagramInput"]["delta"] = str(deltaX)
    result["diagramInput"]["arr_x"] = arr_x
    result["diagramInput"]["arr_y"] = arr_y


    #result["image"] = RenderTexBiQuad([a,b,c],xleft,xright,ytop,ybot,deltaX,arr_res,arr_res_y,functionLatex)
    return result
