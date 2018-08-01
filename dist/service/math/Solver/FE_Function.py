import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def main():
    data = read_in()
    root = {}
    dataDraw = data["xy"]
    xmin = parse_expr(dataDraw["xmin"])
    xmax = parse_expr(dataDraw["xmax"])
    ymin = parse_expr(dataDraw["ymin"])
    ymax = parse_expr(dataDraw["ymax"])
    if (xmin >= xmax or ymin >= ymax):
        root["message"] = "invalidrange"
    else:
        root["message"] = "valid"
    print json.dumps(root)

if __name__ == '__main__':
    main()
