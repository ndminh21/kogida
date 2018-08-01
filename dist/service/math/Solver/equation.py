from poly_equation import *
from trigonometric_equation import *
from radical_equation import *
from classification_equation import *
from rational_equation import *
from EQ_Abs import *
import re

def solver_sqrt_function(function):
    match = re.search(r'^sqrt\([^)]+\)$', str(function))
    if match:
        new_function = simplify("("+str(function)+")**2")
        equation(new_function)
        return
    else:
        dm = 0
        # print('Result:', solve(function))

def equation(function, varList, angleMode):
    new_function = simplify(function)
    check_function = Eq(new_function.lhs - new_function.rhs, 0)
    # print(function, "= 0")

    classcifi = classcification_eq(str(simplify(check_function)))

    if classcifi == 1:
        return(poly_equation(function, varList))
    elif classcifi == 2:
        return trigo_equation(function, varList, angleMode)
    elif classcifi == 3:
        return radical_equation(function, varList)
    elif classcifi == 4:
        return rational_equation(function, varList)
    else:
        return abs_equation(function, varList)
        

