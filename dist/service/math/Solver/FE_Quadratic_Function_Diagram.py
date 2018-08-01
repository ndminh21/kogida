import numpy as np
from sympy import *
import base64
from io import BytesIO
x = Symbol('x')
def quaraticdiagram(function, arr_fig, point, delta):
    a = arr_fig[0]
    b = arr_fig[1]
    c = arr_fig[2]
    x_diagram_min = point[0] + delta
    x_diagram_max = point[0] - delta
    if a > 0:
        y_diagram_min = point[1] + delta/4 - abs(c)
        y_diagram_max = point[1] + delta*4 + abs(c)
    else:
        y_diagram_min = point[1] - delta*4 - abs(c)
        y_diagram_max = point[1] - delta/4 + abs(c)
    x, y = symbols("x y")
    p1 = plot_implicit(Eq(y, simplify(function)), (x, int(x_diagram_min), int(x_diagram_max)), (y, int(y_diagram_min), int(y_diagram_max)), show=False, line_color='k')
    backend = p1.backend(p1)
    backend.process_series()
    figfile = BytesIO()
    backend.fig.savefig(figfile, format='png')
    figfile.seek(0)
    figdata_png = base64.b64encode(figfile.getvalue())
    return figdata_png
        
