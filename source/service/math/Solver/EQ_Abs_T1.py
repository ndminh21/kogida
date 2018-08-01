from sympy import *
import time
import json

def eq_json_start(function):
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

def step_abs_t1(function, varList, classification):
    datareturn = {}
    step = []
    root = []
    step.append(eq_json_start(classification["original"]))
    left = classification["lhs"]
    right = classification["rhs"]
    if classification["change"] == "yes":
        step.append(eq_json(left, right))

    first_step = []
    l_childs = []
    l_childs.append(ineq_json_original(right, "\geq", 0))
    l_childs.append(eq_json_original(left.args[0], right))
    first_step.append(and_json(l_childs))

    r_childs = []
    r_childs.append(ineq_json_original(right, "\geq", 0))
    r_childs.append(eq_json_original(left.args[0], -right))
    first_step.append(and_json(r_childs))

    step.append(longor_json(first_step))

    second_step = []
    if (right >= 0) == True:
        # second_step.append(solve_eq_step(Eq(left.args[0], right), varList))
        # second_step.append(solve_eq_step(Eq(left.args[0], -right), varList))
        # step.append(longor_json(second_step))
        stop = 0
    elif (right >= 0) == False:
        stop = 1
    else:
        stop = 0
        l_childs = []
        l_childs.append(solveSimply_step(right, ">=", 0, varList))
        l_childs.append(solve_eq_step(Eq(left.args[0], right), varList))
        if Eq(left.args[0], right) == False:
            stop += 1
        else:
            second_step.append(and_json(l_childs))

        r_childs = []
        r_childs.append(solveSimply_step(right, ">=", 0, varList))
        r_childs.append(solve_eq_step(Eq(left.args[0], -right), varList))
        if Eq(left.args[0], -right) == False:
            stop += 1
        else:
            second_step.append(and_json(r_childs))
        if stop == 0:
            step.append(longor_json(second_step))
        elif stop == 1:
            step.append(second_step[0])

    for varName in varList:
        exec (varName + "=Symbol(varName)")
    exec ("result = solveset(function," + str(varList[0]) + ",domain=S.Reals)")
    if len(result) == 1:
        for item in result:
            step.append(eq_json(simplify(varList[0]), item))
    elif len(result) > 1:
        childs = []
        for item in result:
            childs.append(eq_json(simplify(varList[0]), item))
        step.append(or_json(childs))

    for item in result:
        root.append(latex(item))

    datareturn["step"] = step
    datareturn["root"] = root
    return datareturn

def abs_t1(function, varList, classification):
    start_time = time.time()
    data = {}
    step_root = step_abs_t1(function, varList, classification)
    data["step"] = step_root["step"]
    data["root"] = step_root["root"]
    data["time"] = time.time() - start_time
    data["classification"] = "eq_t1"
    data["category"] = "eq"
    json_data = json.dumps(data)
    return json_data