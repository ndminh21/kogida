import numpy as np
from sympy import *
import base64
from io import BytesIO
x = Symbol('x')
def quadraticandlinearrationaldiagram(function, tcd, tcx):
    x, y = symbols("x y")
    exp = nsimplify(function)
    y_1 = exp.subs(x, tcd + 1 )
    y_2 = exp.subs(x, tcd + 1 )
    lim_y =0
    if abs(y_1) > abs(y_2):
        lim_y = int(abs(y_1) *3)
    else:
        lim_y = int(abs(y_2) *3)
    p1 = plot(simplify(function), (x, int(tcd)-15, int(tcd)+15), ylim=(-lim_y, lim_y), show=False, line_color='k')
    p2 = plot_implicit(Eq(y,simplify(tcx)), (x,int(tcd)-15,int(tcd)+15), (y,-lim_y,lim_y), show=False, line_color='k')
    p1.append(p2[0])
    backend = p1.backend(p1)
    backend.process_series()
    figfile = BytesIO()
    backend.fig.savefig(figfile, format='png')
    figfile.seek(0)
    figdata_png = base64.b64encode(figfile.getvalue())
    return figdata_png
        
