from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import re
import json

def classification_sub(arr_eq, arr_var):
    datareturn = {}
    step_change = []
    for varName in arr_var:
        exec (varName + "=Symbol(varName)")
    sub = False
    sub_expr = ""
    cal_eq = ""
    childs_original = []
    for item in arr_eq:
        original_function = parse_expr(str(item), evaluate=False)
        childs_original.append(original_function)
        simplify_function = simplify(original_function)
        check_expr = simplify_function.lhs - simplify_function.rhs
        try:
            figure = Poly(str(check_expr), simplify(arr_var[0])).all_coeffs()
            for fig in figure:
                match = re.search(arr_var[1], str(fig))
                if match:
                    sub = True
                    sub_expr = check_expr
        except Exception:
            cal_eq = simplify_function
    step_change.append(childs_original)
    if sub:
        var_1 = solve(sub_expr, simplify(arr_var[1]))
        new_lhs = cal_eq.lhs.subs({simplify(arr_var[1]): var_1[0]})
        new_rhs = cal_eq.rhs.subs({simplify(arr_var[1]): var_1[0]})
        first_eq = Eq(simplify(arr_var[1]), var_1[0])
        second_eq = Eq(new_lhs, new_rhs)
        step_change.append([first_eq, second_eq])
        datareturn["classification"] = "eqsys_sub1"
        datareturn["step_change"] = step_change
        datareturn["first_eq"] = first_eq
        datareturn["second_eq"] = second_eq
    else:
        datareturn["classification"] = "nonlineareqsys"

    return datareturn

