from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from converter import tex2base64


def RenderTexQuadRationalLinear(arr_fig, xleft, xright, ytop, ybot,functionLatex):
    a = arr_fig[0]
    b = arr_fig[1]
    c = arr_fig[2]
    d = arr_fig[3]
    e = arr_fig[4]
    alpha = arr_fig[5]
    beta = arr_fig[6]
    tcn = a / c
    tcd = -d / c

    Ix = -e/d
    Iy = alpha * Ix + beta
    if(Ix < 0):
        xleft = int(floor(xleft)) - 2*abs(Ix)
        xright = int(ceiling(xright)) + abs(Ix)
    else:
        xleft = int(floor(xleft)) -  abs(Ix)
        xright = int(ceiling(xright)) + 2*abs(Ix)
    ytop = int(ceiling(ytop)) + abs(2*Iy)
    ybot = int(floor(ybot)) - abs(2*Iy)
    if (ybot > -2):
        ybot = -2   

    if (ytop < 2):
        ytop = 2

    if xleft > -2:
        xleft = -2
    if xright < 2:
        xright = 2

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
    tex += 'after end axis/.code = {\\path (axis cs: ' + str(Ix) + ',' + str(Iy) + ') node [anchor = south west, yshift = -0.075cm, xshift = 0.075cm] {I};}]'
    tex += '\\addplot[color = red, thick, samples = 201] {(' + str(a) + '*x*x + ' + str(b) + '*x+' +str(c) + ')/(' + str(d) + '*x+' + str(e) + ')};'
    tex += '\\legend{$' + functionLatex + '$}'
    tex += '\\addplot[scatter, only marks,scatter src = explicit symbolic]'
    tex += 'coordinates {(' + str(Ix) + ',' + str(Iy) + ')[a]};'
    tex += '\\addplot[color = red, thick, samples = 201] {' + str(alpha)  + '*x+' + str(beta) + '};'
    tex += '\\end{axis}'
    tex += '\\end{tikzpicture}'
    tex += '\\end{figure}'
    tex += '\\end{document}'
    return tex2base64(tex)
