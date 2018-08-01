from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from converter import tex2base64
def RenderAnyFunction(xleft,xright,ybot,ytop,functionLatex,functionExpr):
    
    deltaxStr = '(' + str(xright) + "-" + str(xleft) + ')/10'
    deltayStr = '(' + str(ytop) + "-" + str(ybot) + ')/10'
    detalx = parse_expr(deltaxStr).evalf()
    if (detalx < 0.5):
        detalx = 0.5
    else:
        detalx = int(round(parse_expr(deltaxStr).evalf()))
    detaly = parse_expr(deltayStr).evalf()
    if (detaly < 0.5):
        detaly = 0.5
    else:
        detaly = int(round(parse_expr(deltayStr).evalf()))
    tex =  '\\documentclass[preview]{standalone}'
    tex += '\\usepackage[hmargin = 0cm, vmargin = 0cm]{geometry}'
    tex += '\\usepackage{tikz}'
    tex += '\\usepackage{pgfplots}'
    tex += '\\begin{document}'
    tex += '\\begin{figure}[h!tbp]'
    tex += '\\centering'
    tex += '\\begin{tikzpicture}'
    tex += '\\begin{axis}['
    tex += 'height = 15cm,'
    tex += 'domain=' + str(xleft) + ':' + str(xright) +','
    tex += 'grid = major,'
    tex += 'grid style = {dashed, gray!50},'
    tex += 'axis lines = middle,'
    tex += 'inner axis line style = {= >},'
    tex += 'xlabel = {\\large $x$},'
    tex += 'ylabel = {\\large $y$},'
    tex += 'yticklabel style = {inner ysep = 0pt, anchor = south east},'
    tex += 'xticklabel style= {inner xsep = 0pt, anchor = north west},'
    tex += 'xtick = {'
    tex += str(xleft) + ',' + str(xleft + detalx) + ', ..., ' + str(xright) + '},'
    tex += 'ytick = {'
    tex += str(ybot) + ',' + str(ybot + detaly) + ', ..., ' + str(ytop) + '},'
    tex += 'ymin = ' + str(ybot - detaly) + ','
    tex += 'ymax = ' + str(ytop + detaly) + ','
    tex += 'xmin = ' + str(xleft - detalx) + ','
    tex += 'xmax = ' + str(xright + detalx) + ','
    tex += 'after end axis/.code = {\\path (axis cs: 0,0) node [anchor = north west, yshift = -0.075cm] {0};}]'
    tex += '\\addplot[color = red, thick, domain=' + str(xleft) +':' + str(xright) + ',restrict y to domain =' + str(ybot) + ':'+ str(ytop) + ',samples = 201] {' + functionExpr + '};'
    tex += '\\legend{$\\displaystyle ' + functionLatex + '$}'
    tex += '\\end{axis}'
    tex += '\\end{tikzpicture}'
    tex +='\\end{figure}'
    tex += '\\end{document}'
    return  tex2base64(tex)
