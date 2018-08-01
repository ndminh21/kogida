Queue = MathJax.Hub.queue
mathOutput = null
mathResult = null

angle_toggle_elem = document.querySelector(".angle-mode-toggle")
angle_mode_toggle = new Switchery angle_toggle_elem, 
    size: "small"

real_toggle_elem = document.querySelector(".real-mode-toggle")
real_mode_toggle = new Switchery real_toggle_elem, 
    size: "small"

processingEvent = new Event()

initTex = null

result = null

$(document).ready ->
    Queue.Push ->
        mathOutput = MathJax.Hub.getAllJax("MathOutput")[0]
        mathResult = MathJax.Hub.getAllJax("MathResult")[0]
        
        location = window.location.href
        url = window.location.href
        indexOfInit = url.indexOf("init")
        if url.indexOf("init") >= 0
            valueOfInit = decodeURIComponent(url.substring(indexOfInit + 5))
            view(valueOfInit + "\\cursor ")
            Event.MathOutputTex.value = (valueOfInit)
            Event.MathOutputTex.focus = (valueOfInit).length
        $(".menu-symbol").css("visibility", "visible")
        $(".button-symbol").css("visibility", "visible")
        $("#MathOutputBox").css("visibility", "visible")
        $(document).keypress(keypress)
        $(document).keydown(keydown)
        #$(document).keyup(keyup)
        $("#calculate").click(calculate)
        $("#ac").click clickAC
        $("#sd").click sd
        adjustSize()

keypress = (event) ->
    focusedElement = $(":focus")
    return if focusedElement.length > 0 and focusedElement.attr("id") isnt "virtual-input"
    
    charCode = event.which || event.keyCode
    texResult = null
    numberMode = getNumberMode()

    if charCode is 105 and numberMode is "complex"
        texResult = processingEvent.clickSymbolButton("image")
    else
        processingEvent.set(charCode, null, event.shiftKey, event.altKey, event.ctrlKey)
        texResult = processingEvent.keyPress()
    view(texResult)

keydown = (event) ->
    keyCode = event.which || event.keyCode
    processingEvent.set(null, keyCode, event.shiftKey, event.altKey, event.ctrlKey)
    texResult = processingEvent.keydown()
    view(texResult)

keyup = (event) ->
    processingEvent.keyup()

$(".button-symbol").click ->
    texResult = null
    if $(this).hasClass("button-for-image")
        numberMode = getNumberMode()
        if numberMode is "complex"
            texResult = processingEvent.clickSymbolButton($(this).data("op"))
    else
        if !$(this).hasClass("button-greek")
            texResult = processingEvent.clickSymbolButton($(this).data("op"))
        else
            texResult = processingEvent.clickGreekButton($(this).data("op"))
    
    view(texResult)

calculate = ->
    variables = Event.MathOutputTex.findOutVariables().filter((x) -> x.value isnt "\\image ")
    if variables.length > 0
        bootbox.prompt
            title: "Các biến sử dụng"
            value: variables.map((x) -> x.value)
            inputType: "checkbox"
            inputOptions: variables.map((x) -> { text: "\\(#{x.tex}\\)", value: x.value })
            closeButton: false
            callback: (chosenVariables) ->
                $("#MathResultBox").css("visibility", "visible")
                $.post "/tinh-toan", { variables: chosenVariables, angleMode: getAngleMode(), latexString: Event.MathOutputTex.value, numberMode: getNumberMode() }, (response) ->
                    result = response
                    if response.beauty? and (response.beauty instanceof String or typeof(response.beauty) is 'string')
                        Queue.Push(["Text", mathResult, response.beauty])
                    resultTex = ""
                    if response.root?
                        if chosenVariables.length is 1
                            resultTex = if response.root.length is 0 then "$$\\text{Bài toán vô nghiệm}$$" else response.root.accurate.map((x) => "$$#{chosenVariables[0]}=#{x}$$").join("\n")
                        else if chosenVariables.length > 1
                            resultTex = if response.root.length is 0 then "$$\\text{Bài toán vô nghiệm}$$" else response.root.accurate.map((rootArr) => "$$\\left(#{chosenVariables.join(";")}\\right) = \\left(#{rootArr.join(";")}\\right)$$").join("\n")
                        $("#MathResult").html(resultTex)
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    if response.rootset?
                        if chosenVariables.length is 1
                            resultTex = "$$S_{#{chosenVariables[0]}}=#{displaySet(response.rootset)}$$"
                        $("#MathResult").html(resultTex)
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    $("#loading-for-result").css("visibility", "hidden")
                    adjustSize()
            buttons: 
                confirm:
                    label: "Sử dụng"
                cancel:
                    label: "Không sử dụng"
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    else 
        $("#MathResultBox").css("visibility", "visible")
        $("#loading-for-result").css("visibility", "visible")
        $.post "/tinh-toan", { angleMode : getAngleMode(), latexString: Event.MathOutputTex.value }, (response) ->
            result = response
            Queue.Push(["Text", mathResult, response.beauty])
            $("#loading-for-result").css("visibility", "hidden")
            adjustSize()


sd = ->
    Queue.Push(["Text", mathResult, result.normal])
    adjustSize()

view = (texResult) ->
    if texResult?
        Queue.Push(["Text", mathOutput, "\\displaystyle " + texResult])
        adjustSize()

clickAC = () ->
    url = window.location.href
    indexOfInit = url.indexOf("&init")
    if indexOfInit >= 0
        window.location.href = url[0..(indexOfInit - 1)]
    else 
        window.location.reload(true)

getAngleMode = () ->
    return if angle_toggle_elem.checked then "rad" else "deg"

getNumberMode = () ->
    return if real_toggle_elem.checked then "real" else "complex"

adjustSize = () ->
    MathOutputHeight = $("#MathOutput").height()
    $("#MathOutputBox").css("height", (MathOutputHeight + 100) + "px")
    $("#virtual-input").css("height", (MathOutputHeight + 100) + "px")

    MathResultHeight = $("#MathOutput").height()
    $("#MathOutputBox").css("height", (MathResultHeight + 100) + "px")
    $("#loading-for-result").css("height", (MathResultHeight + 100) + "px")
    $("#loading-for-result").css("padding-top", ((MathResultHeight + 100 - 80)/2) + "px")