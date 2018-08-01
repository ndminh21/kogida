from sympy import *
import json
import time

def eq_json_original(function, val):
    data = {}
    data["val"] = latex(function) + " = " + val
    res_data = {}
    res_data["eq"] = data
    return res_data

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

def eq_start_json(function):
    data = {}
    data["val"] = latex(function)
    res_data = {}
    res_data["start"] = data
    return res_data

def trigo_equation(function, varList, angleMode):
    start_time = time.time()
    for varName in varList:
        exec (varName + "=Symbol(varName)")
    datareturn = {}
    step = []
    data = {}
    arr_root = []

    if varList[0] != 'k':
        k = Symbol('k')
    else:
        k = Symbol('m')
    step.append(eq_start_json(simplify(function)))
    try:
        exec ("results = solve(function," + str(varList[0]) + ",domain=S.Reals)")
    except Exception, e:
        json_data = json.dumps(data)
        return json_data
    if len(results) == 0:
        data["val"] = "null"
        res_data = {}
        res_data["eq"] = data
    elif len(results) == 1:
        for re in results:
            if angleMode == "rad":
                step.append(eq_json_original(simplify(str(varList[0])), (latex(re) + " + " + latex(2 * k) + latex(pi))))
                arr_root.append(latex(re) + " + " + latex(2 * k) + latex(pi))
            else:
                step.append(eq_json_original(simplify(str(varList[0])), (latex(re) + " + " + latex(360 * k))))
                arr_root.append(latex(re) + " + " + latex(360 * k))

    else:
        res_data = []
        for re in results:
            if angleMode == "rad":
                res_data.append(eq_json_original(simplify(str(varList[0])), (latex(re) + " + " + latex(2 * k) + latex(pi))))
                arr_root.append(latex(re) + " + " + latex(2 * k) + latex(pi))
            else:
                res_data.append(eq_json(simplify(str(varList[0])), (re + 360*k)))
                arr_root.append(latex(re) + " + " + latex(360 * k))

        data["or"] = res_data
    step.append(data)

    datareturn["step"] = step
    datareturn["root"] = arr_root
    datareturn["time"] = time.time() - start_time
    datareturn["classification"] = "polyeq"
    datareturn["category"] = "eq"
    json_data = json.dumps(datareturn)
    return json_data