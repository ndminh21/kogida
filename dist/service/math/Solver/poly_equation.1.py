from sympy import *
import re
import json

x = Symbol('x')

def solve_1_degree(function):
    simplify_function = simplify(function)
    if str(simplify_function).replace(' ', '') != function:
        dm = 0
        # print(simplify_function, '= 0')
    result = str(solve(function))
    # print('Result:', result)
    return result

def solve_2_degree (function):

    a = 0
    b = 0
    c = 0
    match = re.search(r'\d*\*x\*\*2', function)
    if match:
        a = int(match.group().replace('*x**2', ''))
        # print('a =', a)
    else:
        match = re.search(r'x\*\*2', function)
        if match:
            a = 1
            # print('a =', a)

    match = re.search(r'["+ "|"\- "]+\d*\*x', function)
    if match:
        b = int(match.group().replace('*x', '').replace(' ', ''))
        # print('b =', b)
    else:
        match = re.search(r'x[^*]', function)
        if match:
            b = 1
        # print('b =', b)

    match = re.search(r'[^*\+][" "]*(\d)+$', function)
    if match:
        c = int(match.group().replace(" ", ""))
        # print('c =', c)

    delta = b**2 - 4*a*c
    # print('delta = ', delta)

    # if delta < 0:
    #     print("Phuong trinh vo nghiem:")
    #     return
    # elif delta == 0:
    #     print("Phuong trinh co nghiem kep:", -b/(2*a))
    # else:
    #     print("Phuong trinh co hai nghiem:")


def solve_3_degree(function):

    match = re.search(r'^[-\|+]\d+\*\((\.)+\)$', function)
    if match:
        # print('123abcd')
        match = re.search(r'\*\((\.)+\)$', function)
        if match:
            temp = str(match.group())[1:]
            # print(temp)
        return
    a = ""
    b = ""
    c = ""

    match = re.search(r'\([^)]+\)\*\*\d+', function)
    if match:
        a = str(match.group())
    else:
        match = re.search(r'\([^)]+\)', function)
        if match:
            a = str(match.group().replace('(', '')).replace(')', '')
    if a == function:
        return
    match = re.search(r'\*\([^)]+\)\*\*\d+', function)
    if match:
        b = str(match.group())
    else:
        match = re.search(r'\*\([^)]+\)', function)
        if match:
            b = str(match.group().replace('*(', '')).replace(')', '')

    match = re.search(r'\*\([^)]+\)\*\*\d+$', function)
    if match:
        c = str(match.group())
    else:
        match = re.search(r'\*\([^)]+\)$', function)
        if match:
            c = str(match.group().replace('*(', '')).replace(')', '')

    if a == b:
        a = 'x'
    # print('Solve:')
    # print('1/', a, '= 0')
    poly_equation(a)
    # print('2/', b, '= 0')
    poly_equation(b)
    if b != c:
        # print('3/', c, '= 0')
        poly_equation(c)

def poly(function):
    new_functions = []
    result = []
    indexs = [m.start() for m in re.finditer('\)\*\*\d+\*\(', function)]
    if indexs:
        indexs = [m.start() for m in re.finditer('\)\*\*\d+\*\(', function)]
        for i in range(len(indexs) + 1):
            if i == 0:
                new_functions.append(function[:indexs[0] + 4])
            elif i == len(indexs):
                new_functions.append(function[indexs[i-1] + 5:])
            else:
                new_functions.append(function[indexs[i - 1] + 5:[indexs[i] + 4]])

        for new_function in new_functions:
            result.append(poly_equation(new_function))
        return result
    else:
        result.append(poly_equation(function))
        return result


def solve_n_degree(function):
    indexs = [m.start() for m in re.finditer('\)\*\(', function)]
    new_functions = []
    for i in range(len(indexs)+1):
        if i == 0:
            new_functions.append(function[:indexs[0]+1])
        elif i == (len(indexs)):
            new_functions.append(function[indexs[i-1] + 2:])
        else:
            new_functions.append(function[indexs[i-1] + 2:indexs[i]+1])

    # print("Solve:")
    childs = []
    for new_function in new_functions:


        results = poly(new_function)
        for result in results:
            temp = str(result)
            temp2 = json.loads(temp)
            childs.append(temp2)

    return childs


    # indexs = [m.start() for m in re.finditer('\)\*\*\d+\*\(', function)]
    # print(len(indexs))
    # for i in range(len(indexs)+1):
    #     if i == 0:
    #         new_functions.append(function[:indexs[0]+1])
    #     elif i == (len(indexs)):
    #         new_functions.append(function[indexs[i-1] + 2:])
    #     else:
    #         new_functions.append(function[indexs[i-1] + 2:indexs[i]+1])
    #     print(i)
    # print(indexs)
    # print(new_functions)

def json_function(function):
    simplify_function = simplify(function)
    data = {}
    data["none"] = latex(Eq(simplify_function,0))
    json_data = json.dumps(data)

def json_result(results):
    res = []
    for result in results:
        res.append(latex(result))
    data = {}
    data["or"] = res

    datareturn = {}
    datareturn["value"] = data
    datareturn["next"] = "null"
    json_datareturn = json.dumps(datareturn)

    return datareturn

