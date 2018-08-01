import json
from sympy import *
import time

def eq_json(eq):
    data = {}
    data["val"] = latex(eq)
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_lhs_rhs(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data
def and_json(arr):
    data = {}
    data["and"] = arr
    return data

def start_and_json(arr):
    data = {}
    data["start"] = and_json(arr)
    return data

def or_json(arr):
    data = {}
    data["or"] = arr
    return data

def var_viet_json(arr):
    data = {}
    data["var_viet"] = arr
    return data

def start_viet_json(eq):
    data = {}
    data["start_viet"] = eq_json(eq)
    return data

def longor_json(arr):
    data = {}
    data["longor"] = arr
    return data

def end_viet_longor(arr):
    data = {}
    data["end_viet"] = longor_json(arr)
    return data

def solve_eq_step(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) == 1:
        for item in result:
            return eq_json_lhs_rhs(simplify(varList[0]), item)
    else:
        childs = []
        for item in result:
            childs.append(eq_json_lhs_rhs(simplify(varList[0]), item))
        return or_json(childs)

def solve_eq_viet(function, var, arr_var):
    for varName in arr_var:
        exec (varName + "=Symbol(varName)")
    for varName in var:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(var[0]) + ",domain=S.Reals)")
    datareturn = {}
    root = []
    if len(result) == 0:
        return False
    elif len(result) == 1:
        for item in result:
            childs1 = []
            childs1.append(eq_json_lhs_rhs(simplify(arr_var[0]), item))
            childs1.append(eq_json_lhs_rhs(simplify(arr_var[1]), item))
            datareturn["eq_viet"] = end_viet_longor(and_json(1))
            root.append(latex(item), latex(item))
            datareturn["root"] = root
            return datareturn
    else:
        childs = []
        for item in result:
            childs.append(item)
        childs1 = []
        childs1.append(eq_json_lhs_rhs(simplify(arr_var[0]), childs[0]))
        childs1.append(eq_json_lhs_rhs(simplify(arr_var[1]), childs[1]))
        root.append([latex(childs[0]), latex(childs[1])])

        childs2 = []
        childs2.append(eq_json_lhs_rhs(simplify(arr_var[0]), childs[1]))
        childs2.append(eq_json_lhs_rhs(simplify(arr_var[1]), childs[0]))
        datareturn["eq_viet"] = end_viet_longor([and_json(childs1), and_json(childs2)])
        root.append([latex(childs[1]), latex(childs[0])])
        datareturn["root"] = root
        return datareturn

def eqsys_viet1(arr_eq, arr_var, classification):
    start_time = time.time()
    step = []
    for idx, item in enumerate(classification["step_change"]):
        if idx == 0:
            childs = []
            for eq in item:
                childs.append(eq_json(eq))
            step.append(start_and_json(childs))
        else:
            childs = []
            for eq in item:
                childs.append(eq_json(eq))
            step.append(and_json(childs))

    S = classification["s_eq"].rhs
    P = classification["p_eq"].rhs
    X = Symbol('X')
    new_func = Eq(X**2-S*X+P, 0)
    step.append(var_viet_json(arr_var))
    step.append(start_viet_json(new_func))
    step.append(solve_eq_step(new_func, ['X']))
    step_root = solve_eq_viet(new_func, ['X'], arr_var)
    step.append(step_root["eq_viet"])
    data = {}
    data["step"] = step
    data["root"] = step_root["root"]
    data["time"] = time.time() - start_time
    data["classification"] = "eqsys_viet1"
    data["category"] = "eqsys"
    json_data = json.dumps(data)
    return json_data