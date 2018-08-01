# Classification Equation
# input: fuction
# output:
#     1: poly equation
#     2: trigonometic equation
#     3: redical equation

from sympy import *
import re

def deetect_trigonometic(function):
    match = re.search(r'sin', function)
    if match:
        return True
    match = re.search(r'cos', function)
    if match:
        return True
    match = re.search(r'tan', function)
    if match:
        return True
    match = re.search(r'cot', function)
    if match:
        return True
    return False

def detect_redical(function):
    match = re.search(r'sqrt\([^)]*x', function)
    if match:
        return True
    match = re.search(r'x\*\*\(1/\d+\)', function)
    if match:
        return True
    match = re.search(r'\([^(]*x[^(]*\)\*\*\(1/\d+\)', function)
    if match:
        return True
    return False

def detect_poly(function):
    simplify_function = simplify(function)
    if simplify_function.lhs.is_polynomial() and simplify_function.rhs.is_polynomial():
        return True
    else:
        return False

def detect_abs(function):
    simplify_function = nsimplify(function)
    match = re.search(r'Abs', str(simplify_function))
    if match:
        return True
    else:
        return False

def classcification_eq(function):
    if deetect_trigonometic(function):
        return 2 # luong giac
    elif detect_redical(function):
        return 3 # can thuc
    elif detect_abs(function):
        return 5 # da thuc
    elif detect_poly(function):
        return 1 # tri tuyet doi
    else:
        return 4 # phan thuc
