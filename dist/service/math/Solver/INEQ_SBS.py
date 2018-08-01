import sys, json
from sympy import *
import time
import re
from classification_equation import *
from sympy.parsing.sympy_parser import parse_expr
from solver import solver
from INEQ_Poly import solve_poly_ineqSBS
from INEQ_Radical import ineq_radical
from INEQ_Abs import abs_ineq


# -*- coding: utf8 -*-
# x = Symbol('x')

def json_interval_finite(res):
    data = {}
    boundary = {}
    if res == Interval(-oo, oo):
        args = res.args
        boundary["max"] = "+" + latex(args[1])
        boundary["min"] = latex(args[0])
        data["open_set"] = boundary
    elif res.is_Interval:
        args = res.args
        if args[1] == oo:
            boundary["max"] = "+" + latex(args[1])
        else:
            # boundary["max"] = latex(args[1])
            if len(str(latex(args[1]))) < 80:
                boundary["max"] = latex(args[1])
            else:
                boundary["max"] = latex(args[1].evalf(4))

        # boundary["min"] = latex(args[0])
        if len(str(latex(args[0]))) < 80:
            boundary["min"] = latex(args[0])
        else:
            boundary["min"] = latex(args[0].evalf(4))

        if res.left_open and not res.right_open:
            data["left_open_set"] = boundary
        elif res.right_open and not res.left_open:
            data["right_open_set"] = boundary
        elif res.is_closed:
            data["closed_set"] = boundary
        else:
            data["open_set"] = boundary
    elif res.is_FiniteSet:
        data["listed_set"] = latex(res)
    return data


