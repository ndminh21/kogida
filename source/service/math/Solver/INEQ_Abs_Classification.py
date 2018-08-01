from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import re


def pre_classification_abs_equation(function, varList):
    original_function = parse_expr(str(function), evaluate=False)
    datareturn = {}
    datareturn["original"] = original_function
    left = original_function.lhs
    right = original_function.rhs
    if len(left.args) == 1 and len(right.args) == 1:
        match = re.search(r'Abs', str(left))
        if match:
            match = re.search(r'Abs', str(right))
            if match:
                datareturn["lhs"] = left
                datareturn["rhs"] = right
                datareturn["change"] = "no"
                datareturn["classification"] = "eq_t2"
                return datareturn
            else:
                datareturn["lhs"] = left
                datareturn["rhs"] = right
                datareturn["change"] = "no"
                datareturn["classification"] = "eq_t1"
                return datareturn
    new_left = "0"
    new_right = "0"
    new_expr = left - right
    for item in new_expr.args:
        match = re.search(r'Abs', str(item))
        if match:
            new_left += "+" + str(item)
        else:
            new_right += "-" + str(item)
    new_left = simplify(new_left)
    new_right = simplify(new_right)

    if len(new_left.args) == 1:
        datareturn["lhs"] = new_left
        datareturn["rhs"] = new_right
        if str(new_left) != str(left) or str(new_right) != str(right):
            datareturn["change"] = "yes"
        else:
            datareturn["change"] = "no"
        datareturn["classification"] = "eq_t1"
        return datareturn
    elif new_right == 0 and len(new_left.args) == 2:
        datareturn["lhs"] = new_left.args[0]
        datareturn["rhs"] = - new_left.args[1]
        if str(new_left) != str(left) or str(new_right) != str(right):
            datareturn["change"] = "yes"
        else:
            datareturn["change"] = "no"
        datareturn["classification"] = "eq_t2"
        return datareturn
    else:
        datareturn["lhs"] = left
        datareturn["rhs"] = right
        datareturn["change"] = "yes"
        datareturn["classification"] = "nosupport"
    return datareturn

def classification_abs_equation(function, varList):
    datareturn = pre_classification_abs_equation(function, varList)

    original_function = parse_expr(str(function), evaluate=False)
    match = re.search(r'<=', str(original_function))
    if match:
        datareturn["op"] = "<="
        if datareturn["classification"] == "eq_t1":
            datareturn["classification"] = "ineq_t2"
        else:
            datareturn["classification"] = "ineq_t6"
    else:
        match = re.search(r'>=', str(original_function))
        if match:
            datareturn["op"] = ">="
            if datareturn["classification"] == "eq_t1":
                datareturn["classification"] = "ineq_t4"
            else:
                datareturn["classification"] = "ineq_t8"
        else:

            match = re.search(r'<', str(original_function))
            if match:
                datareturn["op"] = "<"
                if datareturn["classification"] == "eq_t1":
                    datareturn["classification"] = "ineq_t1"
                else:
                    datareturn["classification"] = "ineq_t5"
            else:

                match = re.search(r'>', str(original_function))
                if match:
                    datareturn["op"] = ">"
                    if datareturn["classification"] == "eq_t1":
                        datareturn["classification"] = "ineq_t3"
                    else:
                        datareturn["classification"] = "ineq_t7"
    return datareturn

# print classification_abs_equation("Abs(x-1)<5",['x'])
# print classification_abs_equation("Abs(x-1)>x",['x'])
# print classification_abs_equation("Abs(x-1)<=5",['x'])
# print classification_abs_equation("Abs(x-1)-5>=x",['x'])
# print classification_abs_equation("Abs(x-1)-x>5+2*x",['x'])
# print classification_abs_equation("Abs(x-1)>Abs(2*x+5)",['x'])
# print classification_abs_equation("Abs(x-1)-Abs(2*x+5)< 0",['x'])
