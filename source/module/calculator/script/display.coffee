class TexMathDisplay
    constructor: (value, focus) ->
        @focus = if focus? then focus else 0
        @value = if value? then value else ""
        @maxChildren = 
        [
            2, 
            1, 2, 
            2,
            3, 1,
            4, 4,
            4, 4,
            undefined,
            undefined,
            1, 1, 1,
            1, 2, 2, 3
            2, 3, 1, 2, 1, 2,
            1, 1, 1
            1,
            2,
            4, 4,
            2, 2,
            1
        ]
        @specScope = 
            left: [

            ],
            right: [
                {
                    op: "\\sin{"
                    index: 0
                },
                {
                    op: "\\cos{"
                    index: 0
                },
                {
                    op: "\\tan{"
                    index: 0
                },
                {
                    op: "\\cot{"
                    index: 0
                },
                {
                    op: "\\nlog{"
                    index: 1
                },
                {
                    op: "\\pnlog{"
                    index: 2
                },
                {
                    op: "\\logdec{"
                    index: 0
                },
                {
                    op: "\\plogdec{",
                    index: 1
                },
                {
                    op: "\\lognepe{",
                    index: 0
                },
                {
                    op: "\\plognepe{",
                    index: 1
                },
                {
                    op: "\\summary{",
                    index: 3
                },
                {
                    op: "\\smallsummary{",
                    index: 3
                },
                {
                    op: "\\product{",
                    index: 3
                },
                {
                    op: "\\smallproduct{",
                    index: 3
                },
                {
                    op: "\\limit{",
                    index: 2
                },
                {
                    op: "\\limitn{",
                    index: 0
                },
                {
                    op: "\\infint{",
                    index: 1
                },
                {
                    op: "\\smallinfint{",
                    index: 1
                },
                {
                    op: "\\integral{",
                    index: 3
                },
                {
                    op: "\\smallintegral{",
                    index: 3
                }
            ]
        @token =
            start: [
                "\\frac{",
                "\\sqrt{", "\\sqrt[",
                "\\power{",
                "\\limit{", "\\limitn{",
                "\\summary{", "\\smallsummary{",
                "\\product{", "\\smallproduct{",
                "\\left\\{\\begin{array}{l}{",
                "\\left[\\begin{array}{l}{",
                "\\sin{", "\\cos{", "\\tan{", "\\cot{",
                "\\deri{", "\\nderi{", "\\fderi{", "\\fnderi{",
                "\\nlog{", "\\pnlog{", "\\lognepe{", "\\plognepe{", "\\logdec{", "\\plogdec{"
                "\\parentheses{", "\\bracket{", "\\brace{",
                "\\absolute{",
                "\\subscript{", "\\psubscript{",
                "\\integral{", "\\smallintegral{",
                "\\smallinfint{", "\\infint{",
                "\\exp{"
            ],
            intermediate: [
                "}{", "]{",
                "}\\\\{"
            ],
            end: [
                "}\\\\\\end{array}\\right.",
                "}"
            ],
            unimportant: [
                "\\pm ",
                "\\times ",
                "\\div ",
                "+",
                "-",
                "<", ">",
                "\\leq ", "\\geq ",
                "\\ll ", "\\gg ",
                "=", "\\neq ",
                "\\angle "
            ],
            literal: [
                "\\alpha " , "\\beta ", "\\gamma " , "\\Gamma " , "\\Delta " , "\\delta " , "\\epsilon " , "\\varepsilon " , "\\zeta " , "\\eta " , "\\Theta " , "\\theta " , "\\vartheta " , "\\iota " , "\\kappa " , "\\varkappa " , "\\Lambda " , "\\lambda " , "\\mu " , "\\nu " , "\\Xi " , "\\xi " , "\\Pi " , "\\pi " , "\\varpi " , "\\rho " , "\\varrho " , "\\Sigma " , "\\sigma " , "\\varsigma " , "\\tau " , "\\Upsilon " , "\\upsilon " , "\\Phi " , "\\phi " , "\\varphi " , "\\chi " , "\\Psi " , "\\psi " , "\\Omega " , "\\omega "
                "\\posinf ", "\\neginf ", "\\infty ", "\\image "
            ]
        @scope = []
        
    setValue: (value) ->
        @value = value
    
    setFocus: (focus) ->
        @focus = focus

    insertNumber: (number) ->
        @insert(number)
        @focus++

    insertCharacter: (char) ->
        @insert(char)
        @focus++

    insertPlus: ->
        tex = "+"
        @insert(tex)
        @focus++

    insertSubstract: ->
        tex = "-"
        @insert(tex)
        @focus++

    insertMultiply: ->
        tex = "\\times "
        @insert(tex)
        @focus += 7

    insertDiv: ->
        tex = "\\div "
        @insert(tex)
        @focus += 5

    insertSDiv: ->
        tex = "/"
        @insert(tex)
        @focus++
    
    insertPM: ->
        tex = "\\pm "
        @insert(tex)
        @focus += 4

    insertFraction: ->
        tex = "\\frac{}{}"
        @insert(tex)
        @focus = @focus + 6
        @scope.push
            op: "\\frac{"
            index: 0
    
    insertSquareRoot: ->
        tex = "\\sqrt{}"
        @insert(tex)
        @focus = @focus + 6
        @scope.push
            op: "\\sqrt{"
            index: 0

    insertRoot: ->
        tex = "\\sqrt[]{}"
        @insert(tex)
        @focus = @focus + 8
        @scope.push
            op: "\\sqrt["
            index: 1

    insertPower: () ->
        tokenLeft = @isTokenLeft()
        if tokenLeft?
            if tokenLeft.label is "unimportant"
                tex = "\\power{}{}"
                @insert(tex)
                @focus += 7
                @scope.push
                    op: "\\power{"
                    index: 0
            else if tokenLeft.label is "literal"
                tex = "\\power{#{tokenLeft.token}}{}"
                @delByLength(tokenLeft.token.length)
                @insert(tex)
                @focus += (7 + tokenLeft.token.length + 2)
                @scope.push
                    op: "\\power"
                    index: 1
        else
            beforeFocus = if @focus <= 0 then null else @value[@focus - 1]
            if beforeFocus?
                base = @value[@focus - 1]
                if beforeFocus in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
                    current = @focus - 2
                    while true
                        if @value[current] in ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
                            base = @value[current] + base
                        else
                            break
                tex = "\\power{#{base}}{}"
                @delByLength(base.length)
                @insert(tex)
                @focus += (7 + base.length + 2)
                @scope.push
                    op: "\\power"
                    index: 1
            else
                tex = "\\power{}{}"
                @insert(tex)
                @focus += 7
                @scope.push
                    op: "\\power{"
                    index: 0

    insertSubscript: () ->
        tex = "\\subscript{}{}"
        @insert(tex)
        @focus += 11
        @scope.push
            op: "\\subscript{"
            index: 0

    insertPSubscript: () ->
        tex = "\\psubscript{}{}{}"
        @insert(tex)
        @focus += 12
        @scope.push
            op: "\\psubscript{"
            index: 0

    insertParentheses: ->
        tex = "\\parentheses{}"
        @insert(tex)
        @focus = @focus + 13
        @scope.push
            op: "\\parentheses{"
            index: 0

    insertBracket: ->
        tex = "\\bracket{}"
        @insert(tex)
        @focus += 9
        @scope.push
            op: "\\bracket{"
            index: 0

    insertAbsolute: ->
        tex = "\\absolute{}"
        @insert(tex)
        @focus += 10
        @scope.push
            op: "\\absolute{"
            index: 0

    insertBrace: ->
        tex = "\\brace{}"
        @insert(tex)
        @focus += 7
        @scope.push
            op: "\\brace{"
            index: 0
    
    insertSSum: ->
        tex = "\\summary{}{}{}{}"
        @insert(tex)
        @focus += 15
        @scope.push
            op: "\\summary{"
            index: 3

    insertSum: ->
        tex = "\\smallsummary{}{}{}{}"
        @insert(tex)
        @focus += 20
        @scope.push
            op: "\\smallsummary{"
            index: 3

    insertPProd: ->
        tex = "\\product{}{}{}{}"
        @insert(tex)
        @focus += 15
        @scope.push
            op: "\\product{"
            index: 3

    insertProd: ->
        tex = "\\smallproduct{}{}{}{}"
        @insert(tex)
        @focus += 20
        @scope.push
            op: "\\smallproduct{"
            index: 3

    insertIInt: ->
        tex = "\\integral{}{}{}{}"
        @insert(tex)
        @focus += 14
        @scope.push
            op: "\\integral{"
            index: 2

    insertInt: ->
        tex = "\\smallintegral{}{}{}{}"
        @insert(tex)
        @focus += 19
        @scope.push
            op: "\\smallintegral{"
            index: 2

    insertIInfInt: ->
        tex = "\\infint{}{}"
        @insert(tex)
        @focus += 8
        @scope.push
            op: "\\infint{"
            index: 0

    insertInfInt: ->
        tex = "\\smallinfint{}{}"
        @insert(tex)
        @focus += 13
        @scope.push
            op: "\\smallinfint{"
            index: 0

    insertLimit: ->
        tex = "\\limit{}{}{}"
        @insert(tex)
        @focus += 11
        @scope.push
            op: "\\limit{"
            index: 2

    insertLimitN: ->
        tex = "\\limitn{}"
        @insert(tex)
        @focus += 8
        @scope.push
            op: "\\limitn{"
            index: 0

    insertLt: ->
        tex = "<"
        @insert(tex)
        @focus++
    
    insertGt: ->
        tex = ">"
        @insert(tex)
        @focus++

    insertLeq: ->
        tex = "\\leq "
        @insert(tex)
        @focus += 5

    insertGeq: ->
        tex = "\\geq "
        @insert(tex)
        @focus += 5

    insertLL: ->
        tex = "\\ll "
        @insert(tex)
        @focus += 4

    insertGG: ->
        tex = "\\gg "
        @insert(tex)
        @focus += 4

    insertEq: ->
        tex = "="
        @insert(tex)
        @focus++
    
    insertNeq: ->
        tex = "\\neq "
        @insert(tex)
        @focus += 5

    insertFDeri: ->
        tex = "\\fderi{}{}"
        @insert(tex)
        @focus += 7
        @scope.push
            op: "\\fderi{"
            index: 0

    insertFNDeri: ->
        tex = "\\fnderi{}{}{}"
        @insert(tex)
        @focus += 10
        @scope.push
            op: "\\fderi{"
            index: 1

    insertDeri: ->
        tex = "\\deri{}"
        @insert(tex)
        @focus += 6
        @scope.push
            op: "\\deri{"
            index: 0

    insertNDeri: ->
        tex = "\\nderi{}{}"
        @insert(tex)
        @focus += 7
        @scope.push
            op: "\\nderi{"
            index: 0

    insertSin: ->
        tex = "\\sin{}"
        @insert(tex)
        @focus += 5
        @scope.push
            op: "\\sin{"
            index: 0

    insertCos: ->
        tex = "\\cos{}"
        @insert(tex)
        @focus += 5
        @scope.push
            op: "\\cos{"
            index: 0

    insertTan: ->
        tex = "\\tan{}"
        @insert(tex)
        @focus += 5
        @scope.push
            op: "\\tan{"
            index: 0
    
    insertCot: ->
        tex = "\\cot{}"
        @insert(tex)
        @focus += 5
        @scope.push
            op: "\\tan{"
            index: 0

    insertLog: ->
        tex = "\\nlog{}{}"
        @insert(tex)
        @focus += 8
        @scope.push
            op: "\\nlog{"
            index: 1

    insertLogDec: ->
        tex = "\\logdec{}"
        @insert(tex)
        @focus += 8
        @scope.push
            op: "\\logdec{"
            index: 0

    insertLogNepe: ->
        tex = "\\lognepe{}"
        @insert(tex)
        @focus += 9
        @scope.push
            op: "\\lognepe{"
            index: 0

    insertPLog: ->
        tex = "\\pnlog{}{}{}"
        @insert(tex)
        @focus += 11
        @scope.push
            op: "\\pnlog{"
            index: 2

    insertPLogDec: ->
        tex = "\\plogdec{}{}"
        @insert(tex)
        @focus += 11
        @scope.push
            op: "\\plogdec{"
            index: 1

    insertPLogNepe: ->
        tex = "\\plognepe{}{}"
        @insert(tex)
        @focus += 12
        @scope.push
            op: "\\plognepe{"
            index: 1

    insertPBin: ->
        tex = "\\power{2}{}"
        @insert(tex)
        @focus += 10
        @scope.push
            op: "\\power{"
            index: 1

    insertExp: ->
        tex = "\\exp{}"
        @insert(tex)
        @focus += 5
        @scope.push
            op: "\\exp{"
            index: 0

    insertPosInf: ->
        tex = "\\posinf "
        @insert(tex)
        @focus += 8

    insertNegInf: ->
        tex = "\\neginf "
        @insert(tex)
        @focus += 8
    
    insertInfty: ->
        tex = "\\infty "
        @insert(tex)
        @focus += 7

    insertEuler: ->
        tex = "\\euler "
        @insert(tex)
        @focus += 7

    insertEqSys: (num) ->
        tex = "\\left\\{\\begin{array}{l}{}\\\\\\end{array}\\right."   
        @insert(tex)
        @focus += 24
        @scope.push
            op: "\\left\\{\\begin{array}{l}"
            index: 0

    insertEqCase: (num) ->
        tex = "\\left[\\begin{array}{l}" + repeatStringNumTimes("{}\\\\", num) + "\\end{array}\\right."            
        @insert(tex)
        @focus += 23
        @scope.push
            op: "\\left[\\begin{array}{l}"
            index: 0

    insertImage: ->
        tex = "\\image "
        @insert(tex)
        @focus += 7

    insertPoint: ->
        @insert(",")
        @focus++

    insertGreekLetter: (op) ->
        tex = "\\#{op} "
        @insert(tex)
        @focus += tex.length

    isTokenLeft: ->
        [left, right] = @splitByFocus()
        for label, value of @token
            for token in value
                return { label: label, token: token } if token is left.slice(-token.length)
        return null
    
    isTokenRight: ->
        [left, right] = @splitByFocus()
        for label, value of @token
            for token in value
                return { label: label, token: token} if token is right.substr(0, token.length)
        return null

    enter: ->
        index = @scope.findIndex((scope) -> scope.op is "\\left\\{\\begin{array}{l}" or scope.op is "\\left[\\begin{array}{l}")
        if index >= 0
            next = @value.indexOf("}\\\\", @focus) + 3
            @focus = next
            @insert("{}\\\\")
            @focus++

    insert: (tex) ->
        [left, right] = @splitByFocus()
        @value = left + tex + right

    splitByFocus: ->
        return ["", @value] if @focus is 0
        return [@value[0..(@focus - 1)], @value[@focus..(@value.length)]]

    shiftLeftFocus: ->
        return if @focus is 0
        @changed = true
        tokenLeft = @isTokenLeft()
        if tokenLeft? and tokenLeft.label not in ["unimportant", "literal"]
            if tokenLeft.label is "intermediate"
                @scope[@scope.length - 1].index--
            else if tokenLeft.label is "end"
                leftScope = @findLeftScope()
                @scope.push
                    op: leftScope.token
                    index: leftScope.numOfChildren - 1
            else if tokenLeft.label is "start"
                @scope.pop()
            return @focus -= tokenLeft.token.length

        if tokenLeft? and tokenLeft.label in ["unimportant", "literal"]
            return @focus -= tokenLeft.token.length

        return @focus--
    
    shiftRightFocus: ->
        return if @focus is @value.length
        @changed = true
        tokenRight = @isTokenRight()
        if tokenRight? and tokenRight.label not in ["unimportant", "literal"]
            if tokenRight.label is "intermediate"
                @scope[@scope.length - 1].index++
            else if tokenRight.label is "start"
                @scope.push
                    op: tokenRight.token
                    index: 0
            else if tokenRight.label is "end"
                @scope.pop()
            return @focus += tokenRight.token.length

        if tokenRight? and tokenRight.label in ["unimportant", "literal"]
            return @focus += tokenRight.token.length

        return @focus++

    findLeftScope: ->
        tokenLeft = @isTokenLeft()
        if tokenLeft? and tokenLeft.label is "end"
            if tokenLeft.token is "}"
                replication = new TexMathDisplay(@value[0..@focus], @focus)
                numberOfScope = 0
                tokenLeft = null
                while replication.focus > 0
                    tokenLeft = replication.isTokenLeft()
                    if tokenLeft?
                        if tokenLeft.label is "end"
                            numberOfScope++
                        else if tokenLeft.label is "start"
                            if numberOfScope > 0
                                numberOfScope--
                        replication.focus -= tokenLeft.token.length
                        if numberOfScope <= 0
                            break
                    else
                        replication.focus--
                return { startPos: replication.focus, endPos: @focus, token: tokenLeft.token, numOfChildren: @maxChildren[@token.start.findIndex((x) -> x is tokenLeft.token)] }
            ###
            else
                lastIndexOfEquationSystem = @value[0..@focus].lastIndexOf("\\left\\{\\begin{array}{l}{")
                lastIndexOfEquationCases = @value[0..@focus].lastIndexOf("\\left[\\begin{array}{l}{")
                if lastIndexOfEquationSystem < 0 and lastIndexOfEquationCases < 0
                    return null
                else if lastIndexOfEquationSystem < 0 and lastIndexOfEquationCases >= 0
                    return { index: lastIndexOfEquationCases, token: "\\left[\\begin{array}{l}{", numOfChildren: undefined}
                else if lastIndexOfEquationSystem >= 0 and lastIndexOfEquationCases < 0
                    return { index: lastIndexOfEquationSystem, token: "\\left\\{\\begin{array}{l}{", numOfChildren: undefined}
                else
                    if lastIndexOfEquationSystem > lastIndexOfEquationCases
                        return { index: lastIndexOfEquationSystem, token: "\\left\\{\\begin{array}{l}{", numOfChildren: undefined}
                    else
                        return { index: lastIndexOfEquationCases, token: "\\left[\\begin{array}{l}{", numOfChildren: undefined}
            ###
        return null

    displayCursor: ->
        return "\\cursor " + @value if @focus is 0
        return [@value[0..(@focus - 1)], @value[@focus..(@value.length)]].join("\\cursor ")
        
    display: ->
        return "\\cursor " + @value if @focus is 0
        result = [@value[0..(@focus - 1)], @value[@focus..(@value.length)]].join("\\cursor ")
        return result.replace(new RegExp("{}", "g"), "{\\Box}").replace("[]", "[\\Box]")

    getPostionOfCurrentScope: ->
        currentScope = @scope[@scope.length - 1]
        if currentScope?
            replication = new TexMathDisplay(@value[0..@focus], @focus)
            startPos = replication.value.lastIndexOf(currentScope.op)
            replication.value = @value
            replication.focus = startPos
            
            replication.shiftRightFocus()
            numOfStart = 1
            while numOfStart > 0
                tokenRight = replication.isTokenRight()
                if tokenRight.label is "start"
                    numOfStart++
                else if tokenRight.label is "end"
                    numOfStart--
                replication.shiftRightFocus()
            endPos = replication.focus
            return [startPos, endPos]
        else return null

    checkBeforeInsert: ->
        return null if @scope.length <= 0
        directScope = @scope[@scope.length - 1]

        for label, scopeList of @specScope
            index = scopeList.findIndex((scope) -> scope.op is directScope.op and scope.index is directScope.index)
            if index >= 0 and label is "right"
                replication = new TexMathDisplay(@value, @focus)
                numberOfScope = 1
                tokenRight = null
                while replication.focus < @value.length
                    tokenRight = replication.isTokenRight()
                    if tokenRight?
                        if tokenRight.label is "end"
                            numberOfScope--
                        else if tokenRight.label is "start"
                            if numberOfScope > 0
                                numberOfScope++
                        replication.focus += tokenRight.token.length
                        if numberOfScope <= 0
                            break
                    else
                        replication.focus++

                afterFocus = @value[@focus..(replication.focus - 2)]
                @focus = replication.focus - 1
                @delByLength(afterFocus.length)
                @shiftRightFocus()
                return afterFocus
        return null

    checkCurrentScopeBeDeleted: ->
        currentScope = @scope[@scope.length - 1]
        if currentScope?
            if currentScope.index is 0
                return true
            else return false
        else
            return false

    del: () ->
        return if @focus is 0
        tokenLeft = @isTokenLeft()
        if tokenLeft?
            if tokenLeft.label in ["unimportant", "literal"]
                @delByLength(tokenLeft.token.length)
            else if tokenLeft.label is "end"
                @shiftLeftFocus()
            else if tokenLeft.label in ["start", "intermediate"]
                canDelete = @checkCurrentScopeBeDeleted()
                if canDelete
                    [startPos, endPos] = @getPostionOfCurrentScope()
                    @focus = endPos
                    @delByLength(endPos - startPos)
                    @scope.pop()
                else
                    @shiftLeftFocus()
        else
            @delByLength(1)

    delByLength: (length) ->
        if length > 0
            @value = @value.substring(0, @focus - length) + @value.substring(@focus)
            @focus = if (@focus - length >= 0) then @focus - length else 0 

    findOutVariables: () ->
        parser = new nearley.Parser(Grammar.ParserRules, Grammar.ParserStart, { keepHistory: false});
        parser.feed(@value)
        variables = []
        queue = [parser.results[0]]
        while queue.length
            node = queue.shift()
            if node.operation is "Variable"
                index = variables.findIndex((variable) -> node.value is variable.value)
                if index < 0
                    variables.push
                        value: node.value
                        tex: if node.tex? then node.tex else node.value
            if node.children?
                for child in node.children
                    queue.push(child)
                    
        return variables.sort((a, b) -> b.tex < a.tex)
        
repeatStringNumTimes = (string, times) ->
    repeatedString = ""
    while times > 0
        repeatedString += string
        times--
    return repeatedString
