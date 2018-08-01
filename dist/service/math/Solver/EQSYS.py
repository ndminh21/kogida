import sys
from EQSYS_Classification import *
from EQSYS_Viet_1 import *
from EQSYS_Viet_2 import *
from EQSYS_Super_2 import *
from EQSYS_Sub_1 import *

def eqsys(arr_eq, arr_var):
    classification = eqsys_classification(arr_eq, arr_var)
    if classification["classification"] == "eqsys_viet1":
        return eqsys_viet1(arr_eq, arr_var, classification)
    elif classification["classification"] == "eqsys_viet2":
        return eqsys_viet2(arr_eq, arr_var, classification)
    elif classification["classification"] == "eqsys_super2":
        return eqsys_super2(arr_eq, arr_var, classification)
    elif classification["classification"] == "eqsys_sub1":
        return eqsys_sub1(arr_eq, arr_var, classification)
    else:
        data = {}
        data["classification"] = "nonlineareqsys"
        json_data = json.dumps(data)
        return json_data

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    data = read_in()

    results = eqsys(data['sympyArr'],data['varNeedCal'])

    print results


if __name__ == '__main__':
    main()
