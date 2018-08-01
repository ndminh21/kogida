from EQSYS_Classification import *
from EQSYS_Viet_1 import *
from EQSYS_Viet_2 import *
def eqsys(arr_eq, arr_var):
    classification = eqsys_classification(arr_eq, arr_var)
    if classification["classification"] == "eqsys_viet1":
        eqsys_viet1(arr_eq, arr_var, classification)
    elif classification["classification"] == "eqsys_viet2":
        eqsys_viet2(arr_eq, arr_var, classification)