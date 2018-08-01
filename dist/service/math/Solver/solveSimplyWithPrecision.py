from sympy import *
import timeit
import sys, json
from sympy.parsing.sympy_parser import parse_expr
from pyasn1.compat.octets import null

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    #return lines[0]

def main():
    data = read_in()
    start = timeit.default_timer()
    results = solve(data['sympy'], domain=S.Reals)
    stop = timeit.default_timer()
    time = stop - start 
    prec = data['prec']
    res = {}
    res["accurate"] = latex(results)
    appx = []
    for result in results:
        appx.append(result.evalf(prec))
    res["approximate"] = str(appx)

    datareturn = {}
    datareturn["time"] = time
    datareturn["result"] = res
    json_data = json.dumps(datareturn)
    
    # result = {"sympy": sympyTrim, "numpy": normalTrim}
    # json_data = json.dumps(result)
    print json_data
    #print lines['node'][0]['node']
    # Start process

if __name__ == '__main__':
    main()