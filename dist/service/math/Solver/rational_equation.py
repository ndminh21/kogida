from sympy import *
import json
import time
from poly_equation import poly_equation
from sympy.parsing.sympy_parser import parse_expr


def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data


def eq_json2(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["eq"] = data
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


def or_json(arr):
    data = {}
    data["or"] = arr
    return data


def null_eq_json():
    data = {}
    res_data = {}
    res_data["val"] = "null"
    data["eq"] = res_data
    return data


def get_condition(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    check_function = Eq(function, 0)
    condition = []
    try:
        exec ("results = solveset(check_function," + str(varList[0]) + ",domain=S.Reals)")
    except Exception, e:
        return condition
    for res in results:
        condition.append(ne_json(str(varList[0]), res))
    return condition


def get_result_after_check_condition(function, varList, condition):
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    try:
        exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    except Exception, e:
        return data
    arr_res = []
    if len(results) == 0:
        return null_eq_json()
    else:
        for res in results:
            exec ("is_fail = condition.subs({ str(varList[0]) : res }  )")
            if is_fail != 0:
                arr_res.append(res)
    if len(arr_res) == 0:
        return null_eq_json()
    elif len(arr_res) == 1:
        for res in arr_res:
            data = eq_json(simplify(str(varList[0])), simplify(res))
    else:
        res_data = []
        for res in arr_res:
            res_data.append(eq_json(simplify(str(varList[0])), simplify(res)))
        data["or"] = res_data
    return data


def steps_rational_equation(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")

    step = []

    # conditions = condition_rational(function, varList)
    # for item in conditions:
    #     step.append(item)

    original_function = parse_expr(str(function))
    # step.append(eq_json2(original_function))

    new_function = simplify(function)
    left_expr = new_function.lhs
    right_expr = new_function.rhs

    if right_expr != 0 and str(new_function) != str(original_function):
        step.append(eq_json2(new_function))

    conditions = condition_rational(function, varList)
    for item in conditions:
        step.append(item)

    function = simplify(cancel(left_expr - right_expr))

    numer_function = numer(function)

    # step.append(and_json([ne_json(denom_function, 0), eq_json(numer_function, 0)]))

    solve_poly = poly_equation(Eq(numer_function, 0), varList)
    solve_data = json.loads(solve_poly)
    result_poly = solve_data["step"]

    # arr_condition = get_condition(denom_function, varList)
    # if len(arr_condition) > 0:
    #     for idx, sol in enumerate(result_poly):
    #         arr_one_step = []
    #         for cond in arr_condition:
    #             arr_one_step.append(cond)
    #         arr_one_step.append(sol)
    #         step.append(and_json(arr_one_step))
    #
    #     step.append(get_result_after_check_condition(function, varList, denom_function))
    # else:
    #     for idx, sol in enumerate(result_poly):
    #         step.append(sol)

    for idx, sol in enumerate(result_poly):
        step.append(sol)
    return step

def condition_rational(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")

    condition = []
    condition_expr = []
    condition_result = []
    original_function = parse_expr(str(function))

    left_original_function = original_function.lhs
    right_original_function = original_function.rhs

    arr_condition = []
    arr_results = []

    for item in left_original_function.args:
        denom_item = denom(item)
        if denom_item not in arr_condition and denom_item != 1:
            arr_condition.append(denom_item)

    for item in right_original_function.args:
        denom_item = denom(item)
        if denom_item not in arr_condition and denom_item != 1:
            arr_condition.append(denom_item)
    for item in arr_condition:
        condition_expr.append(ne_json(item, 0))
        try:
            exec ("results = solveset(item," + str(varList[0]) + ",domain=S.Reals)")
            for res in results:
                arr_results.append(res)
        except Exception, e:
            error = 0
    for item in arr_results:
        condition_result.append(ne_json(simplify(str(varList[0])), item))
    condition_1 = {}
    condition_1["condition"] = condition_expr
    condition_2 = {}
    condition_2["condition"] = condition_result

    condition.append(condition_1)
    condition.append(condition_2)
    return condition

def root_rational(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data = []
    for item in results:
        data.append(latex(item))
    return data

def rational_equation(function, varList):
    start_time = time.time()
    data = {}
    # data["condition"] = condition_rational(function, varList)
    data["step"] = steps_rational_equation(function, varList)
    data["root"] = root_rational(function, varList)
    data["time"] = time.time() - start_time
    data["classification"] = "P1"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data