def classification_viet(arr_eq, arr_var):
    datareturn = {}
    step_change = []
    for varName in arr_var:
        exec (varName + "=Symbol(varName)")
    s_eq = ""
    p_eq = ""
    var = arr_var[0] + "\*" + arr_var[1]
    for item in arr_eq:
        original_function = parse_expr(str(item), evaluate=False)
        simplify_function = simplify(original_function)
        exec ("match = re.search(var, str(simplify_function))")
        if match:
            p_eq = original_function
        else:
            exec ("match = re.search(arr_var[0], str(simplify_function))")
            if match:
                exec ("match = re.search(arr_var[1], str(simplify_function))")
                if match:
                    s_eq = original_function
    step_change.append([s_eq, p_eq])
    if s_eq != "" and p_eq != "":
        s_eq_sim = simplify(s_eq)
        p_eq_sim = simplify(p_eq)
    else:
        return classification_sub(arr_eq, arr_var)

    if str(s_eq_sim) != str(s_eq) or str(p_eq_sim) != str(p_eq):
        step_change.append([s_eq_sim, p_eq_sim])

    left_s = s_eq_sim.lhs
    right_s = s_eq_sim.rhs
    new_s_eq = simplify(left_s - right_s)
    new_left_s = "0"
    new_right_s = "0"

    for item in new_s_eq.args:
        try:
            deg = degree(item)
            new_left_s += "+" + str(item)
        except Exception:
            new_right_s += "-" + str(item)
    new_left_s = simplify(new_left_s)
    new_right_s = simplify(new_right_s)
    change_op = 0
    for item in new_left_s.args:
        if str(item)[0] == "-":
            change_op += 1
    if change_op == 2:
        new_left_s = -new_left_s
        new_right_s = -new_right_s
    new_s_eq = Eq(new_left_s, new_right_s)

    left_p = p_eq_sim.lhs
    right_p = p_eq_sim.rhs
    new_p_eq = simplify(left_p - right_p)
    new_left_p = "0"
    new_right_p = "0"
    for item in new_p_eq.args:
        try:
            deg = degree(item)
            new_left_p += "+" + str(item)
        except Exception:
            new_right_p += "-" + str(item)
    new_left_p = simplify(new_left_p)
    new_right_p = simplify(new_right_p)
    change_op = 0
    for item in new_left_p.args:
        if str(item)[0] == "-":
            change_op += 1
    if change_op == 1:
        new_left_p = -new_left_p
        new_right_p = -new_right_p
    new_s_eq = Eq(new_left_s, new_right_s)
    new_p_eq = Eq(new_left_p, new_right_p)

    if str(s_eq_sim) != str(new_s_eq) or str(p_eq_sim) != str(new_p_eq):
        step_change.append([new_s_eq, new_p_eq])

    arr_figure = []
    for item in new_left_s.args:
        a = str(item).replace(arr_var[0], '').replace(arr_var[1], '')
        if len(a) == 0:
            arr_figure.append("1")
        elif a == "-":
            arr_figure.append("-1")
        else:
            arr_figure.append(a[:len(a) - 1])
    if arr_figure[0] != arr_figure[1]:
        if simplify(arr_figure[0]) == -simplify(arr_figure[1]):
            if simplify(arr_figure[0]) > 0:
                left_s = new_s_eq.lhs / simplify(arr_figure[0])
                right_s = new_s_eq.rhs / simplify(arr_figure[0])
                datareturn["nagative"] = 2
            else:
                left_s = new_s_eq.lhs / simplify(arr_figure[1])
                right_s = new_s_eq.rhs / simplify(arr_figure[1])
                datareturn["nagative"] = 1
            last_s_eq = Eq(left_s, right_s)

            arr_figure = []
            for item in new_left_p.args:
                a = str(item).replace(arr_var[0], '').replace(arr_var[1], '')

                if len(a) == 0:
                    arr_figure.append("1")
                else:
                    arr_figure.append(a)
            if simplify(arr_figure) > 0:
                left_p = -new_p_eq.lhs / simplify(arr_figure[0])
                right_p = -new_p_eq.rhs / simplify(arr_figure[0])
                last_p_eq = Eq(left_p, right_p)

            if str(last_s_eq) != str(new_s_eq) or str(last_p_eq) != str(new_p_eq):
                step_change.append([last_s_eq, last_p_eq])

            datareturn["step_change"] = step_change
            datareturn["s_eq"] = last_s_eq
            datareturn["p_eq"] = last_p_eq
            datareturn["classification"] = "eqsys_viet2"

    else:
        left_s = new_s_eq.lhs / simplify(arr_figure[0])
        right_s = new_s_eq.rhs / simplify(arr_figure[0])
        last_s_eq = Eq(left_s, right_s)

        arr_figure = []
        for item in new_left_p.args:
            a = str(item).replace(arr_var[0], '').replace(arr_var[1], '')
            if len(a) == 0:
                arr_figure.append("1")
            else:
                arr_figure.append(a)

        left_p = new_p_eq.lhs / simplify(arr_figure[0])
        right_p = new_p_eq.rhs / simplify(arr_figure[0])
        last_p_eq = Eq(left_p, right_p)

        if str(last_s_eq) != str(new_s_eq) or str(last_p_eq) != str(new_p_eq):
            step_change.append([last_s_eq, last_p_eq])

        datareturn["step_change"] = step_change
        datareturn["s_eq"] = last_s_eq
        datareturn["p_eq"] = last_p_eq
        datareturn["classification"] = "eqsys_viet1"
    return datareturn

