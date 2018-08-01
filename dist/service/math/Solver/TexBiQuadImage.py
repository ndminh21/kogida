from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from converter import tex2base64


def RenderTexBiQuad(arr_fig, xleft, xright, ytop, ybot, delta,arr_x,arr_y,functionLatex):
    a = arr_fig[0]
    b = arr_fig[1]
    c = arr_fig[2]
    xleft = int(floor(xleft))
    xright = int(ceiling(xright))
    ytop = int(ceiling(ytop))
    ybot = int(floor(ybot))
    if xleft > -2:
        xleft = -2
    if xright < 2:
        xright = 2

    if (Mod(xleft, 2)) != 0:
        xleft += -1

    if (Mod(xright, 2)) != 0:
        xright += 1
    
    if (Mod(ytop, 2)) != 0:
        ytop = ytop + 1
    
    if (Mod(ybot, 2)) != 0:
            ybot = ybot - 1
    
    if (ybot > -2):
        ybot = -2

    if (ytop < 2):
        ytop = 2


    deltaxStr = '(' + str(xright) + "-" + str(xleft) + ')/10'
    deltayStr = '(' + str(ytop) + "-" + str(ybot) + ')/10'
    detalx = parse_expr(deltaxStr).evalf(3)
    if (detalx < 0.5):
        detalx = 0.5
    else:
        detalx = int(round(parse_expr(deltaxStr).evalf(3)))
    detaly = parse_expr(deltayStr).evalf(3)
    if (detaly < 0.5):
        detaly = 0.5
    else:
        detaly = int(round(parse_expr(deltayStr).evalf(3)))
    tex = '\\documentclass[preview]{standalone}'
    tex += '\\usepackage[hmargin = 0cm, vmargin = 0cm]{geometry}'
    tex += '\\usepackage{tikz}'
    tex += '\\usepackage{pgfplots}'
    tex += '\\begin{document}'
    tex += '\\begin{figure}[h!tbp]'
    tex += '\\centering'
    tex += '\\begin{tikzpicture}'
    tex += '\\begin{axis}['
    tex += 'height = 15cm,'
    tex += 'domain=' + str(xleft+delta) + ':' + str(xright-delta) + ','
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
    if(len(arr_x) == 3):
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[0])  + ','+ str(arr_y[0]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {A};}]'
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[1])  + ','+ str(arr_y[1]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {B};}]'
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[2])  + ','+ str(arr_y[2]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {C};}]'
    else:
        tex += 'after end axis/.code = {\\path (axis cs:'+ str(arr_x[0])  + ','+ str(arr_y[0]) + ') node [anchor = south west, yshift = 0.075cm, xshift = 0.075cm] {A};}]'
    tex += '\\addplot[color = red, thick, samples = 201] {' + str(a) + '*x*x*x*x + ' + str(b) + '*x*x+' + str(c) + '};'
    tex += '\\legend{$' + functionLatex + '$}'
    tex += '\\addplot[scatter, only marks,scatter src = explicit symbolic]'
    if(len(arr_x) == 3):
        tex += 'coordinates {(' + str(arr_x[0]) + ',' + str(arr_y[0]) + ')[a](' + str(arr_x[1]) + ',' + str(arr_y[1]) + ')[a](' + str(arr_x[2]) + ',' + str(arr_y[2]) + ')[a]};'
    else:
        tex += 'coordinates {(' + str(arr_x[0]) + ',' + str(arr_y[0]) + ')[a]};'
    tex += '\\end{axis}'
    tex += '\\end{tikzpicture}'
    tex += '\\end{figure}'
    tex += '\\end{document}'

    return tex2base64(tex)
