import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from sympy.solvers.solvers import denoms
from copy import copy, deepcopy


def cal(conditions, expr):
    # get our data as an array from read_in()
    #dataond = read_in()
    #conditions = data['conditions']
    expr = parse_expr(expr)

    result = EmptySet()
    conditionSet = Interval(-oo, oo)
    for condition in conditions:
        sols = solve(condition, x)
        sols.sort()
        solLen = len(sols)
        result = EmptySet()
        for index, sol in enumerate(sols):
            complexSubs = complex(parse_expr(condition).subs(x, sol - 0.1))
            realSubs = complexSubs.real
            imagSubs = complexSubs.imag
            if (float(imagSubs) == 0.0):
                if (float(realSubs) > 0):
                    if index == 0:
                        result = result + Interval(-oo, sol)
                    else:
                        result = result + Interval(sols[index - 1], sol)
            complexSubs = complex(parse_expr(condition).subs(x, sol + 0.1))
            realSubs = complexSubs.real
            imagSubs = complexSubs.imag
            if (float(realSubs) > 0):
                if index == solLen - 1:
                    result = result + Interval(sol, oo)
                else:
                    result = result + Interval(sol, sols[index + 1])
        conditionSet = conditionSet.intersect(result)
    mauso = []
    for d in denoms(expr):
        for s in solve(d, x):
            sComplex = complex(s)
            if(sComplex.imag == 0.0):
                mauso.append(s)
    for cond in mauso:
        conditionSet = Interval(cond, cond).complement(conditionSet)

    print latex(conditionSet)




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



def getCondition(expr, conditionLeq,conditionEq):
    x = symbols('x')
    expr = parse_expr(expr)
    result = Interval(-oo, oo)
    dataReturn = {}
    for condition in conditionLeq:
        res = (solve_univariate_inequality(
            simplify(condition), x, relational=False))
        result = result.intersect(res)

    mauso = []
    for condition in conditionEq:
        for s in solve(condition, x):
            if(s.is_real == True):
                mauso.append(s)

    for d in denoms(expr):
        for s in solve(d, x):
            if(s.is_real == True):
                mauso.append(s)

    for cond in mauso:
        result = Interval(cond, cond).complement(result)
    data = {}
    childs = []
    if result.is_Interval:
        data = json_interval_finite(result)
    elif result.is_FiniteSet:
        data = json_interval_finite(result)
    elif result.is_Union:
        args = result.args
        for arg in args:
            childs.append(json_interval_finite(arg))
        data["unions"] = childs
    dataReturn["json"] = data
    dataReturn["interval"]  = result    
    return dataReturn


#mtx = [[1, 0, 1, 3], [2, 3, 4, 7], [-1, -3, -3, -4]]

#M = Matrix([[1, 0, 1, 3], [2, 3, 4, 7], [-1, -3, -3, -4]])
