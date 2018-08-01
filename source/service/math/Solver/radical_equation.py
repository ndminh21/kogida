from sympy import *
import json
from poly_equation import poly_equation
import time
from sympy.parsing.sympy_parser import parse_expr
import re


def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_2(function, val):
    data = {}
    data["val"] = latex(function) + " = " + latex(val)
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def ineq_json(function):
    data = {}
    if str(simplify(function)) == "True" or str(simplify(function)) == "False":
        original_function = parse_expr(str(function), evaluate=False)
        data["val"] = latex(original_function)
    else:
        data["val"] = latex(simplify(function))
    res_data = {}
    res_data["ineq"] = data
    return res_data

def ineq_json_condition(function):
    data = {}
    if str(simplify(str(function) + ">=0")) == "True":
        original_function = parse_expr(str(function), evaluate=False)
        data["val"] = latex(original_function) + " \\geq 0"
    elif str(simplify(str(function) + ">=0")) == "False":
        original_function = parse_expr(str(function), evaluate=False)
        data["val"] = latex(original_function) + " \\geq 0"
    else:
        data["val"] = latex(simplify(function)) + " \\geq 0"
    res_data = {}
    res_data["ineq"] = data
    return res_data

def ineq_json_condition_right(function, res):
    data = {}
    if res == "true":
        data["val"] = latex(function) + " \\geq 0 , \\forall x \\in \\mathbb{R}"
    else:
        data["val"] = latex(function) + " \\leq 0 , \\forall x \\in \\mathbb{R}"
    res_data = {}
    res_data["ineq"] = data
    return res_data

def check_ineq_condition(function):
    if str(simplify(str(function) + ">=0")) == "False":
        return "false"
    elif str(simplify(str(function) + ">=0")) == "True":
        return "true"
    else:
        return "continue"

def eq_json_original(left, right):
    data = {}
    data["val"] = latex(left) + " = " + latex(right)
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_original_start(left, right):
    data = {}
    data["val"] = latex(left) + " = " + latex(right)
    res_data = {}
    res_data["start"] = data
    return res_data

