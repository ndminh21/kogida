from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from converter import tex2base64


def RenderTexCubic(arr_fig,xleft,xright,ytop,ybot,delta,functionLatex,arr_x,arr_y):
    a = arr_fig[0]
    b = arr_fig[1]
    c = arr_fig[2]
    d = arr_fig[3]

    xleft = int(floor(xleft))
    xright  = int(ceiling(xright))
    ytop = int(ceiling(ytop))
    ybot = int(floor(ybot))
    if (ybot > -2):
        ybot = -2

    if (ytop < 2):
        ytop = 2
    
    if xleft > -2 :
        xleft = -2
    if xright < 2:
        xright = 2

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
    tex = '\\documentclass[preview]{standalone}'
    tex += '\\usepackage[hmargin = 0cm, vmargin = 0cm]{geometry}'
    tex += '\\usepackage{tikz}'
    tex += '\\usepackage{pgfplots}'
    tex += '\\begin{document}'
    tex += '\\begin{figure}[h!tbp]'
    tex += '\\centering'
    tex += '\\begin{tikzpicture}'
    tex += '\\begin{axis}['
    #tex += 'scatter / classes = {a = {mark = square *, blue}},'
    tex += 'height = 15cm,'
    tex += 'domain=' + str(xleft) + ':' + str(xright) + ','
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
    if(len(arr_x) == 2):
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[0].evalf())  + ','+ str(arr_y[0]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {A};}]'
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[1].evalf())  + ','+ str(arr_y[1]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {B};}]'
    tex += '\\addplot[color = red, thick, samples = 201] {' + str(a) + '*x*x*x + ' + str(b) + '*x*x+' + str(c) + '*x+' + str(d) + '};'
    tex += '\\legend{$' + functionLatex + '$}'
    if(len(arr_x)==2):
        tex += '\\addplot[scatter, only marks,scatter src = explicit symbolic]'
        tex += 'coordinates {(' + str(arr_x[0].evalf()) + ',' + str(arr_y[0]) + ')[a](' + str(arr_x[1].evalf()) + ',' + str(arr_y[1]) + ')[a]};'
    tex += '\\end{axis}'
    tex += '\\end{tikzpicture}'
    tex += '\\end{figure}'
    tex += '\\end{document}'
    #rint tex
    return tex2base64(tex)
