import sys
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr
from sympy.solvers.solvers import denoms
from copy import copy, deepcopy
x, y, z, t = symbols('x y z t')



def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])


def solveSystemSBS(varList,sympyArr,varNeedCal):
    # for varName in varList:
    #     exec(varName + "=Symbol(varName)")
    #exec(input)
    A, b = linear_eq_to_matrix(sympyArr, varNeedCal)
    lenA = len(A.row(0))
    M = A.col_insert(lenA, b)
    result = []
    if not M:
        return result
    
    rowCount = len(M.col(0))
    columnCount = len(M.row(0))
    listRow = []
    for i in range(rowCount):
        rowResult = []
        for j in range(columnCount):
            rowResult.append(latex(M[i, j]))
        listRow.append(rowResult)
    result.append({"and": listRow})

    for r in range(rowCount-1):
        trans = eye(rowCount)
        a1 = M[r,r]
        for r1 in range(r+1,rowCount):
            a2 = M[r1,r]
            if(a1 == a2):
                a1 = a2 = 1

            trans[r1,r] = -a2
            trans[r1,r1] = a1
            for j in range(columnCount):
                    M[r1, j] = a1 * M[r1, j] - M[r, j] * a2

        listRow = []
        listTrans = []
        for i in range(rowCount):
            rowResult = []
            transResult = []
            for j in range(columnCount):
                rowResult.append(latex(M[i, j]))
            for m in range(columnCount-1):
                transResult.append(latex(trans[i, m]))
            listRow.append(rowResult)
            listTrans.append(transResult)

        result.append({"and": listRow, "transformation": listTrans})


    for down in range(rowCount-1,-1,-1):
        if(M[down,down] != 1 and M[down,down] != 0):
            M[down, :] = M[down, :] / M[down, down]
            listRow = []
            for i in range(rowCount):
                rowResult = []
                for j in range(columnCount):
                    rowResult.append(latex(simplify(M[i, j])))
                listRow.append(rowResult)
            
            result.append({"and": listRow, "transformation": "null"})
        check = false
        for r in range(down):
            a1 = M[r, down]
            if(a1 != 0):
                check = true
            for j in range(columnCount):
                # if(M[r,j] != 1):
                #     check = true
                M[r, j] = M[r, j] - M[down, j] * a1
            if(M[r,r] != 0):
                M[r, :] = M[r, :] / M[r, r]
            listRow = []
            for i in range(rowCount):
                rowResult = []
                transResult = []
                for j in range(columnCount):
                    rowResult.append(latex(simplify(M[i, j])))
                listRow.append(rowResult)
        if(check):            
            result.append({"and": listRow, "transformation": "null"})

    return result

def main():
    data = read_in()

    results = solveSystemSBS(data['varList'],data['sympyArr'],data['varNeedCal'])

    print json.dumps(results)


if __name__ == '__main__':
    main()


#mtx = [[1, 0, 1, 3], [2, 3, 4, 7], [-1, -3, -3, -4]]

