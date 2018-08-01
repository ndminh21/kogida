import sys
import json
from sympy import *
from latex2sympy.process_latex import process_sympy
from sympy.parsing.sympy_parser import parse_expr
from sympy.solvers.solvers import denoms
from copy import copy, deepcopy
x, y, z, t = symbols('x y z t')
bien1, bien2, bien3, bien4, bien5, bien6 = symbols(
    'bien1 bien2 bien3 bien4 bien5 bien6')


# Read data from stdin

M = Matrix([[1, 2, 3], [4, 5, 6]])


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])



def main():
    data = read_in()

    results = process_sympy(data['latex2sympy'])
    print json.dumps(results)

    

if __name__ == '__main__':
    main()


#mtx = [[1, 0, 1, 3], [2, 3, 4, 7], [-1, -3, -3, -4]]

#M = Matrix([[1, 0, 1, 3], [2, 3, 4, 7], [-1, -3, -3, -4]])
