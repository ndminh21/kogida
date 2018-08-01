from sympy import *
import json
from sympy.parsing.sympy_parser import parse_expr
import time
import re


# x = Symbol('x')

def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data


def eq_json_latex(str_latex):
    data = {}
    data["val"] = str_latex
    res_data = {}
    res_data["eq"] = data
    return res_data


def eq_json2(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def eq_json_alias(function):
    data = {}
    data["val"] = latex(function) + "\geq 0"
    res_data = {}
    res_data["alias"] = data
    return res_data

def eq_json_start_alias(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start_alias"] = data
    return res_data

def eq_json_check(name, val, accept):
    data = {}
    data["val"] = latex(Eq(name, val))
    data["accept"] = accept
    res_data = {}
    res_data["eq"] = data
    return res_data

def or_json(arr):
    data = {}
    data["or"] = arr
    return data

def eq_json_case(function, val):
    data = {}
    data["val"] = latex(Eq(function,val))
    res_data = {}
    res_data["case"] = data
    return res_data

def eq_json_start_case(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start_case"] = data
    return res_data

def solve_2_degree(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    function = str(nsimplify(function))
    figure = Poly(function, x).all_coeffs()
    a = figure[0]
    b = figure[1]
    c = figure[2]
    delta = b ** 2 - 4 * a * c
    data = {}
    data["val"] = latex(Eq(simplify(function), 0)) + "(\Delta = " + latex(delta) + " < 0)"
    res_data = {}
    res_data["eq"] = data
    return res_data


def json_result(results, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    data = {}
    if len(results) == 0:
        return data
        # res_data = {}
        # res_data["val"] = "null"
        # data["eq"] = res_data
    elif len(results) == 1:
        for re in results:
            data = eq_json(simplify(str(varList[0])), simplify(re))
    else:
        res_data = []
        for re in results:
            res_data.append(eq_json(simplify(str(varList[0])), simplify(re)))

        data["or"] = res_data
    return data

def get_arr_result(results, varList):
    data = []
    match = re.search(r'CRootOf', str(results))
    if match:
        return data
    for res in results:
        data.append(latex(res))
    return data

def json_poly(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    new_functions = []
    arr_factor = factor_list(function)
    for fac in arr_factor[1]:
        new_functions.append(fac[0] ** fac[1])

    childs = []
    for new_function in new_functions:
        temp = simplify(new_function)
        exec ("check = solveset(temp," + str(varList[0]) + ",domain=S.Reals)")
        if len(check) == 0 and degree(temp) == 2:
            childs.append(solve_2_degree(temp, varList))
        else:
            childs.append(eq_json(temp, 0))
    data = {}
    data["or"] = childs

    result = solveset(function, domain=S.Reals)

    datareturn = []
    datareturn.append(data)
    json_res = json_result(result, varList)
    if len(json_res) != 0:
        datareturn.append(json_res)

    return datareturn


def detail_poly(part_1_function, arr_count_factor):
    datareturn = []
    arr_latex_step_1 = []
    arr_temp_expr = []
    arr_item = []
    if len(arr_count_factor[0].args) > 0:
        for part in reversed(arr_count_factor[0].args):
            temp_expr = expand(part * arr_count_factor[1])
            arr_latex_step_1.append(latex(part) + " \left( " + latex(arr_count_factor[1]) + " \\right)")
            arr_temp_expr.append(temp_expr)
    else:
        part = arr_count_factor[0]
        temp_expr = expand(part * arr_count_factor[1])
        arr_latex_step_1.append(latex(part) + " \left( " + latex(expand(arr_count_factor[1])) + " \\right)")
        arr_temp_expr.append(temp_expr)
    for temp_expr in reversed(arr_temp_expr):
        for item in temp_expr.args:
            arr_item.append(item)
    if part_1_function != 1:
        right_latex = "\left("
        for idx, item in enumerate(reversed(arr_item)):
            if str(item)[0] != "-" and idx != 0:
                right_latex = right_latex + " + " + latex(item)
            else:
                right_latex = right_latex + " " + latex(item)
        right_latex = right_latex + " \\right)"

        if len(factor_list(part_1_function)[1]) == 1:
            left_latex = "\left(" + latex(part_1_function) + " \\right)"
        else:
            left_latex = latex(part_1_function)
    else:
        right_latex = ""
        for idx, item in enumerate(reversed(arr_item)):
            if str(item)[0] != "-" and idx != 0:
                right_latex = right_latex + " + " + latex(item)
            else:
                right_latex = right_latex + " " + latex(item)
        left_latex = ""
    str_latex = left_latex + right_latex + " = 0"

    if part_1_function != 1:
        right_latex_step_1 = " \left("
        for idx, item in enumerate(arr_latex_step_1):
            if str(item)[0] != "-" and idx != 0:
                right_latex_step_1 = right_latex_step_1 + " + " + item
            else:
                right_latex_step_1 = right_latex_step_1 + " " + item
        right_latex_step_1 = right_latex_step_1 + " \\right)"

        if len(factor_list(part_1_function)[1]) == 1:
            left_latex = "\left(" + latex(part_1_function) + " \\right)"
        else:
            left_latex = latex(part_1_function)
    else:
        right_latex_step_1 = ""
        for idx, item in enumerate(arr_latex_step_1):
            if str(item)[0] != "-" and idx != 0:
                right_latex_step_1 = right_latex_step_1 + " + " + item
            else:
                right_latex_step_1 = right_latex_step_1 + " " + item
        left_latex = ""
    str_latex_step_1 = left_latex + right_latex_step_1 + " = 0"
    if len(arr_item) > 0 :
        datareturn.append(eq_json_latex(str_latex))
    if len(arr_latex_step_1) > 0:
        datareturn.append(eq_json_latex(str_latex_step_1))
    return datareturn


def json_poly_equation(function, varList):
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)

    datareturn = []

    try:
        arr_factor = factor_list(factor(factor_function))[1]
    except Exception, e:
        return datareturn
    if simplify_function != factor_function:
        if len(arr_factor) == 2:
            part_1_function = simplify("1")
            arr_count_factor = []
            for idx, fac in enumerate(arr_factor):
                arr_count_factor.append(fac[0])
            arr_res = detail_poly(part_1_function, arr_count_factor)
            for res in arr_res:
                datareturn.append(res)

        if len(arr_factor) > 2:
            part_1_function = "1"
            for idx1, fac in enumerate(arr_factor):
                part_1_function = simplify(part_1_function) * simplify(fac[0]**fac[1])
                part_2_function = "1"
                count_factor = 0
                arr_count_factor = []
                for idx2, fac in enumerate(arr_factor):
                    if idx2 > idx1:
                        count_factor += 1
                        arr_count_factor.append(fac[0]**fac[1])
                        part_2_function = simplify(part_2_function) * simplify(fac[0]**fac[1])
                if count_factor == len(arr_factor) - 1:
                    new_arr_count_factor = []
                    new_expr = "1"
                    for idx, fac in enumerate(arr_count_factor):
                        new_expr = simplify(new_expr) * simplify(fac)
                    new_arr_count_factor.append(arr_factor[0][0])
                    new_arr_count_factor.append(expand(new_expr))
                    arr_res = detail_poly(simplify("1"), new_arr_count_factor)
                    for res in arr_res:
                        datareturn.append(res)
                if count_factor > 1:
                    datareturn.append(eq_json(part_1_function * expand(part_2_function), 0))
                if count_factor == 2:
                    arr_res = detail_poly(part_1_function, arr_count_factor)
                    for res in arr_res:
                        datareturn.append(res)
                if count_factor >= 3:
                    new_arr_count_factor = []
                    new_expr = "1"
                    for idx, fac in enumerate(arr_count_factor):
                        if idx > 0:
                            new_expr = simplify(new_expr) * simplify(fac)
                    new_arr_count_factor.append(arr_count_factor[0])
                    new_arr_count_factor.append(expand(new_expr))
                    arr_res = detail_poly(part_1_function, new_arr_count_factor)
                    for res in arr_res:
                        datareturn.append(res)

    if len(arr_factor) != 1:
        # datareturn.append(eq_json(simplify_function, 0))
        if simplify_function != factor_function:
            if str(factor_function)[0] == "-":
                datareturn.append(eq_json(-factor_function, 0))
            else:
                datareturn.append(eq_json(factor_function, 0))
        results = json_poly(str(factor_function), varList)
        for res in results:
            datareturn.append(res)
    else:
        for varName in varList:
            exec (varName + "=Symbol(varName)")
        exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
        datareturn.append(eq_json(simplify_function, 0))
        datareturn.append(eq_json(factor_function, 0))
        res = json_result(result, varList)
        if len(res) > 0:
            datareturn.append(json_result(result, varList))
        else:
            datareturn.append(solve_2_degree(factor_function, varList))

    # json_data = json.dumps(datareturn)
    # return json_data
    return datareturn


def json_1_degree(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    # simplify_function = simplify(function)
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data = []
    match = re.search(r'CRootOf', str(result))
    if match:
        res = {}
        res["noroot"] = "noroot"
        data.append(res)
        return data

    if degree(function) == 2:
        if len(result) == 0:
            data.append(solve_2_degree(function, varList))
        elif len(result) == 1:
            for res in result:
                expr = simplify(str(varList[0]) + '-' + str(res))
                data.append(eq_json(expr ** 2, 0))
                data.append(eq_json(expr, 0))
    json_res = json_result(result, varList)
    if len(json_res) != 0:
        data.append(json_res)
    return data


def json_classification(val):
    data = {}
    data["classification"] = val
    return data

def biquaric_equation_step(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    step = []
    original_function = parse_expr(str(function), evaluate=False)
    step.append(eq_json_start(original_function))
    new_function = nsimplify(original_function)
    if str(new_function) != str(original_function):
        step.append(eq_json2(new_function))
    pre_function = new_function.lhs - new_function.rhs
    if new_function.rhs != 0:
        step.append(eq_json(pre_function, 0))

    figure = Poly(str(pre_function), simplify(varList[0])).all_coeffs()
    if figure[1] != 0 or figure[3] != 0:
        return poly_all_equation(function, varList)
    a = figure[0]
    b = figure[2]
    c = figure[4]
    if varList[0] == "t":
        t = Symbol('m')
    else:
        t = Symbol('t')
    step.append(eq_json_alias(Eq(t,simplify(varList[0])**2)))
    expr = a * t ** 2 + b * t + c
    new_expr = Eq(a * t ** 2 + b * t + c, 0)
    step.append(eq_json_start_alias(new_expr))
    factor_function = factor(new_expr)
    if str(factor_function) != str(new_expr):
        step.append(eq_json2(factor_function))
        listfactor = factor_list(expr)[1]
        arr_factor = []
        for item in listfactor:
            arr_factor.append(eq_json(item[0]**item[1], 0))
        step.append(or_json(arr_factor))

    result = solveset(new_expr, t, domain=S.Reals)
    res_child = []
    pass_child = []
    for res in result:
        if res >= 0:
            res_child.append(eq_json_check(t, res, "yes"))
            pass_child.append(res)
        else:
            res_child.append(eq_json_check(t, res, "no"))
    if len(res_child) > 1:
        step.append(or_json(res_child))
    root = []
    for item in pass_child:
        step.append(eq_json_case(t, item))
        expr_case = Eq(simplify(varList[0])**2, item)
        step.append(eq_json_start_case(expr_case))
        result_case = solveset(expr_case, simplify(varList[0]),domain=S.Reals)
        if len(result_case) == 1:
            for item_case in result_case:
                step.append(eq_json(simplify(varList[0]), simplify(item_case)))
                root.append(latex(item_case))
        elif len(result_case) >1:
            arr_res_case = []
            for item_case in result_case:
                arr_res_case.append(eq_json(simplify(varList[0]), item_case))
                root.append(latex(item_case))
            step.append(or_json(arr_res_case))
    data = {}
    data["step"] = step
    data["root"] = root
    return data

def biquaric_equation(function, varList):
    data = {}
    start_time = time.time()
    root_step = biquaric_equation_step(function, varList)
    data["step"] = root_step["step"]
    data["root"] = root_step["root"]
    data["time"] = time.time() - start_time
    data["classification"] = "biquadricequation"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data


def poly_all_equation(function, varList):
    start_time = time.time()
    data = {}
    step = []
    original_function = parse_expr(str(function), evaluate=False)
    new_function = simplify(function)
    left_expr = new_function.lhs
    right_expr = new_function.rhs
    function = left_expr - right_expr

    if str(original_function) != str(new_function):
        step.append(eq_json_start(original_function))
        if right_expr != 0:
            if str(original_function.lhs) == str(new_function.lhs) and str(original_function.rhs) != str(new_function.rhs):
                step.append(eq_json2(new_function))
            elif str(original_function.rhs) == str(new_function.rhs) and str(original_function.lhs) != str(new_function.lhs):
                step.append(eq_json2(new_function))
    else:
        step.append(eq_json_start(original_function))
    if right_expr != 0:
        step.append(eq_json(function, 0))
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)

    if simplify_function != factor_function:
        result = json_poly_equation(function, varList)
    else:
        if len(factor_list(factor(simplify_function))[1]) != 1:
            result = json_poly_equation(function, varList)
        else:
            result = json_1_degree(function, varList)

    for res in result:
        if res != eq_json(function, 0):
            step.append(res)

    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("root = solveset(function," + str(varList[0]) + ",domain=S.Reals)")

    data["step"] = step
    data["root"] = get_arr_result(root, varList)
    data["time"] = time.time() - start_time
    data["classification"] = "polyeq"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data

def poly_equation(function, varList):
    original_function = parse_expr(str(function), evaluate=False)
    if degree(original_function) == 4:
        original_function = parse_expr(str(function), evaluate=False)
        new_function = nsimplify(original_function)
        pre_function = new_function.lhs - new_function.rhs
        figure = Poly(str(pre_function), simplify(varList[0])).all_coeffs()
        if figure[1] != 0 or figure[3] != 0:
            return poly_all_equation(function, varList)
        else:
            return biquaric_equation(function, varList)
    else:
        return poly_all_equation(function, varList)