import numpy as np
from sympy import *
import base64
from io import BytesIO
x = Symbol('x')
def linearrationaldiagram(function, tcd, tcn):
    x, y = symbols("x y")
    p1 = plot(simplify(function), (x, int(tcd)-10, int(tcd)+10), ylim=(int(tcn)-10, int(tcn)+10), show=False, line_color='k')
    p2 = plot_implicit(Eq(y,tcn), (x,int(tcd)-10,int(tcd)+10), (y,int(tcn)-10,int(tcn)+10), show=False, line_color='k')
    p1.append(p2[0])
    backend = p1.backend(p1)
    backend.process_series()
    figfile = BytesIO()
    backend.fig.savefig(figfile, format='png')
    figfile.seek(0)
    figdata_png = base64.b64encode(figfile.getvalue())
    return figdata_png
        