def json_poly(function):
    
    indexs = [m.start() for m in re.finditer('\)\*\(', function)]
    new_functions = []
    if len(indexs) > 0:
        for i in range(len(indexs)+1):
            if i == 0:
                index_x = [m.start() for m in re.finditer('x\*\(', function)]
                new_functions.append(function[:index_x+1])
                new_functions.append(function[index_x+1:indexs[0]+1])

                # new_functions.append(function[:indexs[0]+1])
            elif i == (len(indexs)):
                new_functions.append(function[indexs[i-1] + 2:])
            else:
                new_functions.append(function[indexs[i-1] + 2:indexs[i]+1])

    childs = []
    for new_function in new_functions:
        temp = simplify(new_function)
        childs.append(latex(Eq(temp,0)))
    data = {}
    data["or"] = childs

    result = solveset(function, domain=S.Reals)

    datareturn = {}
    datareturn["value"] = data
    datareturn["next"] = json_result(result)

    # json_datareturn = json.dumps(datareturn)

    return datareturn

def json_poly_equation(function):
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)

    data = {}
    data2 = {}

    if simplify_function == factor_function:
        res = {}
        res["none"] = latex(simplify)
        data["value"] = res
        data["next"] = json_poly(str(factor_function))
    else:
        res = {}
        res["none"] = latex(Eq(simplify_function,0))
        res2 = {}
        res2["iff"] = latex(Eq(factor_function,0))
        data2["next"] = json_poly(str(factor_function))
        data2["value"] = res2
        data["value"] = res
        data["next"] = data2

    json_data = json.dumps(data)
    return json_data

def json_1_degree(function):
    simplify_function = simplify(function)
    result = solveset(function, domain=S.Reals)
    data = {}
    res = {}
    res["none"] = latex(Eq(simplify_function,0))
    data["value"] = res
    data["next"] = json_result(result)
    json_data = json.dumps(data)
    return json_data
    
def poly_equation(function):
    simplify_function = simplify(function)
    factor_function = factor(simplify_function)
        
    if simplify_function != factor_function:
        return json_poly_equation(function)
    else:
        return json_1_degree(function)

# def poly_equation(function):
#     test = {}
#     datareturn = {}
#     datareturn["function"] = str(function) + ' = 0' 
#     step = []

#     degree_function = degree(function)

#     if degree_function == 1:
#         result = solve_1_degree(function)
#         datareturn["step"] = []
#         datareturn["child"] = []
#         datareturn["result"] = result

#     elif degree_function == 2:

#         simplify_function = simplify(function)
#         factor_function = factor(simplify_function)

#         if str(simplify_function).replace(' ', '') != function:
#             # print(simplify(function), '= 0')
#             step.append(str(simplify_function)+' = 0 ')

#         if factor_function != simplify_function:
#             # print(factor_function, '= 0')
#             step.append(str(factor_function) + ' = 0 ')

#         else:
#             match = re.search(r'\([^)]+\)\*\*\d+', str(simplify_function))
#             if match:
#                 dm = 0
#                 # print(str(simplify_function).replace("(", "").replace(")**2", ""))
#             else:
#                 match = re.search(r'x\*\(', str(simplify_function))
#                 if match:
#                     index_muilty = str(simplify_function).index('*(')
#                     # print("Solve")
#                     # print(str(simplify_function)[:index_muilty], '= 0')
#                     # print(str(simplify_function)[index_muilty + 1:].replace('(', '').replace(')', ''), '= 0')

#                 else:
#                     abc = str(factor_function)
#                     solve_2_degree(abc)

#         result = solveset(function, domain=S.Reals)
#         # print('Result:', result)
#         datareturn["step"] = []
#         datareturn["child"] = []
#         datareturn["result"] = latex(result)


#     elif degree_function == 3:

#         simplify_function = simplify(function)
#         factor_function = factor(simplify_function)

#         if str(simplify_function).replace(' ', '') != function:
#             dm = 0
#             # print(simplify(function), '= 0')
#         if factor_function != simplify_function:
#             # print(factor_function, '= 0')
#             solve_3_degree(str(factor_function))
#         else:
#             match = re.search(r'\*\*3$', function)
#             if match:
#                 solve_3_degree(str(factor_function))
#         result = solveset(function, domain=S.Reals)
#         # print('Conclusion:', result)
#         datareturn["step"] = []
#         datareturn["child"] = []
#         datareturn["result"] = latex(result)

#     else:

#         simplify_function = simplify(function)
#         factor_function = factor(simplify_function)

#         if str(simplify_function).replace(' ', '') != function:
#             # print(simplify(function), '= 0')
#             step.append(str(simplify(function)) + ' = 0')
#         if factor_function != simplify_function:
#             # print(factor_function, '= 0')
#             step.append(str(factor_function)+' = 0')
#             result = solve_n_degree(str(factor_function))

#             datareturn["step"] = step
#             datareturn["child"] = result

#             # index = str(factor_function).index(')*(')
#             # print(index)
#             # print('Solve:')
#             # print
#         else:
#             # solve_3_degree(str(factor_function))
#             dm = 0

#         result = solveset(function, domain=S.Reals)
#         # print('Conclusion:', result)
#         datareturn["result"] = latex(result)

#     test = json_poly_equation(function)

#     json_data = json.dumps(datareturn)
#     return test