def classification_super(arr_eq, arr_var):
    datareturn = {}
    step_change = []

    step_change.append([parse_expr(str(arr_eq[0]), evaluate=False), parse_expr(str(arr_eq[1]), evaluate=False)])

    arr_eq[0] = simplify(arr_eq[0])
    left_1 = arr_eq[0].lhs
    right_1 = arr_eq[0].rhs
    new_1 = simplify(left_1 - right_1)
    new_left_1 = "0"
    new_right_1 = "0"
    for item in new_1.args:
        try:
            deg = degree(item)
            new_left_1 += "+" + str(item)
        except Exception:
            new_right_1 += "-" + str(item)
    new_left_1 = simplify(new_left_1)
    new_right_1 = simplify(new_right_1)
    if str(new_left_1)[0] == "-":
        new_left_1 = - new_left_1
        new_right_1 = - new_right_1
    new_1 = Eq(new_left_1, new_right_1)

    arr_eq[1] = simplify(arr_eq[1])
    left_2 = arr_eq[1].lhs
    right_2 = arr_eq[1].rhs
    new_2 = simplify(left_2 - right_2)
    new_left_2 = "0"
    new_right_2 = "0"
    for item in new_2.args:
        try:
            deg = degree(item)
            new_left_2 += "+" + str(item)
        except Exception:
            new_right_2 += "-" + str(item)
    new_left_2 = simplify(new_left_2)
    new_right_2 = simplify(new_right_2)
    if str(new_left_2)[0] == "-":
        new_left_2 = - new_left_2
        new_right_2 = - new_right_2
    new_2 = Eq(new_left_2, new_right_2)
    step_change.append([new_1, new_2])
    super = True
    for item in new_left_1.args:
        try:
            degree_item = degree(item)
            if degree_item == 2:
                check_string = str(item)[len(str(item))-4:len(str(item))]
                if check_string != str(simplify(arr_var[0])**2) and check_string != str(simplify(arr_var[1])**2):
                    super = False
            elif degree_item == 1:
                check_string = str(item)[len(str(item))-3:len(str(item))]
                if check_string != str(simplify(arr_var[0])*simplify(arr_var[1])):
                    super = False
        except Exception:
            super = False

    for item in new_left_2.args:
        try:
            degree_item = degree(item)
            if degree_item == 2:
                check_string = str(item)[len(str(item))-4:len(str(item))]
                if check_string != str(simplify(arr_var[0])**2) and check_string != str(simplify(arr_var[1])**2):
                    super = False
            elif degree_item == 1:
                check_string = str(item)[len(str(item))-3:len(str(item))]
                if check_string != str(simplify(arr_var[0])*simplify(arr_var[1])):
                    super = False
        except Exception:
            super = False
    if super:
        datareturn["step_change"] = step_change
        datareturn["classification"] = "eqsys_super2"
        datareturn["first_eq"] = new_1
        datareturn["second_eq"] = new_2
        return datareturn
    else:
        return classification_sub(arr_eq, arr_var)

def eqsys_classification(arr_eq, arr_var):
    if len(arr_var) == 2 and len(arr_eq) ==2:
        max_degree = 0
        for item in arr_eq:
            expr_check = simplify(item)
            try:
                if degree(expr_check.lhs) > max_degree:
                    max_degree = degree(expr_check.lhs)
                if degree(expr_check.rhs) > max_degree:
                    max_degree = degree(expr_check.rhs)
            except Exception:
                error = 0
        if max_degree == 1:
            return classification_viet(arr_eq, arr_var)
        elif max_degree == 2:
            return classification_super(arr_eq, arr_var)
        else:
            return classification_sub(arr_eq, arr_var)

# print eqsys_classification(['Eq(3*x+y,14)', 'Eq(sqrt(x+y)+sqrt(y-x),-5)'], ['x', 'y'])
# print eqsys_classification(['Eq(2*x-2*y,-12)', 'Eq(x*y,-5)'],['x','y'])
# print eqsys_classification(['Eq(-2*x+2*y,-12)', 'Eq(-x*y,5)'],['x','y'])
# print eqsys_classification(['Eq(2*x*y,-8)', 'Eq(3*x + 3*y,-15)'],['x','y'])
# print eqsys_classification(['Eq(-8, 2*x+2*y)', 'Eq(3*x*y,-15)'],['x','y'])
# print eqsys_classification(['Eq(2*x*y,-8)', 'Eq(3*x + 3*y,-15)'],['x','y'])

# print eqsys_classification(['Eq(-8, -2+2*x+2*y)', 'Eq(-15 - x*y, 3*x*y)'],['x','y'])

# print eqsys_classification(['Eq(-8, -x-y)', 'Eq(-15 - x*y, 3*x*y)'],['x','y'])