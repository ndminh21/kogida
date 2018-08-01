from INEQ_Abs_Classification import *
from INEQ_Abs_t1 import *
from INEQ_Abs_t2 import *
from INEQ_Abs_t3 import *
from INEQ_Abs_t4 import *
from INEQ_Abs_t5 import *
from INEQ_Abs_t6 import *
from INEQ_Abs_t7 import *
from INEQ_Abs_t8 import *

def abs_ineq(function, varList):
    classification = classification_abs_equation(function, varList)
    if classification["classification"] == "ineq_t1":
        return ineq_t1(function, varList, classification)
    elif classification["classification"] == "ineq_t2":
        return ineq_t2(function, varList, classification)
    elif classification["classification"] == "ineq_t3":
        return ineq_t3(function, varList, classification)
    elif classification["classification"] == "ineq_t4":
        return ineq_t4(function, varList, classification)
    elif classification["classification"] == "ineq_t5":
        return ineq_t5(function, varList, classification)
    elif classification["classification"] == "ineq_t6":
        return ineq_t6(function, varList, classification)
    elif classification["classification"] == "ineq_t7":
        return ineq_t7(function, varList, classification)
    elif classification["classification"] == "ineq_t8":
        return ineq_t8(function, varList, classification)


# print abs_ineq("Abs(x-1)<2*x-10",['x'])
# print abs_ineq("Abs(x-1)<=2*x-10",['x'])
# print abs_ineq("Abs(x-1)>2*x-10",['x'])
# print abs_ineq("Abs(x-1)>=2*x-10",['x'])
# print abs_ineq("Abs(x-1)<Abs(x+3)",['x'])
# print abs_ineq("Abs(x-1)<=Abs(x+3)",['x'])
# print abs_ineq("Abs(x-1)>Abs(x+3)",['x'])
# print abs_ineq("Abs(x-1)>=Abs(x+3)",['x'])