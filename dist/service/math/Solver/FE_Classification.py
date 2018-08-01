from sympy import *
import re
x = Symbol('x')

# 1. Linear function
# 2. Quadratic function
# 3. Cubic Function
# 4. Linear Rational Function
# 5. Biquadratic function
# 6. QuadraticAndLinearRationalFunction
# 7. Not support

def classification(function):
    simplify_function = nsimplify(function)
    try:
        degree_function = degree(simplify_function)
    except Exception, e:
        return 7
    if simplify_function.is_polynomial(x):
        if degree_function == 1:
            return 1
        elif degree_function == 2:
            return 2
        elif degree_function == 3:
            return 3
        elif degree_function == 4:
            figure = Poly(simplify_function, x).all_coeffs()
            if figure[1] == 0 and figure[3] == 0:
                return 5
            else:
                return 7
        else:
            return 7
    elif simplify_function.is_rational_function():
        numerator = numer(simplify_function)
        denominator = denom(simplify_function)
        if degree(numerator, x) == 1 and degree(denominator, x) == 1:
            return 4
        elif degree(numerator, x) == 2 and degree(denominator, x) == 1:
            return 6
        else:
            return 7
