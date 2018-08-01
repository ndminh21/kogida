from sympy import *
from Solver.solver import solver

fname = "inputin.txt"

def test_eq():
    with open(fname) as f:
        content = f.readlines()
        for exp in content:
            function = (str(exp).replace('\n', ''))
            solver(function)
            print('======x======')
            print()
test_eq()
