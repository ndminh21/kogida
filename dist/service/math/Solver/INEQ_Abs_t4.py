from sympy import *
import time
import json

def eq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def ineq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data

def eq_json_original(function, val):
    data = {}
    data["val"] = latex(function) + " = " + latex(val)
    res_data = {}
    res_data["eq"] = data
    return res_data

def ineq_json(function):
    ineq = {}
    ineq_val = {}
    ineq_val["val"] = latex(function)
    ineq["ineq"] = ineq_val
    return ineq

def and_json(arr):
    data = {}
    data["and"] = arr
    return data

def or_json(arr):
    data = {}
    data["or"] = arr
    return data

def longor_json(arr):
    data = {}
    data["longor"] = arr
    return data

def muti_ineq_json(var, op_min, val_min, op_max, val_max):
    data = {}
    data["val"] = latex(val_min) + latex(op_min) + var + latex(op_max) + latex(val_max)
    res_data = {}
    res_data["ineq"] = data
    return res_data

def eq_json_string(function, val):
    data = {}
    data["val"] = function + " = " + latex(val)
    res_data = {}
    res_data["eq"] = data
    return res_data

def ineq_json_original(function, op, val):
    if op == ">=":
        op = " \geq "
    elif op == "<=":
        op = " \leq "
    data = {}
    data["val"] = latex(function) + str(op) + latex(val)
    res_data = {}
    res_data["ineq"] = data
    return res_data

def ineq_json_2(function, op, val):
    data = {}
    data["val"] = latex(nsimplify(str(function) + str(op) + str(val)))
    res_data = {}
    res_data["ineq"] = data
    return res_data

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

def json_interval_finite_step(res, var):
    data = {}
    boundary = {}
    if res == Interval(-oo, oo):
        args = res.args
        boundary["max"] = args[1]
        boundary["min"] = args[0]
        data["open_set"] = boundary
        return muti_ineq_json(var, "<", boundary["min"], "<", boundary["max"])
    elif res.is_Interval:
        args = res.args
        if args[1] == oo:
            boundary["max"] = args[1]
        else:
            if len(str(latex(args[1]))) < 80:
                boundary["max"] = args[1]
            else:
                boundary["max"] = args[1].evalf(4)
        if len(str(latex(args[0]))) < 80:
            boundary["min"] = args[0]
        else:
            boundary["min"] = args[0].evalf(4)

        if res.left_open and not res.right_open:
            if boundary["min"] == -oo:
                return ineq_json_2(var, " <= ", boundary["max"])
            else:
                return muti_ineq_json(var, "<", boundary["min"], " \leq ", boundary["max"])
                # return longor_json([ineq_json(var, "<=", boundary["max"]), ineq_json(var, ">", boundary["min"])])
        elif res.right_open and not res.left_open:
            if boundary["max"] == oo:
                return ineq_json_2(var, ">=", boundary["min"])
            else:
                return muti_ineq_json(var, " \leq ", boundary["min"], "<", boundary["max"])
                # return longor_json([ineq_json(var, "<", boundary["max"]), ineq_json(var, ">=", boundary["min"])])
        elif res.is_closed:
            return muti_ineq_json(var, " \leq ", boundary["min"], " \leq ", boundary["max"])
            # data["closed_set"] = boundary
        else:
            if boundary["min"] == -oo:
                return ineq_json_2(var, "<", boundary["max"])
            elif boundary["max"] == oo:
                return ineq_json_2(var, ">", boundary["min"])
            else:
                return muti_ineq_json(var, "<", boundary["min"], "<", boundary["max"])
            # data["open_set"] = boundary
    elif res.is_FiniteSet:
        if len(res) == 1:
            for item in res:
                return eq_json_string(var, item)
    return data

def solveSimply_step(expr, op, val, varList):
    function = str(expr) + op + str(val)
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    res = (solve_univariate_inequality(simplify(function), str(varList[0]), relational=False))
    data = {}
    childs = []
    if res.is_Interval:
        data = json_interval_finite_step(res, varList[0])
    elif res.is_FiniteSet:
        data = json_interval_finite_step(res, varList[0])
    elif res.is_Union:
        args = res.args
        for arg in args:
            childs.append(json_interval_finite_step(arg, varList[0]))
        data["longor"] = childs
    return data

def solve_eq_step(function, varList):
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 0:
        return False
    elif len(result) == 1:
        for item in result:
            return eq_json(simplify(varList[0]), item)
    else:
        childs = []
        for item in result:
            childs.append(eq_json(simplify(varList[0]), item))
        return or_json(childs)

def step_abs_ineq_t4(function, varList, classification):
    step = []
    op = classification["op"]
    step.append(ineq_json_start(classification["original"]))
    left = classification["lhs"]
    right = classification["rhs"]
    if classification["change"] == "yes":
        step.append(ineq_json_original(left, op ,right))

    first_step = []
    first_step.append(ineq_json_original(left.args[0], ">=", right))
    first_step.append(ineq_json_original(-left.args[0], ">=", right))
    step.append(and_json(first_step))

    second_step = []
    second_step.append(solveSimply_step(left.args[0], ">=", right, varList))
    second_step.append(solveSimply_step(-left.args[0], ">=", right, varList))
    step.append(and_json(second_step))

    step.append(solveSimply_step(left, ">=", right, varList))

    return step

def ineq_t4(function, varList, classification):
    start_time = time.time()
    data = {}
    data["step"] = step_abs_ineq_t4(function, varList, classification)
    data["root"] = solveSimply(function, varList)
    data["time"] = time.time() - start_time
    data["classification"] = "ineq_t4"
    data["category"] = "ineq"
    json_data = json.dumps(data)
    return json_data