def solveSimply(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    res = (solve_univariate_inequality(simplify(function), str(varList[0]), relational=False))
    data = {}
    childs = []
    if res.is_Interval:
        data = json_interval_finite(res)
    elif res.is_FiniteSet:
        data = json_interval_finite(res)
    elif res.is_Union:
        args = res.args
        for arg in args:
            childs.append(json_interval_finite(arg))
        data["unions"] = childs
    return data


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
    data["val"] = latex(Eq(simplify(function), 0)) + "(\Delta = " + latex(delta) + " < 0, \\text{ No solution})"
    res_data = {}
    res_data["eq"] = data
    return res_data


def json_result(results, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    res = []
    for result in results:
        res.append(latex(result))
    data = {}
    if len(res) == 0:
        res_data = {}
        res_data["val"] = "null"
        data["eq"] = res_data
    elif len(res) == 1:
        # data = eq_json(x,result)
        # if len(str(latex(result))) < 100:
        exec ("data = eq_json_result(" + str(varList[0]) + ",result)")
        # else:
        #     exec ("data = eq_json(" + str(varList[0]) + ",result.evalf())")
    else:
        res_data = []
        for result in results:
            exec ("res_data.append(eq_json_result(" + str(varList[0]) + ", result))")
        data["or"] = res_data
    return data


def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_start(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["start_eq"] = data
    return res_data

def ineq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def eq_json_latex(str_latex):
    data = {}
    data["val"] = str_latex
    res_data = {}
    res_data["eq"] = data
    return res_data


def ineq_json(function):
    ineq = {}
    ineq_val = {}
    ineq_val["val"] = latex(function)
    ineq["ineq"] = ineq_val
    return ineq


def eq_json_result(function, val):
    data = {}
    if len(str(latex(val))) < 80:
        data["val"] = latex(Eq(function, val))
    else:
        data["val"] = latex(function) + " = " + latex(val) + " = " + latex(val.evalf(4))
    res_data = {}
    res_data["eq"] = data
    return res_data


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

    datareturn = {}
    datareturn["value"] = data
    datareturn["next"] = json_result(result, varList)

    a = []
    a.append(data)
    a.append(json_result(result, varList))
    return a


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


# def json_poly_equation(function, varList):
#     for varName in varList:
#         exec (varName + "=Symbol(varName)")
#     simplify_function = simplify(function)
#     factor_function = factor(simplify_function)
#     datareturn = []
#     if len(factor_list(factor(factor_function))[1]) != 1:
#         datareturn.append(eq_json(simplify_function, 0))
#         if simplify_function != factor_function:
#             datareturn.append(eq_json(factor_function, 0))
#         data = json_poly(str(factor_function), varList)
#         for res in data:
#             datareturn.append(res)
#     else:
#         exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
#         datareturn.append(eq_json(simplify_function, 0))
#         datareturn.append(eq_json(factor_function, 0))
#         datareturn.append(json_result(result, varList))

#     return datareturn


def json_1_degree(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    result = solveset(function, domain=S.Reals)
    data = json_result(result, varList)
    datareturn = []
    datareturn.append(data)
    return datareturn


def poly_equation(function, varList):
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)

    if simplify_function != factor_function:
        data = json_poly_equation(function, varList)
    else:
        if len(factor_list(factor(simplify_function))[1]) != 1:
            return json_poly_equation(function, varList)
        else:
            return json_1_degree(function, varList)
    return data


def preprocess_inquetion(function):
    datareturn = {}
    simplify_function = str(nsimplify(function))
    match_1 = re.search(r'=0$', simplify_function.replace(' ', ''))
    match_2 = re.search(r'<0$', simplify_function.replace(' ', ''))
    match_3 = re.search(r'>0$', simplify_function.replace(' ', ''))
    if match_1 or match_2 or match_3:
        datareturn['step'] = []
        datareturn['expression'] = str(simplify_function[: len(simplify_function) - 4])
        # datareturn['child'] = []
        # json_data = json.dumps(datareturn)
        return datareturn
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
    expression = expand(nsimplify(str(left) + '- (' + str(right) + ' ) '))
    simplify_function = simplify(new_function)
    step = {}
    ineq_val = {}
    ineq_val["val"] = latex(simplify_function)
    step["ineq"] = ineq_val

    datareturn["step"] = step
    datareturn["expression"] = str(expression)
    return datareturn


def solveSBS(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    original_function = parse_expr(function, evaluate=False)
    func = nsimplify(function)
    result = []
    if simplify_logic(func) == True or simplify_logic(func) == False:
        return result
    if str(original_function) != str(func):
        result.append(ineq_json(original_function))
    result.append(ineq_json(func))

    prep = preprocess_inquetion(func)
    prep_json = json.dumps(prep)
    prep_data = json.loads(str(prep_json))
    if len(prep_data["step"]) != 0:
        result.append(prep_data["step"])

    exp = simplify(prep_data["expression"])
    result.append(eq_json(exp, 0))

    result_poly = poly_equation(exp, varList)
    for res in result_poly:
        result.append(res)

    considering_sign = {}
    sign = {}
    arr_val = []
    arr_sign = []
    result_exp = solveset(exp, domain=S.Reals)
    arr_res = []
    for re in result_exp:
        arr_res.append(re)
    arr_res.sort()
    arr_val.append(latex(-oo))
    arr_sign.append("$$")
    len_arr_res = len(arr_res)
    if len_arr_res == 0:
        if exp.subs(str(varList[0]), 0) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
    elif len_arr_res == 1:
        if len(str(latex(arr_res[0]))) < 80:
            arr_val.append(latex(arr_res[0]))
        else:
            arr_val.append(latex(arr_res[0].evalf(4)))

        # arr_val.append(latex(arr_res[0]))
        if exp.subs(str(varList[0]), arr_res[0] - 1) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
        arr_sign.append("$0$")
        if exp.subs(str(varList[0]), arr_res[0] + 1) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
    elif len_arr_res > 1:
        for ind, res in enumerate(arr_res):
            if len(str(latex(arr_res[ind]))) < 80:
                arr_val.append(latex(arr_res[ind]))
            else:
                arr_val.append(latex(arr_res[ind].evalf(4)))
            # arr_val.append(latex(arr_res[ind]))
            if ind == 0:
                if exp.subs(str(varList[0]), res - 1) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
                arr_sign.append("$0$")
            elif ind == len_arr_res - 1:
                if exp.subs(str(varList[0]), (arr_res[ind] + arr_res[ind - 1]) / 2) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
                arr_sign.append("$0$")
                if exp.subs(str(varList[0]), res + 1) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
            else:
                if exp.subs(str(varList[0]), (arr_res[ind] + arr_res[ind - 1]) / 2) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
                arr_sign.append("$0$")

    arr_sign.append("$$")
    arr_val.append("+" + latex(oo))
    sign["val"] = arr_val
    sign["sign"] = arr_sign
    # considering_sign["considering_sign"] = sign
    result.append(sign)
    return result


# def solve_poly_ineqSBS(function, varList):
#     datareturn = {}
#     start_time = time.time()
#     if len(varList) > 0:
#         result = solveSimply(function, varList)
#         step_res = solveSBS(function, varList)
#         step = []
#         considering_sign = []
#         for idx, res in enumerate(step_res):
#             if idx == len(step_res) - 1:
#                 considering_sign = res
#             else:
#                 step.append(res)
#         end_time = time.time() - start_time
#         datareturn["root"] = result
#         datareturn["time"] = end_time
#         datareturn["step"] = step
#         datareturn["considering_sign"] = considering_sign
#         datareturn["classification"] = "polyineq"
#         datareturn["category"] = "ineq"
#     else:
#         end_time = time.time() - start_time
#         datareturn["root"] = str(simplify(function))
#         datareturn["step"] = []
#         datareturn["time"] = end_time
#         datareturn["classification"] = "polyineq"
#         datareturn["category"] = "ineq"
#     json_data = json.dumps(datareturn)
#     return json_data


def get_considering_sign(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    original_function = parse_expr(function, evaluate=False)
    func = nsimplify(function)
    result = []
    if simplify_logic(func) == True or simplify_logic(func) == False:
        return result
    if str(original_function) != str(func):
        result.append(ineq_json_start(original_function))
        result.append(ineq_json(func))
    else:
        result.append(ineq_json_start(func))

    prep = preprocess_inquetion(func)
    prep_json = json.dumps(prep)
    prep_data = json.loads(str(prep_json))
    if len(prep_data["step"]) != 0:
        result.append(prep_data["step"])

    exp = simplify(prep_data["expression"])
    result.append(eq_json_start(exp, 0))

    solve_eq = solver(str(Eq(exp,0)), varList, "rad")
    solve_data = json.loads(solve_eq)
    result_eq = solve_data["step"]
    for res in result_eq:
        result.append(res)

    sign = {}
    arr_val = []
    arr_sign = []
    result_exp = solveset(exp, domain=S.Reals)
    arr_res = []
    for re in result_exp:
        arr_res.append(re)
    arr_res.sort()
    arr_val.append(latex(-oo))
    arr_sign.append("$$")
    len_arr_res = len(arr_res)
    if len_arr_res == 0:
        try:
            if exp.subs(str(varList[0]), 0) < 0:
                arr_sign.append("$-$")
            else:
                arr_sign.append("$+$")
        except Exception:
            arr_sign.append("$$")
    elif len_arr_res == 1:
        if len(str(latex(arr_res[0]))) < 80:
            arr_val.append(latex(arr_res[0]))
        else:
            arr_val.append(latex(arr_res[0].evalf(4)))

        # arr_val.append(latex(arr_res[0]))
        if exp.subs(str(varList[0]), arr_res[0] - 1) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
        arr_sign.append("$0$")
        if exp.subs(str(varList[0]), arr_res[0] + 1) < 0:
            arr_sign.append("$-$")
        else:
            arr_sign.append("$+$")
    elif len_arr_res > 1:
        for ind, res in enumerate(arr_res):
            if len(str(latex(arr_res[ind]))) < 80:
                arr_val.append(latex(arr_res[ind]))
            else:
                arr_val.append(latex(arr_res[ind].evalf(4)))
            # arr_val.append(latex(arr_res[ind]))
            if ind == 0:
                if exp.subs(str(varList[0]), res - 1) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
                arr_sign.append("$0$")
            elif ind == len_arr_res - 1:
                try:
                    if exp.subs(str(varList[0]), (arr_res[ind] + arr_res[ind - 1]) / 2) > 0:
                        arr_sign.append("$+$")
                    else:
                        arr_sign.append("$-$")
                except Exception:
                    arr_sign.append("$$")
                arr_sign.append("$0$")
                if exp.subs(str(varList[0]), res + 1) > 0:
                    arr_sign.append("$+$")
                else:
                    arr_sign.append("$-$")
            else:
                try:
                    if exp.subs(str(varList[0]), (arr_res[ind] + arr_res[ind - 1]) / 2) > 0:
                        arr_sign.append("$+$")
                    else:
                        arr_sign.append("$-$")
                except Exception:
                    arr_sign.append("$$")
                arr_sign.append("$0$")

    arr_sign.append("$$")
    arr_val.append("+" + latex(oo))
    sign["val"] = arr_val
    sign["sign"] = arr_sign
    # considering_sign["considering_sign"] = sign
    result.append(sign)
    return result


def solve_trigo_ineqSBS(function, varList):
    datareturn = {}
    res_data = {}
    start_time = time.time()
    if len(varList) > 0:
        result = solveSimply(function, varList)
        step_res = get_considering_sign(function, varList)
        step = []
        considering_sign = []
        for idx, res in enumerate(step_res):
            if idx == len(step_res) - 1:
                considering_sign = res
            else:
                step.append(res)
        end_time = time.time() - start_time
        datareturn["root"] = result
        datareturn["time"] = end_time
        datareturn["step"] = step
        datareturn["considering_sign"] = considering_sign
        datareturn["classification"] = "polyineq"
        datareturn["category"] = "ineq"
    else:
        datareturn["root"] = str(simplify(function))
        datareturn["time"] = time.time() - start_time
        datareturn["step"] = []
        datareturn["classification"] = "polyineq"
        datareturn["category"] = "ineq"
    json_data = json.dumps(datareturn)
    return json_data


def solveineqSBS(function, varList):
    classifi = classcification_eq(function)
    if classifi == 1:
        return solve_poly_ineqSBS(function, varList)
    elif classifi == 2:
        return solve_trigo_ineqSBS(function, varList)
    elif classifi == 3:
        return ineq_radical(function, varList)
    elif classifi == 5:
        return abs_ineq(function, varList)
    else:
        return solve_trigo_ineqSBS(function, varList)

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    # return lines[0]


def main():
    data = read_in()
    results = solveineqSBS(data['sympy'], data['varList'])

    # result = {"sympy": sympyTrim, "numpy": normalTrim}
    # json_data = json.dumps(result)
    print results
    # print lines['node'][0]['node']
    # Start process


if __name__ == '__main__':
    main()