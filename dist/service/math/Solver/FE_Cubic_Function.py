from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from FE_Cubic_Function_Diagram import cubicdiagram
from TexCubicImage import RenderTexCubic

def cubicFunction(expr, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    y = Symbol('y')
    x = Symbol('x')
    a, b, c, d = symbols('a b c d')
    a1, b1, c1 = symbols('a1 b1 c1')

    delta = Symbol('delta')
    delta = nsimplify(b1 * b1 - 4 * a1 * c1)
    exp = nsimplify(expr)
    #print expStr
    pol = Poly(exp, x)
    data = pol.all_coeffs()
    a = data[0]
    b = data[1]
    c = data[2]
    d = data[3]
    result = {}
    result["a"] = {}
    result["lim"] = {}
    result["a"]["val"] = latex(a)
    if(a > 0):
        result["a"]["sign"] = "pos"
        result["lim"]["posinf"] = "posinf"
        result["lim"]["neginf"] = "neginf"
    else:
        result["a"]["sign"] = "neg"
        result["lim"]["posinf"] = "neginf"
        result["lim"]["neginf"] = "posinf"

    result["b"] = latex(b)
    result["c"] = latex(c)
    result["d"] = latex(d)
    functionLatex = latex(Eq(y, exp))
    result["func"] = functionLatex

    deriExpr = diff(exp, x)
   
    solderi = solveset(deriExpr, x, domain=S.Reals)
    solexp = solve(exp, x)
    
    #arr res y' = 0
    arr_res = []
    #arr sol y = 0 => de ve do thi
    arr_sol = []
    # chua cac gia tri cua diem cuc tri
    
    for re in solderi:
        arr_res.append(re)
    arr_res.sort()

    # if(len)
    arr_res_y = []
    #ve do thi
    arr_x = []
    arr_y = []

    for re in arr_res:
        arr_y.append(str(exp.subs(x, re).evalf()))
        arr_x.append(str(re))
        arr_res_y.append(latex(exp.subs(x,re)))
    
    result["val"] = arr_res_y

    for re in solexp:
        if(sympify(re).is_real):
            arr_sol.append(re.evalf())    
    if(len(arr_sol) == 0):
        arr_sol = sorted([w.n(2, chop=True)for w in solve(expr)])
    #sort
    arr_res.sort()
    arr_sol.sort()
    #arr_draw_y.sort()

    arr_root_latex = []
    for re in arr_res:
        arr_root_latex.append(latex(re))

    result["deri"] = {}
    result["deri"]["expr"] = latex(deriExpr)
    result["deri"]["root"] = arr_root_latex
    if(len(arr_res) == 0):
        deriSign = solve(str(deriExpr) + '> 0',x)
        if(deriSign == True):
            result["deri"]["sign"] = "pos"
        else:
            result["deri"]["sign"] = "neg"

    #for considering val
    result["considering_change"] = {}

    arr_sign = []
    arr_val = []
    arr_change = []
    arr_val.append("$" + latex(-oo) +"$")
    arr_sign.append("$$")
    len_arr_res = len(arr_res)
    if len_arr_res == 0:
        if a > 0:
            arr_change.append("-/ $-\infty$")
            arr_change.append("+/ $+\infty$")
        else:
            arr_change.append("+/ $-\infty$")
            arr_change.append("-/ $+\infty$")
        if exp.subs(x, 0) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
    elif len_arr_res == 1:
        if a > 0:
            arr_change.append("-/ $-\infty$")
            arr_change.append("R/")
            arr_change.append("+/ $+\infty$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")

        else:
            arr_change.append("+/ $-\infty$")
            arr_change.append("R/")
            arr_change.append("-/ $+\infty$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
        arr_val.append("$" + latex(arr_res[0]) + "$")
        # # if exp.subs(x, arr_res[0] - 1) < 0:
        # #     arr_sign.append("$-$")
        # # else:
        # #     arr_sign.append("$+$")
        
        # if exp.subs(x, arr_res[0] + 1) < 0:
        #     arr_sign.append("$-$")
        # else:
        #     arr_sign.append("$+$")
    elif len_arr_res > 1:
        if a > 0:
            arr_change.append("-/ $-\infty$")
            x1 = (exp.subs(x, arr_res[0]))
            if(len(str(x1)) > 40):
                x1 = latex(x1.evalf(4))
            else:
                x1 = latex(x1)    
            x2 = (exp.subs(x, arr_res[1]))
            if(len(str(x2)) > 40):
                x2 = latex(x2.evalf(4))
            else:
                x2 = latex(x2)
            arr_change.append("+/$" + str(x1) + "$")
            arr_change.append("-/$" + str(x2) + "$")
            arr_change.append("+/ $+\infty$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")

        else:
            arr_change.append("+/ $-\infty$")
            arr_change.append("-/$" + latex(exp.subs(x, arr_res[0])) + "$")
            arr_change.append("+/$" + latex(exp.subs(x, arr_res[1])) + "$")
            arr_change.append("-/ $+\infty$")
            arr_sign.append("$-$")
            arr_sign.append("$0$")
            arr_sign.append("$+$")
            arr_sign.append("$0$")
            arr_sign.append("$-$")
        for ind, res in enumerate(arr_res):
            arr_val.append("$" + latex(arr_res[ind]) + "$")
            
    arr_sign.append("$$")
    arr_val.append("$+" + latex(oo) + "$")

    result["considering_change"]["val"] = arr_val
    result["considering_change"]["sign"] = arr_sign
    result["considering_change"]["change"] = arr_change
    #result["image"] = cubicdiagram(expr, [a, b, c, d], arr_res, 4)

    # tinh toan de ve do thi
    deltaX = 2
    deltaY = 1
    if(len(arr_res) == 2):
        xleft = arr_res[0] - deltaX -2
        if(len(arr_sol) == 1):
            xright = 2*arr_res[1] -arr_res[0] + deltaX
        elif(len(arr_sol) == 2):
            xright = arr_sol[1] + deltaX
        else:
            xright = arr_sol[2] + deltaX
        
        if(a > 0):
            ybot = exp.subs(x, arr_res[1]).evalf() - 2
            ytop = exp.subs(x, arr_res[0]).evalf() + 2
        else:
            ybot = exp.subs(x, arr_res[0]).evalf() - 2
            ytop = exp.subs(x, arr_res[1]).evalf() + 2
    else:
        xT = parse_expr("-" + str(b) + "/(3*" + str(a) + ")")
        xleft = xT - deltaX - 2
        xright = xT  + deltaX + 2
        if(a > 0):
            ybot = exp.subs(x, xleft+1).evalf() - 2
            ytop = exp.subs(x, xright-1).evalf() + 2
        else:
            ybot = exp.subs(x, xright-1).evalf() - 2
            ytop = exp.subs(x, xleft+1).evalf() + 2
    result["diagramInput"] = {}
    result["diagramInput"]["arr_fig"] = [str(a),str(b),str(c),str(d)]
    result["diagramInput"]["xleft"] = str(xleft)
    result["diagramInput"]["xright"] = str(xright)
    result["diagramInput"]["ytop"] = str(ytop)
    result["diagramInput"]["ybot"] = str(ybot)
    result["diagramInput"]["functionLatex"] = str(functionLatex)
    result["diagramInput"]["arr_x"] = arr_x
    result["diagramInput"]["arr_y"] = arr_y

    #result["image"] = RenderTexCubic([a,b,c,d],xleft,xright,ytop,ybot,1,functionLatex,arr_res,arr_draw_y)
    return result
