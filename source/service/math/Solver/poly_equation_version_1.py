from sympy import *
import re
import json
from sympy.parsing.sympy_parser import parse_expr

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

def solve_2_degree (function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    function = str(nsimplify(function))
    figure = Poly(function, x).all_coeffs()
    a = figure[0]
    b = figure[1]
    c = figure[2]
    delta = b**2 - 4*a*c
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
        data["val"] = "null"
        res_data = {}
        res_data["eq"] = data
    elif len(results) == 1:
        for re in results:
            data = eq_json(simplify(str(varList[0])), simplify(re))
    else:
        res_data = []
        for re in results:
            res_data.append(eq_json(simplify(str(varList[0])), simplify(re)))

        data["or"] = res_data
    return data


def json_poly(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    new_functions = []
    arr_factor = factor_list(function)
    for fac in arr_factor[1]:
        new_functions.append(fac[0]**fac[1])

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
    datareturn.append(json_result(result, varList))

    return datareturn

def detail_poly(part_1_function, arr_count_factor):
    datareturn = []
    arr_latex_step_1 = []
    arr_temp_expr = []
    arr_item = []
    for part in reversed(arr_count_factor[0].args):
        temp_expr = expand(part * arr_count_factor[1])
        arr_latex_step_1.append(latex(part) + " \left( " + latex(arr_count_factor[1]) + " \\right)")
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

    datareturn.append(eq_json_latex(str_latex))
    datareturn.append(eq_json_latex(str_latex_step_1))
    return datareturn

def json_poly_equation(function, varList):
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)

    datareturn = []

    arr_factor = factor_list(factor(factor_function))[1]
    if simplify_function != factor_function:
        if len(arr_factor) > 2:
            part_1_function = "1"
            for idx1, fac in enumerate(arr_factor):
                part_1_function = simplify(part_1_function) * simplify(fac[0])
                part_2_function = "1"
                count_factor = 0
                arr_count_factor = []
                arr_latex_step_1 = []
                for idx2, fac in enumerate(arr_factor):
                    if idx2 > idx1:
                        count_factor += 1
                        arr_count_factor.append(fac[0])
                        part_2_function = simplify(part_2_function) * simplify(fac[0])
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
            datareturn.append(eq_json(factor_function, 0))
        results = json_poly(str(factor_function), varList)
        for res in results:
            datareturn.append(res)
    else:
        for varName in varList:
            exec (varName + "=Symbol(varName)")
        exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
        # datareturn.append(eq_json(simplify_function, 0))
        datareturn.append(eq_json(factor_function, 0))
        datareturn.append(json_result(result, varList))

    # json_data = json.dumps(datareturn)
    # return json_data
    return datareturn

def json_1_degree(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    simplify_function = simplify(function)
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data = []
    if degree(function) == 2:
        if len(result) == 0:
            data.append(solve_2_degree(function, varList))
        elif len(result) == 1:
            for res in result:
                expr  = simplify(str(varList[0])+ '-' + str(res))
                data.append(eq_json(expr**2, 0))
                data.append(eq_json(expr, 0))
    data.append(json_result(result, varList))
    return data

def json_classification(val):
    data = {}
    data["classification"] = val
    return data

def poly_equation(function, varList):
    data = []
    # data.append(json_classification("polyeq"))
    original_function = parse_expr(function, evaluate=False)
    new_function = simplify(function)
    left_expr = new_function.lhs
    right_expr = new_function.rhs
    function = left_expr-right_expr
    if str(original_function) != str(new_function):
        data.append(eq_json2(original_function))
        if right_expr != 0:
            data.append(eq_json2(new_function))
    else:
        data.append(eq_json2(original_function))
    if right_expr != 0:
        data.append(eq_json(function,0))

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
        data.append(res)
    json_data = json.dumps(data)
    return json_data