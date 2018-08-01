from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from converter import tex2base64


def RenderTexQuad(arr_fig, point, delta, y,functionLatex):
    a = parse_expr(arr_fig[0]).evalf(3)
    b = parse_expr(arr_fig[1]).evalf(3)
    c = parse_expr(arr_fig[2]).evalf(4)
    xleft = int(round(point[0] - delta - 1 - abs(c) / 4))
    xright = int(round(point[0] + delta + 1 + abs(c) / 4))

    if xleft > -2:
        xleft = -2
    if xright < 2:
        xright = 2


    if (Mod(xleft, 2)) != 0:
            xleft +=  -1

    if (Mod(xright, 2)) != 0:
            xright += 1

    if a > 0:
        ybot = int(floor(point[1]))
        if (Mod(ybot, 2)) != 0:
            ybot = ybot - 1
        ytop = int(ceiling(y))
        if (Mod(ytop, 2)) != 0:
            ytop = ytop + 1
        if (ybot > -2):
            ybot = -2

        if (ytop < 2):
            ytop = 2

    else:
        ybot = int(floor(y)) 
        if (Mod(ybot,2)) != 0:
            ybot = ybot - 1
        ytop = int(ceiling(point[1]))
        if (Mod(ytop,2)) != 0:
            ytop = ytop + 1
        if (ybot > -2):
            ybot = -2

        if (ytop < 2):
            ytop = 2

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
    xleft = parse_expr(str(xleft)).evalf(4)
    xright = parse_expr(str(xright)).evalf(4)
    ytop = parse_expr(str(ytop)).evalf(4)
    ybot = parse_expr(str(ybot)).evalf(4)
    point[0] = parse_expr(str(point[0])).evalf(4)
    point[1] = parse_expr(str(point[1])).evalf(4)
    tex = '\\documentclass[preview]{standalone}'
    tex += '\\usepackage[hmargin = 0cm, vmargin = 0cm]{geometry}'
    tex += '\\usepackage{tikz}'
    tex += '\\usepackage{pgfplots}'
    tex += '\\begin{document}'
    tex += '\\begin{figure}[h!tbp]'
    tex += '\\centering'
    tex += '\\begin{tikzpicture}'
    tex += '\\begin{axis}['
    tex += 'scatter / classes = {a = {mark = square *, blue}},'
    tex += 'height = 15cm,'
    tex += 'domain=' + str(point[0] - (delta-1)-0.1) + ':' + str(point[0] + (delta-1) + 0.1) + ','
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
    tex += 'after end axis/.code = {\\path (axis cs: ' +str(point[0]) + ', ' + str(point[1])  + ') node [anchor = south west, yshift = 0.075cm, red] {I};}]'
    tex += '\\addplot[color = red, thick, samples = 201] {' + str(a) + '*x*x + ' + str(b) + '*x+' + str(c) + '};'
    tex += '\\legend{$' + functionLatex + '$}'
    tex += '\\addplot[scatter, only marks,scatter src = explicit symbolic]'
    tex += 'coordinates {('+str(point[0]) + ', ' + str(point[1]) + ')[a] };'
    tex += '\\end{axis}'
    tex += '\\end{tikzpicture}'
    tex += '\\end{figure}'
    tex += '\\end{document}'

    return tex2base64(tex)
