from preprocess import preprocess
from inequation import inequation
from equation import equation
from detect_equation_inquation import detect_eq_inqe
import sys, json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import timeit

def solver(function, varList, angleMode):

    check_function = preprocess(function)

    if detect_eq_inqe(check_function):
        res_data = equation(check_function, varList, angleMode)
        # print(res_data)
    else:
        res_data = inequation(function)
        # data_trim = res_data.replace("\\","").replace('"[','[').replace(']"',']').replace('"{','{').replace('}"','}')
        # print('Json String: ', data_trim)
        # a2 = json.loads(res_data)
        # print('Test', a2['function'])
        # print('Test', a2['step'])
        # print('Test', a2['child'])
        # print('     ', a2['child'][0]['function'])
        # print('     ', a2['child'][0]['step'])
        # print('     ', a2['child'][0]['child'])
        # print('          ', a2['child'][0]['child'][0])
        # print('               ', a2['child'][0]['child'][0]['function'])
        # print('     ', a2['child'][0]['result'])
        # print('Test', a2['result'])
    return res_data


# solver("x**4-3*x**3-7*x**2+7*x+2")

#Read data from stdin
# def read_in():
#     lines = sys.stdin.readlines()
#     # Since our input would only be having one line, parse our JSON data from that
#     return json.loads(lines[0])
#     #return lines[0]

# def main():
#     data = read_in()
#     start = timeit.default_timer()
#     result = solver(data['sympy'])
#     stop = timeit.default_timer()
#     time = stop - start 

#     temp = str(result)
#     temp2 = json.loads(temp)

#     datareturn = {}
#     datareturn["time"] = time
#     datareturn["accurate"] = temp2
#     datareturn["approximate"] = ""
#     json_data = json.dumps(datareturn)
    
#     # result = {"sympy": sympyTrim, "numpy": normalTrim}
#     # json_data = json.dumps(result)
#     # print json_data
#     #print lines['node'][0]['node']
#     # Start process

# if __name__ == '__main__':
#     main()