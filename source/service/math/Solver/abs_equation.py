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

def null_eq_json():
    data = {}
    res_data = {}
    res_data["val"] = "null"
    data["eq"] = res_data
    return data

def get_arr_result(results, varList):
    data = []
    for re in results:
        data.append(latex(re))
    return data
    
def step(function, arr_result, varList):
    step = []
    step.append(eq_json2(parse_expr(function)))
    if len(arr_result) ==0:
        return step
    elif len(arr_result) == 1:
        step.append(eq_json(simplify(str(varList[0])), simplify(arr_result[0])))
    else:
        or_step = []
        for res in arr_result:
            or_step.append(eq_json(simplify(str(varList[0])), simplify(res)))
        step.append(or_json(or_step))
    return step

def abs_equation(function, varList):
    start_time = time.time()
    data = {}
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("results = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    arr_result = get_arr_result(results, varList)
    data["step"] = step(function, arr_result, varList)
    data["root"] = arr_result
    data["time"] = time.time() - start_time
    data["classification"] = "C1"
    json_data = json.dumps(data)
    return json_data