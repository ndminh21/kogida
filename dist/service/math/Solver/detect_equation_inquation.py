from sympy import *
import re

# true: equation
# false: inequation

def detect_eq_inqe(function):
    simplify_function = str(simplify(function))
    match = re.search(r'<=', simplify_function)
    if match:
        return False

    match = re.search(r'>=', simplify_function)
    if match:
        return False

    match = re.search(r'<', simplify_function)
    if match:
        return False

    match = re.search(r'>', simplify_function)
    if match:
        return False

    return True