def eq_json2(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["eq"] = data
    return res_data

def and_json(arr):
    data = {}
    data["and"] = arr
    return data

def or_json(arr):
    data = {}
    data["or"] = arr
    return data

def json_interval_finite(res, varList):
    if res == Interval(-oo, oo):
        return ""
    elif res.is_Interval:
        args = res.args
        if args[1] == oo:
            return ineq_json(simplify(varList[0] + " >= " + str(args[0])))
        elif args[1] == oo:
            return ineq_json(simplify(varList[0] + " <= " + str(args[1])))
        else:
            if args[0] != -oo:
                return and_json([ineq_json(simplify(varList[0] + " >= " + str(args[0]))), ineq_json(simplify(varList[0] + " <= " + str(args[1])))])
            else:
                return ineq_json(simplify(varList[0] + " <= " + str(args[1])))
    elif res.is_FiniteSet:
        arr_res = []
        for resu in res:
            arr_res.append(resu)
        if len(arr_res):
            return or_json(arr_res)
        else:
            return ""

def getCondition(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    res = (solve_univariate_inequality(simplify(function), str(varList[0]), relational=False))
    data = {}
    childs = []
    if res == S.Reals:
        return "true"
    if res.is_Interval:
        data = json_interval_finite(res, varList)
    elif res.is_FiniteSet:
        data = json_interval_finite(res, varList)
    elif res.is_Union:
        args = res.args
        for arg in args:
            childs.append(json_interval_finite(arg, varList))
        data["or"] = childs
    return data

def pre_processing(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    original_function = parse_expr(str(function), evaluate=False)
    left_expr = original_function.lhs
    right_expr = original_function.rhs
    new_expr = left_expr - right_expr
    new_left = ""
    new_right = ""
    radical_count = 0
    list_arg = factor_list(new_expr)
    if len(list_arg[1]) == 1 and list_arg[1][0][1] % 1 != 0:
        new_left = str(new_expr)
    else:
        for arg in new_expr.args:

            exec ("check = arg.is_polynomial(varList[0])")
            if check:
                if str(arg)[0] == "-":
                    new_right += "-" + str(arg)
                else:
                    new_right += "-" + str(arg)
            else:
                radical_count += 1
                if str(arg)[0] == "-":
                    new_left += str(arg)
                else:
                    new_left += "+" +str(arg)

    data = {}
    if radical_count == len(new_expr.args):
        if radical_count == 2:
            new_left = new_expr.args[0]
            new_right = new_expr.args[1]
            data["lhs"] = simplify(new_left)
            data["rhs"] = simplify(new_right)
        else:
            data["lhs"] = simplify(new_left)
            if new_right == "":
                data["rhs"] = ""
            else:
                data["rhs"] = simplify(new_right)
    else:
        data["lhs"] = simplify(new_left)

        if new_right == "":
            data["rhs"] = 0
        else:
            data["rhs"] = simplify(new_right)
    return data



def claassification_radical(function, varList):
    data = {}
    # simplify_function = simplify(function)
    pre_process_function = pre_processing(function, varList)
    left_expr = pre_process_function["lhs"]
    right_expr = pre_process_function["rhs"]
    try:
        left_factor_list = factor_list(left_expr)
        len_left_factor_list = len(left_factor_list[1])
        right_factor_list = factor_list(right_expr)
        len_right_factor_list = len(right_factor_list[1])
    except Exception, e:
        data["lhs"] = left_expr
        data["rhs"] = right_expr
        data["class"] = 0
        data["pow"] = 0
        return data
    if len_left_factor_list == 1 and len_right_factor_list == 1:
        pow_left = left_factor_list[1][0][1]
        pow_right = right_factor_list[1][0][1]
        if not isinstance(pow_left, int) and pow_right % 1 != 0:
            data["lhs"] = left_expr
            data["rhs"] = right_expr
            data["class"] = 2
            data["pow"] = lcm(denom(pow_left), denom(pow_right))
        else:
            if len(left_factor_list[1]) == 1:
                pow_new_left = left_factor_list[1][0][1]
                data["lhs"] = left_expr
                data["rhs"] = right_expr
                data["class"] = 1
                data["pow"] = 1 / pow_new_left
            else:
                data["lhs"] = left_expr
                data["rhs"] = right_expr
                data["class"] = 0
                data["pow"] = 1
        return data
    elif len_left_factor_list == 1:
        count = 0
        for item in left_factor_list[1][0][0].args:
            match = re.search(r'sqrt', str(item))
            if match:
                count += 1
        if count < 1:
            pow_left = 1/left_factor_list[1][0][1]
            if pow_left % 2 == 0:
                data["lhs"] = left_expr
                data["rhs"] = right_expr
                data["class"] = 1
                data["pow"] = pow_left
            elif pow_left % 2 == 1:
                data["lhs"] = left_expr
                data["rhs"] = right_expr
                data["class"] = 3
                data["pow"] = pow_left
            else:
                data["lhs"] = left_expr
                data["rhs"] = right_expr
                data["class"] = 0
                data["pow"] = 1

        else:
            data["lhs"] = left_expr
            data["rhs"] = right_expr
            data["class"] = 0
            data["pow"] = 1
        return data
    if len_left_factor_list > 1:
        count_radical = 0
        pow = 0
        for item in left_factor_list[1]:
            if isinstance(item[1], int):
                right_expr = right_expr/item[0]
            else:
                count_radical += 1
                pow = 1 / item[1]
                left_expr = item[0] ** item[1]
        if count_radical == 1 and pow % 2 == 0 and pow != 0:
            data["lhs"] = left_expr
            data["rhs"] = right_expr
            data["class"] = 1
            data["pow"] = pow
        else:
            data["lhs"] = left_expr
            data["rhs"] = right_expr
            data["class"] = 0
            data["pow"] = 1

    else:
        data["lhs"] = left_expr
        data["rhs"] = right_expr
        data["class"] = 0
        data["pow"] = 1
    return data

def steps_all_radical(function, varList, classification, root):
    step = []

    original_function = parse_expr(str(function), evaluate=False)

    step.append(eq_json_start(original_function))

    if len(root) == 1:
        step.append(eq_json_2(simplify(varList[0]), root[0]))
    elif len(root) > 1:
        childs = []
        for item in root:
            childs.append(eq_json_2(simplify(varList[0]), item))
        data = {}
        data["or"] = childs
        step.append(data)
    return step

def solve_all_radical_equation(function, varList, classification):
    start_time = time.time()
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("root = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data["root"] = get_arr_result(root, varList)
    data["step"] = steps_all_radical(function, varList, classification, data["root"])
    data["time"] = time.time() - start_time
    data["classification"] = "nosupport"
    json_data = json.dumps(data)
    return json_data

def json_result(function, varList):
    data = {}
    try:
        for varName in varList:
            exec (varName + "=Symbol(varName)")
        exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    except Exception, e:
        res_data = {}
        res_data["val"] = "null"
        data["eq"] = res_data
        return data

    if len(results) == 0:
        res_data = {}
        res_data["val"] = "null"
        data["eq"] = res_data
    elif len(results) == 1:
        for re in results:
            data = eq_json(simplify(str(varList[0])), simplify(re))
    else:
        res_data = []
        for re in results:
            res_data.append(eq_json(simplify(str(varList[0])), simplify(re)))
        data["or"] = res_data
    return data

def null_eq_json():
    data = {}
    res_data = {}
    res_data["val"] = "null"
    data["eq"] = res_data
    return data

def non_2_degree(function, varList):
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

def json_result_after_check_condition(function, varList, condition):
    datareturn = {}
    data = {}
    arr_res_pass = []
    datareturn["arr_res_pass"] = arr_res_pass
    datareturn["json_res_pass"] = null_eq_json()
    try:
        for varName in varList:
            exec (varName + "=Symbol(varName)")
        exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    except Exception, e:
        return datareturn

    if len(results) == 0:
        return datareturn
    elif len(results) == 1:
        for res in results:
            exec("is_pass = condition.subs({ str(varList[0]) : res })")
            if is_pass:
                arr_res_pass.append(res)
                data = eq_json(simplify(str(varList[0])), simplify(res))
                datareturn["arr_res_pass"] = arr_res_pass
                datareturn["json_res_pass"] = data
                return datareturn
            else:
                return datareturn
    else:
        res_data = []
        for res in results:
            exec("is_pass = condition.subs({ str(varList[0]) : res })")
            if is_pass:
                arr_res_pass.append(res)
        datareturn["arr_res_pass"] = arr_res_pass
        if len(arr_res_pass) == 0:
            return datareturn
        elif len(arr_res_pass) == 1:
            data = eq_json(simplify(str(varList[0])), simplify(arr_res_pass[0]))
            datareturn["json_res_pass"] = data
        else:
            for res in arr_res_pass:
                res_data.append(eq_json(simplify(str(varList[0])), simplify(res)))
            data["or"] = res_data

            datareturn["json_res_pass"] = data
    return datareturn

def get_arr_result(results, varList):
    data = []
    for re in results:
        data.append(latex(re))
    return data

def steps_1_radical(function, varList, classification):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    step = []
    original_function = parse_expr(str(function), evaluate=False)
    simplify_function = simplify(original_function)
    try:
        exec("is_poly = original_function.lhs.is_polynomial(varList[0])")
        if is_poly:
            step.append(eq_json_original_start(original_function.rhs, original_function.lhs))
        else:
            step.append(eq_json_original_start(original_function.lhs, original_function.rhs))
            if str(simplify_function.rhs) != str(original_function.lhs) and str(simplify_function.lhs) != str(original_function.rhs) and str(original_function) != str(simplify_function):

                try:
                    exec ("is_poly = simplify_function.lhs.is_polynomial(varList[0])")
                    if is_poly:
                        step.append(eq_json_original(simplify_function.rhs, simplify_function.lhs))
                    else:
                        step.append(eq_json_original(simplify_function.lhs, simplify_function.rhs))
                except Exception, e:
                    step.append(eq_json_original(simplify_function.lhs, simplify_function.rhs))

    except Exception, e:
        step.append(eq_json_original_start(original_function.lhs, original_function.rhs))

    pre_function = pre_processing(function, varList)
    exec ("is_poly = simplify_function.lhs.is_polynomial(varList[0])")
    if is_poly:
        if str(simplify_function.rhs) != str(pre_function["lhs"]) and str(simplify_function.lhs) != str(pre_function["rhs"]):
            step.append(eq_json_original(pre_function["lhs"], pre_function["rhs"]))
    else:
        if str(simplify_function.lhs) != str(pre_function["lhs"]) and str(simplify_function.rhs) != str(pre_function["rhs"]):
            step.append(eq_json_original(pre_function["lhs"], pre_function["rhs"]))

    if str(classification["lhs"])[0] == "-":
        left_process = simplify(-classification["lhs"])
        right_process = simplify(-classification["rhs"])
    else:
        left_process = simplify(classification["lhs"])
        right_process = simplify(classification["rhs"])
    new_left = simplify(classification["lhs"] ** classification["pow"])
    new_right = simplify(classification["rhs"] ** classification["pow"])

    step1_ep = eq_json_original(new_left, new_right)
    step1_ineq = ineq_json_condition(right_process)
    step.append(and_json([step1_ineq, step1_ep]))

    check_condition = check_ineq_condition(right_process)
    expr_condition = simplify(right_process >= 0)
    res = getCondition(expr_condition, varList)
    step2_ineq = res
    if step2_ineq == "true" or step2_ineq == "false":
        step.append(and_json([ineq_json_condition_right(right_process, step2_ineq), step1_ep]))

    # step.append(eq_json(classification["lhs"], classification["rhs"]))
    # step.append(eq_json(new_left, new_right))
    new_expr = str(Eq(new_left, new_right))
    solve_poly = poly_equation(new_expr, varList)
    solve_data = json.loads(solve_poly)
    result_poly = solve_data["step"]
    if check_condition == "true" or step2_ineq == "true":
        for idx, sol in enumerate(result_poly):
            step.append(sol)
            if idx == len(result_poly) - 1:
                last_step = sol
    elif check_condition == "false" or step2_ineq == "false":
        return step
    elif check_condition == "continue":
        for idx, sol in enumerate(result_poly):
            step.append(and_json([step2_ineq, sol]))

    if check_condition == "true" or step2_ineq == "true":
        try:
            if last_step != json_result(function, varList) and last_step["eq"]["val"] != "null":
                step.append(json_result(function, varList))
        except Exception, e:
            result = json_result(function, varList)
            step.append(result)

    elif check_condition == "continue":
        result_after_check = json_result_after_check_condition(function, varList, expr_condition)
        json_res_pass = result_after_check["json_res_pass"]
        try:
            if last_step != json_res_pass and last_step["eq"]["val"] != "null" and json_res_pass != null_eq_json():
                step.append(json_res_pass)
        except Exception, e:
            if json_res_pass != null_eq_json():
                step.append(json_res_pass)

    # try:
    #     if last_step != json_result(function, varList) and last_step["eq"]["val"] != "null":
    #         step.append(json_result(function, varList))
    # except Exception, e:
    #     result = json_result(function, varList)
    #     step.append(result)

    return step

def solve_1_radical(function, varList, classification):
    start_time = time.time()
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("root = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data["step"] = steps_1_radical(function, varList, classification)
    data["root"] = get_arr_result(root, varList)
    data["time"] = time.time() - start_time
    data["classification"] = "C1"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data

def steps_2_radical(function, varList, classification):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    original_function = parse_expr(str(function), evaluate=False)
    step = []
    step.append(eq_json_original(original_function.lhs, original_function.rhs))
    simplify_function = simplify(original_function)
    # if str(classification["lhs"]) != str(original_function.lhs) or str(classification["rhs"]) != str(original_function.rhs):
    #     step.append(eq_json_original(classification["lhs"], classification["rhs"]))

    new_left = simplify(classification["lhs"] ** classification["pow"])
    new_right = simplify(classification["rhs"] ** classification["pow"])


    step1_eq = eq_json_original(new_left, new_right)
    step1_ineq_1 = ineq_json_condition(new_left)
    step1_ineq_2 = ineq_json_condition(new_right)
    # step.append(and_json([step1_ineq_1, step1_ineq_2, step1_eq]))

    check_condition_1 = check_ineq_condition(new_left)
    check_condition_2 = check_ineq_condition(new_right)
    step2_ineq_1= getCondition(simplify(new_left >= 0), varList)
    step2_ineq_2 = getCondition(simplify(new_right >= 0), varList)
    if len(str(step2_ineq_1)) > len(str(step2_ineq_2)):
        step2_ineq = step2_ineq_2
        check_condition = check_condition_2
        step.append(and_json([step1_ineq_2, step1_eq]))
        expr_condition = simplify(new_right >= 0)

    else:
        step2_ineq = step2_ineq_1
        check_condition = check_condition_1
        step.append(and_json([step1_ineq_1, step1_eq]))
        expr_condition = simplify(new_left >= 0)

    # step.append(eq_json(classification["lhs"], classification["rhs"]))
    # step.append(eq_json(new_left, new_right))
    new_expr = str(Eq(new_left, new_right))
    solve_poly = poly_equation(new_expr, varList)
    solve_data = json.loads(solve_poly)
    result_poly = solve_data["step"]
    # print result_poly
    if check_condition == "true" or step2_ineq == "true":
        for idx, sol in enumerate(result_poly):
            step.append(sol)
            if idx == len(result_poly) - 1:
                last_step = sol
    elif check_condition == "false" or step2_ineq == "false":
        return step
    elif check_condition == "continue":
        for idx, sol in enumerate(result_poly):
            step.append(and_json([step2_ineq, sol]))

    if check_condition == "true" or step2_ineq == "true":
        try:
            if last_step != json_result(function, varList) and last_step["eq"]["val"] != "null":
                step.append(json_result(function, varList))
        except Exception, e:
            result = json_result(function, varList)
            step.append(result)

    elif check_condition == "continue":
        result_after_check = json_result_after_check_condition(function, varList, expr_condition)
        json_res_pass = result_after_check["json_res_pass"]
        try:
            if last_step != json_res_pass and last_step["eq"]["val"] != "null":
                step.append(json_res_pass)
        except Exception, e:
            step.append(json_res_pass)

        # try:
        #     if last_step != json_result_after_check_condition(function, varList, expr_condition) and last_step["eq"]["val"] != "null":
        #         step.append(json_result_after_check_condition(function, varList, expr_condition))
        # except Exception, e:
        #     result = json_result_after_check_condition(function, varList, expr_condition)
        #     step.append(result)

    # try:
    #     if last_step != json_result(function, varList) and last_step["eq"]["val"] != "null":
    #         step.append(json_result(function, varList))
    # except Exception, e:
    #     result = json_result(function, varList)
    #     step.append(result)

    return step

def solve_2_radical(function, varList, classification):
    start_time = time.time()
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data["step"] = steps_2_radical(function, varList, classification)
    data["root"] = get_arr_result(results, varList)
    data["time"] = time.time() - start_time
    data["classification"] = "C2"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data

def eq_json_power(lhs, rhs, pow):
    res = {}
    res["val"] = "\\left( " + latex(lhs) + " \\right)^{" + latex(pow) + "} = \\left( " + latex(rhs) + " \\right)^{" + latex(pow) + "}"
    data = {}
    data["eq"] = res
    return data

def steps_3_radical(function, varList, classification, root):
    step = []
    lhs = classification["lhs"]
    rhs = classification["rhs"]
    pow = classification["pow"]
    original_function = parse_expr(str(function), evaluate=False)

    step.append(eq_json_start(original_function))

    step.append(eq_json_power(lhs, rhs, pow))

    last_eq_change = eq_json_2(lhs**pow, rhs**pow)
    step.append(last_eq_change)

    if len(root) == 1:
        if eq_json_2(simplify(varList[0]), root[0]) != last_eq_change:
            step.append(eq_json_2(simplify(varList[0]), root[0]))
    elif len(root) > 1:
        childs = []
        for item in root:
            childs.append(eq_json_2(simplify(varList[0]), item))
        data = {}
        data["or"] = childs
        step.append(data)
    return step

def solve_3_radical(function, varList, classification):
    start_time = time.time()
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("root = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    data["root"] = get_arr_result(root, varList)
    data["step"] = steps_3_radical(function, varList, classification, data["root"])
    data["time"] = time.time() - start_time
    data["classification"] = "C3"
    json_data = json.dumps(data)
    return json_data


def radical_equation(function, varList):
    classification = claassification_radical(function, varList)
    if classification["class"] == 1:
        return solve_1_radical(function, varList, classification)
    elif classification["class"] == 2:
        return solve_2_radical(function, varList, classification)
    elif classification["class"] == 3:
        return solve_3_radical(function, varList, classification)
    else:
        return solve_all_radical_equation(function, varList, classification)

# print radical_equation("Eq((x-1)**(1/3), -2)", ['x'])
#
# x = Symbol('x')
# print latex(x**3)