import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from TexLinearImage import RenderTexLinear
from TexQuadImage import RenderTexQuad
from TexCubicImage import RenderTexCubic
from TexBiQuadImage import RenderTexBiQuad
from TexLinearRationalImage import RenderTexLinearRational
from TexQuadRationalLinearImage import RenderTexQuadRationalLinear
from TexAnyFunctionImage import RenderAnyFunction
def texDiagram(diagramInput, classification):
    x = symbols('x')
    datareturn = {}
    try:
        if classification == "linearfunction":
            a = diagramInput["a"]
            b = diagramInput["b"]
            functionLatex = diagramInput["functionLatex"]
            datareturn["base64"] = RenderTexLinear(a, b, functionLatex)
        elif classification == "quadraticfunction":
            arr_fig = diagramInput["arr_fig"]
            point = []
            for re in diagramInput["point"]:
                point.append(parse_expr(re))
            delta = parse_expr(diagramInput["delta"])
            y =parse_expr(diagramInput["y"])
            functionLatex = diagramInput["functionLatex"]
            datareturn["base64"] = RenderTexQuad(arr_fig, point, delta, y, functionLatex)
        elif classification == "cubicfunction":
            arr_fig = diagramInput["arr_fig"]
            xleft = diagramInput["xleft"]
            xright = diagramInput["xright"]
            ybot = diagramInput["ybot"]
            ytop = diagramInput["ytop"]
            arr_x = []
            arr_y = []
            for re in diagramInput["arr_x"]:
                arr_x.append(parse_expr(re))
            for re in diagramInput["arr_y"]:
                arr_y.append(parse_expr(re))
            functionLatex = diagramInput["functionLatex"]
            datareturn["base64"] = RenderTexCubic(arr_fig, xleft,xright,ytop,ybot,1,functionLatex,arr_x,arr_y)
        elif classification == "biquadraticfunction":
            arr_fig = diagramInput["arr_fig"]
            xleft = diagramInput["xleft"]
            xright = diagramInput["xright"]
            ybot = diagramInput["ybot"]
            ytop = diagramInput["ytop"]
            arr_x = []
            arr_y = []
            for re in diagramInput["arr_x"]:
                arr_x.append(parse_expr(re).evalf(3))
            for re in diagramInput["arr_y"]:
                arr_y.append(parse_expr(re).evalf(3))
            functionLatex = str(diagramInput["functionLatex"])
            delta = parse_expr(diagramInput["delta"])
            datareturn["base64"] = RenderTexBiQuad(arr_fig, xleft, xright, ytop, ybot, delta, arr_x, arr_y,functionLatex)
            
        elif classification == "linearrationalfunction":
            arr_fig = diagramInput["arr_fig"]
            ybot = diagramInput["ybot"]
            ytop = diagramInput["ytop"]
            functionLatex = str(diagramInput["functionLatex"])
            datareturn["base64"] = RenderTexLinearRational(arr_fig,-5,5,ytop,ybot,functionLatex)
        elif classification == "quadraticandlinearrationalfunction":
            arr_fig = []
            for re in diagramInput["arr_fig"]:
                arr_fig.append(parse_expr(re))
            ybot = diagramInput["ybot"]
            ytop = diagramInput["ytop"]
            functionLatex = str(diagramInput["functionLatex"])
            datareturn["base64"] = RenderTexQuadRationalLinear(arr_fig,-5,5,ytop,ybot,functionLatex)
        elif classification == "nosupport":
            xmin = parse_expr(diagramInput["xmin"]).evalf(4)
            xmax = parse_expr(diagramInput["xmax"]).evalf(4)
            ymin = parse_expr(diagramInput["ymin"]).evalf(4)
            ymax = parse_expr(diagramInput["ymax"]).evalf(4)
            functionLatex = latex(parse_expr(diagramInput["functionSympy"])).replace("log","ln")
            latexExpr = diagramInput["latexExpr"]
            if(xmin >= xmax or ymin >= ymax):
                datareturn["status"] = "201"
            else:
                datareturn["status"] = 200
                datareturn["base64"] = RenderAnyFunction(xmin,xmax,ymin,ymax,functionLatex,latexExpr)
        return datareturn
    except Exception, e:
        datareturn["status"] = 201
        datareturn["e"] = str(e)
        return datareturn


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def main():
    data = read_in()
    results = texDiagram(data['diagramInput'], data['classification'])
    print json.dumps(results)


if __name__ == '__main__':
    main()
