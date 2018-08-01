import json
from sympy import *
import time
from sympy.parsing.sympy_parser import parse_expr

def eq_json(function, val):
    data = {}
    data["val"] = latex(Eq(function, val))
    res_data = {}
    res_data["eq"] = data
    return res_data

def ineq_json(function, op, val):
    data = {}
    data["val"] = latex(function) + op + latex(val)
    res_data = {}
    res_data["ineq"] = data
    return res_data

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


def eq_json2(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["eq"] = data
    return res_data

def ineq_json2(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["ineq"] = data
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

def longor_json(arr):
    data = {}
    data["longor"] = arr
    return data

def null_eq_json():
    data = {}
    res_data = {}
    res_data["val"] = "null"
    data["eq"] = res_data
    return data

def eq_json_start(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
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
                return ineq_json(var, " \leq ", boundary["max"])
            else:
                return muti_ineq_json(var, "<", boundary["min"], " \leq ", boundary["max"])
                # return longor_json([ineq_json(var, "<=", boundary["max"]), ineq_json(var, ">", boundary["min"])])
        elif res.right_open and not res.left_open:
            if boundary["max"] == oo:
                return ineq_json(var, " \geq ", boundary["min"])
            else:
                return muti_ineq_json(var, " \leq ", boundary["min"], "<", boundary["max"])
                # return longor_json([ineq_json(var, "<", boundary["max"]), ineq_json(var, ">=", boundary["min"])])
        elif res.is_closed:
            return muti_ineq_json(var, " \leq ", boundary["min"], " \leq ", boundary["max"])
            # data["closed_set"] = boundary
        else:
            if boundary["min"] == -oo:
                return ineq_json(var, "<", boundary["max"])
            elif boundary["max"] == oo:
                return ineq_json(var, ">", boundary["min"])
            else:
                return muti_ineq_json(var, "<", boundary["min"], "<", boundary["max"])
            # data["open_set"] = boundary
    elif res.is_FiniteSet:
        if len(res) == 1:
            for item in res:
                return eq_json_string(var, item)
        elif len(res) == 0:
            data = {}
            data["emptyset"] = "emptyset"
    return data

def solveSimply_last_step(function, varList):
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

def step_nosupport(classification, varList):
    step = []

    original_function = classification["original"]
    step.append(eq_json_start(original_function))
    simplify_function = simplify(original_function).reversed
    if str(original_function) != str(simplify_function):
        step.append(ineq_json2(simplify_function))

    step.append(solveSimply_last_step(original_function, varList))

    return step


def solve_radical_ineqSBS_nosupport(classification, varList):
    datareturn = {}
    start_time = time.time()
    if len(varList) > 0:
        result = solveSimply(classification["original"], varList)
        end_time = time.time() - start_time
        datareturn["root"] = result
        datareturn["time"] = end_time
        datareturn["step"] = step_nosupport(classification, varList)
        datareturn["classification"] = "nosupport"
        datareturn["category"] = "ineq"
    else:
        datareturn["root"] = str(simplify(function))
        datareturn["time"] = time.time() - start_time
        datareturn["step"] = []
        datareturn["classification"] = "nosupport"
        datareturn["category"] = "ineq"
    json_data = json.dumps(datareturn)
    return json_data
