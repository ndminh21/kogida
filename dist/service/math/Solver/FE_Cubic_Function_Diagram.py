import numpy as np
from sympy import *
import base64
from io import BytesIO

def cubicdiagram(function, arr_fig, point, delta):
    x, y = symbols("x y")
    a = arr_fig[0]
    b = arr_fig[1]
    c = arr_fig[2]
    exp = nsimplify(function)
    if len(point) == 1:
        x_diagram_min = point[0] - delta
        x_diagram_max = point[0] + delta
        y_1 = exp.subs(x, point[0])
        y_diagram_max = y_1 + delta
        y_diagram_min = y_1 - delta
    else:
        x_diagram_min = point[0] - delta
        x_diagram_max = point[1] + delta
        y_1 = exp.subs(x, point[0])
        y_2 = exp.subs(x, point[1])
        if y_1 > y_2:
            y_diagram_max = y_1 + delta
            y_diagram_min = y_2 - delta
        else:
            y_diagram_max = y_2 + delta
            y_diagram_min = y_2 - delta

    x, y = symbols("x y")
    p1 = plot_implicit(Eq(y, simplify(function)), (x, int(x_diagram_min), int(x_diagram_max)), (y, int(y_diagram_min), int(y_diagram_max)), show=False, line_color='k')
    backend = p1.backend(p1)
    backend.process_series()
    figfile = BytesIO()
    backend.fig.savefig(figfile, format='png')
    figfile.seek(0)
    figdata_png = base64.b64encode(figfile.getvalue())
    return figdata_png
        
