from INEQ_Classification_Radical import classification_radical
from INEQ_Radical_C1 import solve_radical_ineqSBS_c1
from INEQ_Radical_C2 import solve_radical_ineqSBS_c2
from INEQ_Radical_C3 import solve_radical_ineqSBS_c3
from INEQ_Radical_C4 import solve_radical_ineqSBS_c4
from INEQ_Radical_C5 import solve_radical_ineqSBS_c5
from INEQ_Radical_C6 import solve_radical_ineqSBS_c6
from INEQ_Radical_C7 import solve_radical_ineqSBS_c7
from INEQ_Radical_C8 import solve_radical_ineqSBS_c8
from INEQ_Radical_Nosupport import solve_radical_ineqSBS_nosupport

def ineq_radical(function, varList):
    classification = classification_radical(function, varList)
    if classification["classification"] == "ineq_c1":
        return solve_radical_ineqSBS_c1(classification["preprocess"], varList)
    elif classification["classification"] == "ineq_c2":
        return solve_radical_ineqSBS_c2(classification["preprocess"], varList)
    elif classification["classification"] == "ineq_c3":
        return solve_radical_ineqSBS_c3(classification["preprocess"], varList)
    elif classification["classification"] == "ineq_c4":
        return solve_radical_ineqSBS_c4(classification["preprocess"], varList)
    elif classification["classification"] == "ineq_c5":
        return solve_radical_ineqSBS_c5(classification, varList)
    elif classification["classification"] == "ineq_c6":
        return solve_radical_ineqSBS_c6(classification, varList)
    elif classification["classification"] == "ineq_c7":
        return solve_radical_ineqSBS_c7(classification, varList)
    elif classification["classification"] == "ineq_c8":
        return solve_radical_ineqSBS_c8(classification, varList)
    else:
        return solve_radical_ineqSBS_nosupport(classification, varList)