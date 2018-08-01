Queue = MathJax.Hub.queue
mathInput = null
changed = null

$(document).ready ->
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]

        url = window.location.href
        indexOfVariables = url.indexOf("variables")
        if url.indexOf("variables") >= 0
            variables = JSON.parse(decodeURIComponent(url.substring(indexOfVariables + 10)))

        result = JSON.parse($("#result").val())
        
        if result?
            changed = false

        if result? and result.classification is "polyineq"
            $.get("/api/ve-bang-xet-dau", {
                values: result.considering_sign.val,
                signs: result.considering_sign.sign,
                variable: variables[0]
            }, (message) ->
                if message.status is 200
                    $("#considering_sign").removeAttr("width")
                    $("#considering_sign").attr("src", "data:image/png;base64," + message.base64)
            )

$("#MathInput").click ->
    editor = window.open("/may-tinh-kogida?editor=true&solver=true&init=#{encodeURIComponent $("#solver").data("tex")}", "popupWindow", "width=600, height=400, scrollbars=yes")

$("#solver").click ->
    if changed? and !changed
        window.location.reload(true)
    else
        window.location.href = "/cach-giai-pt-hpt?tex=#{encodeURIComponent($(this).data("tex"))}&anglemode=#{encodeURIComponent($(this).data("anglemode"))}&variables=#{encodeURIComponent(JSON.stringify JSON.parse $(this).data("variables"))}"

window.getMathDisplayTex = (tex, angleMode, variables) ->
    changed = true
    $("#solver").data("tex", tex)
    $("#solver").data("anglemode", angleMode)
    $("#solver").data("variables", variables)
    Queue.Push(["Text", mathInput, tex])
