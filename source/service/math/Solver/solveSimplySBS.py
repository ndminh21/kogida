from sympy import *
import timeit
import sys, json
from sympy.parsing.sympy_parser import parse_expr
from solver import solver

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    #return lines[0]

def main():
    data = read_in()

    results = solver(data['sympy'], data['varList'], data['angleMode'])

    # res = {}
    # res["accurate"] = latex(results)
    # appx = []
    # for result in results:
    #     appx.append(result.evalf(9))
    # res["approximate"] = str(appx)

    # datareturn = {}
    # datareturn["time"] = time
    # datareturn["result"] = res
    # json_data = json.dumps(datareturn)
    
    # result = {"sympy": sympyTrim, "numpy": normalTrim}
    # json_data = json.dumps(result)
    print(results)
    #print lines['node'][0]['node']
    # Start process
    #return results

if __name__ == '__main__':
    main()
