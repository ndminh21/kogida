import json
from sympy import *
import time

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
def root_accept_json(arr):
    childs = []
    for item in arr:
        data = {}
        data["val"] = "(0;"+latex(item)+")"
        data["accept"] = "yes"
        childs.append(data)
    returndata = {}
    returndata["root"] = childs
    return returndata

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

def solve_eq_step_root_y(func1, func2, varList):
    root_1 = []
    root_2 = []
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(func1," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) > 0:
        for item in result:
            root_1.append(item)

    exec ("result = solveset(func2," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) > 0:
        for item in result:
            root_2.append(item)
    root= []
    for item in root_1:
        if item in root_2:
            root.append(item)
    return root



def first_step_super2(arr_eq, arr_var, classification):
    step = []
    step.append(case_json(Eq(simplify(arr_var[0]), 0)))
    first = classification["first_eq"]
    new_first = Eq(first.lhs.subs({simplify(arr_var[0]): 0}), first.rhs)
    second = classification["second_eq"]
    new_second = Eq(second.lhs.subs({simplify(arr_var[0]): 0}), second.rhs)
    step.append(start_case(and_json([eq_json(new_first), eq_json(new_second)])))
    res_first = solve_eq_step(new_first,[arr_var[1]])
    res_second = solve_eq_step(new_second,[arr_var[1]])
    step.append(and_json([res_first, res_second]))

    y_res = solve_eq_step_root_y(new_first, new_second, [arr_var[1]])
    if len(y_res) == 0:
        step.append(end_case(case_accpet_json(Eq(simplify(arr_var[0]), 0), "no")))
    else:
        step.append(end_case(root_accept_json(y_res)))
    return step

# def solve_eq_step(function, varList):
#     for varName in varList:
#         exec (varName + "=Symbol(varName)")
#     exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
#     if len(result) == 0:
#         return False
#     elif len(result) == 1:
#         for item in result:
#             return eq_json_2(simplify(varList[0]), item)
#     else:
#         childs = []
#         for item in result:
#             childs.append(eq_json_2(simplify(varList[0]), item))
#         return or_json(childs)

def solve_eq_step_t(function, varList, t_val):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) == 1:
        for item in result:
            return and_json([eq_json_2(simplify(varList[0]), item), eq_json_2(simplify(varList[1]), item*t_val)])
    else:
        childs = []
        for item in result:
            childs.append(and_json([eq_json_2(simplify(varList[0]), item), eq_json_2(simplify(varList[1]), item*t_val)]))
        return longor_json(childs)

def solve_eq_step_root(function, varList, t_val):
    root = []
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) > 0:
        for item in result:
            root.append([latex(item), latex(item*t_val)])
    return root



def second_step_super2(arr_eq, arr_var, classification):
    step = []
    step.append(ineq_case_json(simplify(arr_var[0]), 0))
    t = Symbol('t')
    new_var = t*simplify(arr_var[0])
    new_var_expr =  Eq(simplify(arr_var[1]), new_var)
    step.append(eq_json_alias(new_var_expr))

    first = classification["first_eq"]
    new_first_lhs = first.lhs.subs({simplify(arr_var[1]): new_var})
    new_first = Eq(new_first_lhs, first.rhs)
    second = classification["second_eq"]
    new_second_lhs = second.lhs.subs({simplify(arr_var[1]): new_var})
    new_second = Eq(new_second_lhs, second.rhs)

    step.append(syseq_json_start_alias([eq_json(new_first), eq_json(new_second)]))

    new_first = Eq(factor(new_first_lhs), first.rhs)
    new_second = Eq(factor(new_second_lhs), second.rhs)
    step.append(and_json([eq_json(new_first), eq_json(new_second)]))

    new_rational = ""
    if second.rhs != 0:
        new_rational = Eq(factor(new_first_lhs)/factor(new_second_lhs), first.rhs/second.rhs)
    else:
        new_rational = Eq(factor(new_second_lhs) / factor(new_first_lhs), second.rhs / first.rhs)
    step.append(eq_json(new_rational))
    step.append(solve_eq_step(new_rational, ['t']))

    result = solveset(new_rational, t,domain=S.Reals)
    set_res = []
    for item in result:
        step.append(case_json(Eq(t, item)))
        first_lhs = new_first.lhs.subs({t: item})
        second_lhs = new_second.lhs.subs({t: item})
        if eq_json(Eq(first_lhs, new_first.rhs)) == False:
            stop = 1
        elif Eq(second_lhs, new_second.rhs) == False:
            stop = 1
        elif Eq(second_lhs, new_second.rhs) == True:
            # step.append(eq_json(Eq(first_lhs, new_first.rhs)))
            # step.append(solve_eq_step(Eq(first_lhs, new_first.rhs), [arr_var[0]]))

            step.append(start_case(solve_eq_step_t(Eq(first_lhs, new_first.rhs), arr_var, item)))
            for res in solve_eq_step_root(Eq(first_lhs, new_first.rhs), arr_var, item):
                set_res.append(res)
        elif eq_json(Eq(first_lhs, new_first.rhs)) == True:
            # step.append(eq_json(Eq(second_lhs, new_second.rhs)))
            # step.append(solve_eq_step(Eq(second_lhs, second_lhs.rhs), [arr_var[0]]))

            step.append(start_case(solve_eq_step_t(Eq(second_lhs, second_lhs.rhs), arr_var, item)))
            for res in solve_eq_step_root(Eq(second_lhs, second_lhs.rhs), arr_var, item):
                set_res.append(res)
        # step.append(and_json([eq_json(Eq(first_lhs, new_first.rhs)), Eq(second_lhs, new_second.rhs)]))
        # print step
        # step.append(solve_eq_step(Eq(first_lhs, new_first.rhs), [arr_var[0]]))
    datareturn = {}
    datareturn["step"] = step
    datareturn["root"] = set_res
    return datareturn

def eqsys_super2(arr_eq, arr_var, classification):
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
            step.append(and_json(childs))

    first_step = first_step_super2(arr_eq, arr_var, classification)
    for item in first_step:
        step.append(item)

    second_step = second_step_super2(arr_eq, arr_var, classification)
    for item in second_step["step"]:
        step.append(item)
    for item in second_step["root"]:
        root.append(item)

    data = {}
    data["step"] = step
    data["root"] = root
    data["time"] = time.time() - start_time
    data["classification"] = "eqsys_super2"
    data["category"] = "eqsys"
    json_data = json.dumps(data)
    return json_data