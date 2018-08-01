from sympy import *
import sys,json
from sympy.parsing.sympy_parser import parse_expr


#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
    #return lines[0]

def reformat(data):
    data = data["data"]
    results = []
    for var in data["variablesList"]:
        exec (var + "=Symbol(var)")
    value = {}
    for idx, key in enumerate(data["KeyArr"]):
        value[key] = data["ValueArr"][idx]
    # print value
    
    for data_item in data["result"]:
        result = []
        for idx, expr in enumerate(data_item):
            left_expr = simplify(expr["lhs"])
            right_expr = simplify(expr["rhs"])
            mid_expr = expr["mid"]
            if(mid_expr != ""):
                mid_expr = simplify(mid_expr)
                new_expr = Eq(Eq(left_expr, mid_expr),right_expr)
            else:
                new_expr = Eq(left_expr, right_expr)
            evalue_result = right_expr
            for var in data["KeyArr"]:
                try:
                    evalue_result = evalue_result.subs({str(var): "(" + str((value[var]) + ")")})
                except Exception, e:
                    error = 0

            format = {}
            evalue_result = parse_expr(str(evalue_result), evaluate=False)
            value_result = simplify(str(evalue_result))
            value[str(left_expr)] = str(value_result)
            format["test"] = str(evalue_result)
            format["format1"] = ("\\displaystyle " + latex(new_expr) + " = " + latex(evalue_result) + " = " + latex(value_result)).replace("\\cdot","\\times")
            format["format2"] = ("\\displaystyle " + latex(new_expr) + " = " + latex(value_result)).replace("\\cdot", "\\times")
            format["format3"] = ("\\displaystyle " + latex(Eq(left_expr, evalue_result)) + " = " + latex(value_result)).replace("\\cdot", "\\times")
            format["format4"] = ("\\displaystyle " + latex(Eq(left_expr, value_result))).replace("\\cdot", "\\times")
            data["KeyArr"].append(str(left_expr))
            value[str(left_expr)] = "(" + str(parse_expr(str(value_result))) +")"
            for tex in data["texList"]:
                format["format1"] = format["format1"].replace(tex["variables"], tex["tex"])
                format["format2"] = format["format2"].replace(tex["variables"], tex["tex"])
                format["format3"] = format["format3"].replace(tex["variables"], tex["tex"])
                format["format4"] = format["format4"].replace(tex["variables"], tex["tex"])
            result.append(format)
            
        results.append(result)
    data_json = json.dumps(results)
    return data_json

def main():
    data = read_in()
    print reformat(data)
    #print lines['node'][0]['node']
    # Start process

if __name__ == '__main__':
    main()
