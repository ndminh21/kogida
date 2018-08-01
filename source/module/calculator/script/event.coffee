class Event
    @MathOutputTex: new TexMathDisplay()

    constructor: (@charCode, @keyCode, @shiftKey, @altKey, @ctrlKey) ->

    set: (@charCode, @keyCode, @shiftKey, @altKey, @ctrlKey) ->
    
    setCharCode: (charCode) ->
        @charCode = charCode
    
    setKeyCode: (keyCode) ->
        @keyCode = keyCode

    setShiftKey: (shiftKey) ->
        @shiftKey = shiftKey
    
    setAltKey: (altKey) ->
        @altKey = altKey
    
    setCtrlKey: (ctrlKey) ->
        @ctrlKey = ctrlKey

    keyPress: () ->
        if @charCode in [48..57] or @charCode in [65..90] or @charCode in [97..122]
            Event.MathOutputTex.insertNumber(String.fromCharCode(@charCode)) if @charCode in [48..57]
            Event.MathOutputTex.insertCharacter(String.fromCharCode(@charCode)) if @charCode in [65..90] or @charCode in [97..122]
        else if @charCode in [42, 45, 47, 61]
            afterFocus = Event.MathOutputTex.checkBeforeInsert()
            
            Event.MathOutputTex.insertSubstract() if @charCode is 45
            Event.MathOutputTex.insertMultiply() if @charCode is 42
            Event.MathOutputTex.insertSDiv() if @charCode is 47
            Event.MathOutputTex.insertCharacter("=") if @charCode is 61

            if afterFocus?
                Event.MathOutputTex.insert(afterFocus)

        else if @charCode in [44]
            Event.MathOutputTex.insertPoint() if @charCode is 44
        else if @charCode in [43]
            afterFocus = Event.MathOutputTex.checkBeforeInsert()
            Event.MathOutputTex.insertPlus() if @charCode is 43
            if afterFocus?
                Event.MathOutputTex.insert(afterFocus)

        return Event.MathOutputTex.display()

    keydown: () ->
        switch @keyCode
            when 8
                Event.MathOutputTex.del()
            when 13
                Event.MathOutputTex.enter()
            when 37
                Event.MathOutputTex.shiftLeftFocus()
            when 39
                Event.MathOutputTex.shiftRightFocus()
            when 54
                if @shiftKey
                    Event.MathOutputTex.insertPower()
            when 57
                if @shiftKey
                    Event.MathOutputTex.insertParentheses()
            
        return Event.MathOutputTex.display()

    keyup: () ->
        alert("Duy: Key up")

    clickSymbolButton: (op) ->
        switch op
            when "plus"
                Event.MathOutputTex.insertPlus()
            when "substract"
                Event.MathOutputTex.insertSubstract()
            when "multiply"
                Event.MathOutputTex.insertMultiply()
            when "div"
                Event.MathOutputTex.insertDiv()
            when "sdiv"
                Event.MathOutputTex.insertSDiv()
            when "fraction"
                Event.MathOutputTex.insertFraction()
            when "power"
                Event.MathOutputTex.insertPower()
            when "squareroot"
                Event.MathOutputTex.insertSquareRoot()
            when "root"
                Event.MathOutputTex.insertRoot()
            when "parentheses"
                Event.MathOutputTex.insertParentheses()
            when "bracket"
                Event.MathOutputTex.insertBracket()
            when "absolute"
                Event.MathOutputTex.insertAbsolute()
            when "brace"
                Event.MathOutputTex.insertBrace()
            when "pm"
                Event.MathOutputTex.insertPM()
            when "ssum"
                Event.MathOutputTex.insertSSum()
            when "sum"
                Event.MathOutputTex.insertSum()
            when "pprod"
                Event.MathOutputTex.insertPProd()
            when "prod"
                Event.MathOutputTex.insertProd()
            when "iint"
                Event.MathOutputTex.insertIInt()
            when "int"
                Event.MathOutputTex.insertInt()
            when "iinfint"
                Event.MathOutputTex.insertIInfInt()
            when "infint"
                Event.MathOutputTex.insertInfInt()
            when "limit"
                Event.MathOutputTex.insertLimit()
            when "limitn"
                Event.MathOutputTex.insertLimitN()
            when "lt"
                Event.MathOutputTex.insertLt()
            when "gt"
                Event.MathOutputTex.insertGt()
            when "leq"
                Event.MathOutputTex.insertLeq()
            when "geq"
                Event.MathOutputTex.insertGeq()
            when "ll"
                Event.MathOutputTex.insertLL()
            when "gg"
                Event.MathOutputTex.insertGG()
            when "eq"
                Event.MathOutputTex.insertEq()
            when "neq"
                Event.MathOutputTex.insertNeq()
            when "fderi"
                Event.MathOutputTex.insertFDeri()
            when "fnderi"
                Event.MathOutputTex.insertFNDeri()
            when "deri"
                Event.MathOutputTex.insertDeri()
            when "nderi"
                Event.MathOutputTex.insertNDeri()
            when "sin"
                Event.MathOutputTex.insertSin()
            when "cos"
                Event.MathOutputTex.insertCos()
            when "tan"
                Event.MathOutputTex.insertTan()
            when "cot"
                Event.MathOutputTex.insertCot()
            when "log"
                Event.MathOutputTex.insertLog()
            when "logdec"
                Event.MathOutputTex.insertLogDec()
            when "ln"
                Event.MathOutputTex.insertLogNepe()
            when "plog"
                Event.MathOutputTex.insertPLog()
            when "plogdec"
                Event.MathOutputTex.insertPLogDec()
            when "pln"
                Event.MathOutputTex.insertPLogNepe()
            when "pbin"
                Event.MathOutputTex.insertPBin()
            when "exp"
                Event.MathOutputTex.insertExp()
            when "posinf"
                Event.MathOutputTex.insertPosInf()
            when "neginf"
                Event.MathOutputTex.insertNegInf()
            when "inf"
                Event.MathOutputTex.insertInfty()
            when "subscript"
                Event.MathOutputTex.insertSubscript()
            when "psubscript"
                Event.MathOutputTex.insertPSubscript()
            when "eqsys"
                Event.MathOutputTex.insertEqSys()
            when "image"
                Event.MathOutputTex.insertImage()
            when "angle"
                Event.MathOutputTex.insertAngle()
            when "euler"
                Event.MathOutputTex.insertEuler()
        return Event.MathOutputTex.display()

    clickGreekButton: (op) ->
        Event.MathOutputTex.insertGreekLetter(op)
        return Event.MathOutputTex.display()    