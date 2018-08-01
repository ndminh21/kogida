opener = window.opener

$("#save-close").click ->
    variables = Event.MathOutputTex.findOutVariables().filter((x) -> x.value isnt "image")
    
    if variables.length > 1
        bootbox.prompt
            title: "Các biến sử dụng"
            value: variables.map((x) -> x.value)
            inputType: "checkbox"
            inputOptions: variables.map((x) -> { text: "\\(#{x.tex}\\)", value: x.value })
            closeButton: false
            callback: (chosenVariables) ->
                opener.getMathDisplayTex(Event.MathOutputTex.value, getAngleMode(), JSON.stringify(chosenVariables))
                window.close()
            buttons: 
                confirm:
                    label: "Sử dụng"
                cancel:
                    label: "Không sử dụng"
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    else if variables.length is 1
        opener.getMathDisplayTex(Event.MathOutputTex.value, getAngleMode(), JSON.stringify(variables.map((x) -> x.value)))
        window.close()
    else
        opener.getMathDisplayTex(Event.MathOutputTex.value, getAngleMode())
        window.close()

$("#write-close").click ->
    url = window.location.href
    indexOfCK = url.indexOf("ck")
    if url.indexOf("ck") >= 0
        valueOfCK = url.substring(indexOfCK + 3)
        opener.insertMathFormula(valueOfCK, Event.MathOutputTex.value)
        return window.close()
        
    opener.setMathFormula(Event.MathOutputTex.value, getAngleMode());
    window.close()
