import json
from sympy import *
import time
from sympy.parsing.sympy_parser import parse_expr

def eq_json(eq):
    data = {}
    data["val"] = latex(eq)
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_2(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data

def case_json(eq):
    data = {}
    data["val"] = latex(eq)
    res_data = {}
    res_data["case"] = data
    return res_data

def case_accpet_json(eq, accept):
    data = {}
    data["val"] = latex(eq)
    data["accept"] = accept
    res_data = {}
    res_data["case"] = data
    return res_data
def root_accept_json(first, second, accept):
    data = {}
    data["val"] = "\\left("+ latex(first) +" ; "+latex(second)+"\\right)"
    data["accept"] = accept
    return data

def ineq_case_json(left, right):
    data = {}
    data["val"] = latex(left) + " \\ne " + latex(right)
    res_data = {}
    res_data["case"] = data
    return res_data

def syseq_json_start_alias(arr):
    res_data = {}
    res_data["start_alias"] = and_json(arr)
    return res_data

def consequence(arr):
    res_data = {}
    res_data["consequence"] = arr
    return res_data

def eq_json_alias(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["alias"] = data
    return res_data

def ne_json(left, right):
    data = {}
    data["val"] = latex(left) + " \\ne " + latex(right)
    res_data = {}
    res_data["neq"] = data
    return res_data

def and_json(arr):
    data = {}
    data["and"] = arr
    return data

def start_case_json(arr):
    data = {}
    data["start_case"] = and_json(arr)
    return data

def start_case(arr):
    data = {}
    data["start_case"] = arr
    return data

def end_case(arr):
    data = {}
    data["end_case"] = arr
    return data

def verify_json(arr):
    data = {}
    data["verify"] = arr
    return data

def eq_json_lhs_rhs(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data


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

def eqsys_sub1(arr_eq, arr_var, classification):
    start_time = time.time()
    step = []
    root = []
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
            step.append(consequence(and_json(childs)))

    cal_func = classification["second_eq"]
    sub_func = classification["first_eq"]
    arr_res_1 = solveset(cal_func, simplify(arr_var[0]) ,domain=S.Reals)
    res_1 = []
    res_2 = []
    for item in arr_res_1:
        res_1.append(item)
        res_2.append(sub_func.rhs.subs({simplify(arr_var[0]):item}))
    res_1_json = ""
    res_2_json = ""
    if len(res_1) == 1:
        res_1_json = eq_json_2(simplify(arr_var[0]), res_1[0])
        res_2_json = and_json([eq_json_2(simplify(arr_var[0]), res_1[0]), eq_json_2(simplify(arr_var[1]), res_2[0])])
    elif len(res_1) > 1:
        childs1 = []
        childs2 = []
        for idx, item in enumerate(res_1):
            childs1.append(eq_json_2(simplify(arr_var[0]), res_1[idx]))
            childs2.append(and_json([eq_json_2(simplify(arr_var[0]), res_1[idx]), eq_json_2(simplify(arr_var[1]), res_2[idx])]))
        res_1_json = or_json(childs1)
        res_2_json = or_json(childs2)
    step.append(and_json([eq_json(sub_func), res_1_json]))
    step.append(res_2_json)

    arr_root = []
    for idx, item in enumerate(res_1):
        valid = True
        for eq in arr_eq:
            original_function = parse_expr(str(eq), evaluate=False)
            check = original_function.subs({simplify(arr_var[0]): res_1[idx], simplify(arr_var[1]): res_2[idx]})
            if check == False:
                valid = False
        if valid:
            arr_root.append(root_accept_json(res_1[idx], res_2[idx], "yes"))
            root.append([latex(res_1[idx]), latex(res_2[idx])])
    step.append(verify_json(arr_root))
    data = {}
    data["step"] = step
    data["root"] = root
    data["time"] = time.time() - start_time
    data["classification"] = "eqsys_sub1"
    data["category"] = "eqsys"
    json_data = json.dumps(data)
    return json_data