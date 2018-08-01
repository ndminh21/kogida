from sympy import *
from preprocess import preprocess
from equation import equation
import re
import json

def detect_op(function):
    simplify_function = str(simplify(function))
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

def preprocess_inquetion(function):
    datareturn={}
    simplify_function = str(simplify(function))
    match_1 = re.search(r'=0$', simplify_function.replace(' ', ''))
    match_2 = re.search(r'<0$', simplify_function.replace(' ', ''))
    match_3 = re.search(r'>0$', simplify_function.replace(' ', ''))
    if match_1 or match_2 or match_3:
        datareturn['step'] = []
        datareturn['expression'] = str(simplify_function[: len(simplify_function)-4])
        datareturn['child'] = []
        json_data = json.dumps(datareturn)
        return json_data
    op = ""
    left = ""
    right = ""
    match = re.search(r'<=', simplify_function)
    if match:
        op = "<="
        index_op = simplify_function.index("<=")
        left = simplify_function[:index_op]
        right = simplify_function[index_op + 2:]
    else:
        match = re.search(r'>=', simplify_function)
        if match:
            op = ">="
            index_op = simplify_function.index(">=")
            left = simplify_function[:index_op]
            right = simplify_function[index_op + 2:]
        else:
            match = re.search(r'<', simplify_function)
            if match:
                op = "<"
                index_op = simplify_function.index("<")
                left = simplify_function[:index_op]
                right = simplify_function[index_op + 1:]
            else:
                match = re.search(r'>', simplify_function)
                if match:
                    op = ">"
                    index_op = simplify_function.index(">")
                    left = simplify_function[:index_op]
                    right = simplify_function[index_op + 1:]

    new_function = str(left) + '- (' + str(right) + ' ) ' + op + ' 0'
    expression = expand(simplify(str(left) + '- (' + str(right) + ' ) '))
    # print(new_function)
    simplify_function = simplify(new_function)
    # print(simplify_function)
    step = []
    step.append(str(new_function))
    step.append(str(simplify_function))
    step.append(str(expression)+' = 0')
    datareturn['step'] = step
    datareturn['expression'] = str(expression)
    json_data = json.dumps(datareturn)
    return json_data

def solve_poly_inequation(function):
    data = preprocess_inquetion(function)
    temp = str(data)
    abc = json.loads(temp)

    expression = abc["expression"]
    # print('Solve:')

    temp2 = equation(preprocess(expression))
    temp2 = str(temp2)
    temp3 = json.loads(temp2)

    datareturn = {}
    datareturn["step"] = abc["step"]
    datareturn["child"] = (temp3)
    json_data = json.dumps(datareturn)
    return json_data

def inequation(function):
    simplify_function = simplify(function)
    # print(simplify_function)
    step_child = solve_poly_inequation(simplify_function)
    step_child = str(step_child)
    abc = json.loads(step_child)
    result = solve_univariate_inequality(simplify(function), 'x')
    # print(result)
    datareturn = {}
    datareturn["function"] = str(simplify_function)
    datareturn["op"] = detect_op(simplify_function)
    datareturn["step"] = abc["step"]
    child = []
    child.append(abc["child"])
    datareturn["child"] = child
    datareturn["result"] = str(result)

    json_data = json.dumps(datareturn)

    return json_data