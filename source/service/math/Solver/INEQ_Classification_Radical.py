from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import re

def detect_op(function):
    simplify_function = str(parse_expr(str(function), evaluate=False))
    match = re.search(r'<=', simplify_function)
    if match:
        return "<="
    else:
        match = re.search(r'>=', simplify_function)
        if match:
            return ">="
        else:
            match = re.search(r'<', simplify_function)
            if match:
                return "<"
            else:
                match = re.search(r'>', simplify_function)
                if match:
                    return ">"

def classification_radical(expr, varList):
    op = detect_op(expr)
    function = parse_expr(str(expr), evaluate=False)
    left_expr = function.lhs
    right_expr = function.rhs

    new_left = "0"
    new_right = "0"
    count_radical_left = 0
    count_radical_right = 0
    count_sqrt = [m.start() for m in re.finditer('sqrt', str(left_expr))]
    if len(count_sqrt) == 1 and len(left_expr.args) == 2:
        new_left += "+" + str(left_expr)
        count_radical_left += 1
    else:
        if right_expr.is_real == True:
            new_right += "-" + str(right_expr)
        else:
            for item in left_expr.args:
                try:
                    check_item = item
                    if str(item)[0] == "-":
                        check_item = - item
                    if str(check_item.args[1]) == "1/2":
                        new_left += "+" +str(item)
                        count_radical_left += 1
                    else:
                        new_right += "-" + str(item)
                except Exception:
                    new_right += "-" + str(item)
    count_sqrt = [m.start() for m in re.finditer('sqrt', str(right_expr))]
    if len(count_sqrt) == 1 and len(right_expr.args) == 2:
        new_left += "-" + str(right_expr)
        count_radical_right += 1

    else:
        if right_expr.is_real == True:
            new_right += "+" + str(right_expr)
        else:
            for item in right_expr.args:
                try:
                    check_item = item
                    if str(item)[0] == "-":
                        check_item = - item
                    if str(check_item.args[1]) == "1/2":
                        new_left += "-" + str(item)
                        count_radical_right += 1
                    else:
                        new_right += "+" + str(item)
                except Exception:
                    new_right += "+" + str(item)

    new_function = new_left + op + new_right
    try:
        pre_process_function = parse_expr(str(new_function), evaluate=False)
    except Exception:
        return function
    count_radical = count_radical_left + count_radical_right

    if count_radical == 1:

        data = {}
        data["original"] = function
        data["preprocess"] = pre_process_function
        data["op"] = op
        if op == ">":
            data["classification"] = "ineq_c1"
        elif op == ">=":
            data["classification"] = "ineq_c2"
        elif op == "<":
            data["classification"] = "ineq_c3"
        elif op == "<=":
            data["classification"] = "ineq_c4"
        return data

    elif count_radical == 2:
        data = {}
        data["original"] = function
        data["op"] = op
        if count_radical_left == 1:
            data["preprocess"] = function
        else:
            args = pre_process_function.lhs.args
            new_left = ""
            new_right = ""
            if str(args[0])[0] == "-":
                new_left = -args[0]
                new_right = args[1]
            else:
                new_left = args[0]
                new_right = -args[1]
            second_process = str(new_left) + op +str(new_right)
            last_function = parse_expr(str(second_process), evaluate=False)
            data["preprocess"] = last_function
        if op == "<":
            data["classification"] = "ineq_c5"
        elif op == "<=":
            data["classification"] = "ineq_c6"
        elif op == ">":
            data["classification"] = "ineq_c7"
        elif op == ">=":
            data["classification"] = "ineq_c8"
        return data
    else:
        data = {}
        data["classification"] = "nosuppot"
        return data