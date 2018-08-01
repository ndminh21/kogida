import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
import re
#Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON  data from that
    return json.loads(lines[0])
    #return lines[0]


def logAbs(x):
    return nsimplify(log(abs(x)))

def main():
    try:
        data = read_in()
        
        for varName in data['varList']:
            exec(varName + "=Symbol(varName)")
            
        #Declare for limit with 1 parameter
        n = Symbol('n')   
        
        exec(data['sympy'])
        sympy = latex(expand((nsimplify(parse_expr(data['sympy'])).replace(log,logAbs))))
        sympyTrim = sympy.replace('.0 ', ' ').replace('log','ln').replace(".",",").replace("\\cdot", "\\times")
        sympyLen = len(sympyTrim)
        
        if (sympyLen > 2) and (sympyTrim[sympyLen - 1] == '0') and (sympyTrim[sympyLen - 2] == '.'):
            sympyTrim = sympyTrim[:sympyLen - 2]
 
        normal = latex(N(parse_expr(data['sympy']), '9').replace(log,logAbs))
        normalTrim = normal.replace('.0 ', ' ').replace('log', 'ln').replace('.', ',').replace("\\cdot", "\\times")
        normalLen = len(normalTrim)
        
        if (normalLen > 2) and (normalTrim[normalLen - 1] == '0') and (normalTrim[normalLen - 2] == '.'):
            normalTrim = normalTrim[:normalLen - 2]

        match = re.search(r'Integral', data['sympy'])
        if match:
            sympyTrim += " + C"
            normalTrim += " + C"
        result = {"beauty": sympyTrim, "normal": normalTrim}
        json_data = json.dumps(result)
        
        print json_data
    except Exception, e:
        error = {"error" : str(e)}
        print json.dumps(error)

if __name__ == '__main__':
    main()
