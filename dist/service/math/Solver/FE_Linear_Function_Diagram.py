import numpy as np
from sympy import *
import base64
from io import BytesIO
x = Symbol('x')
font = {'family': 'Times New Roman',
            'color':  'black',
            'weight': 'normal',
            'size': 12,
        }

font2 = {'family': 'Times New Roman',
            'color':  'black',
            'weight': 'normal',
            'size': 10,
        }

def lineardiagram(function, ox, oy, delta):
        x_focus = ox/2
        y_focus = oy/2
        k = (x_focus/y_focus)
        x_diagram_min = x_focus - abs(k)*(delta) - abs(x_focus)
        x_diagram_max = x_focus + abs(k)*delta + abs(x_focus)

        y_diagram_min = y_focus - abs(1/k) * (delta) - abs(y_focus)
        y_diagram_max = y_focus + abs(1/k) * delta + abs(y_focus)

        x, y = symbols("x y")
        p1 = plot_implicit(Eq(y, simplify(function)), (x, x_diagram_min, x_diagram_max), (y, y_diagram_min, y_diagram_max), show=False, line_color='k')
        backend = p1.backend(p1)
        backend.process_series()
        # plt.figure()
        figfile = BytesIO()
        backend.fig.savefig(figfile, format='png')
        figfile.seek(0)
        figdata_png = base64.b64encode(figfile.getvalue())
        return figdata_png

        # x = np.arange(x_diagram_min, x_diagram_max , 0.001)
        # exec ("y = " + function)
        # y_range = np.arange(y_diagram_min -1, y_diagram_max +1, 0.001)
        # axis_y = y_range * 0

        # x_range = np.arange(x_diagram_min -1, x_diagram_max +1, 0.001)
        # axis_x = x_range * 0
        # # plt.legend(['y = x^3-x^2-x+1', 'y = x^3'])
        # plt.plot(x, y,'k-', linewidth=1.0)  # ,[1, -0.32], [0, 1.2], 'ko')
        # plt.plot(x_range, axis_x, 'k-', linewidth=0.7)
        # plt.plot(axis_y, y_range, 'k-', linewidth=0.7)
        # # plt.plot(ox,0,'ko', linewidth=0.7)
        # plt.scatter(ox, 0, s=5, c='k')
        # plt.scatter(0, oy, s=5, c='k')
        # # plt.text(ox, 0.2, r'$A$', fontdict=font)
        # # plt.text(-0.2, oy, r'$B$', fontdict=font)
        # # plt.text(ox+delta, oy+delta, r'$y=' + function + '$', fontdict=font)
        # if abs(ox) >= 3:
        #         plt.text(-0.3, -0.4, r'$0$', fontdict=font2)
        # else:
        #         plt.text(-0.2, -0.35, r'$0$', fontdict=font2)
        # plt.text(ox, -0.35, r'$' + str(ox) + '$', fontdict=font2)
        # plt.text(0.1, oy, r'$' + str(oy) + '$', fontdict=font2)
        # plt.text(0.1, y_diagram_max + 1, r'$y$', fontdict=font)
        # plt.text(x_diagram_max + 1, 0.1, r'$x$', fontdict=font)
        # plt.title('')
        # plt.autoscale(False)
        # plt.xlabel('x')
        # plt.ylabel('y')
        # plt.axis('off')
        # plt.arrow(x_diagram_max + 1, -0.003, 0.1, 0, width=0.0015, color="k", clip_on=False, head_width=0.1, head_length=0.12)
        # plt.arrow(0.003, y_diagram_max +1, 0, 0.1, width=0.0015, color="k", clip_on=False, head_width=0.1, head_length=0.12)

        # figfile = BytesIO()
        # plt.savefig(figfile, format='png')
        # figfile.seek(0)
        # figdata_png = base64.b64encode(figfile.getvalue())
        # return figdata_png