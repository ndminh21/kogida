Queue = MathJax.Hub.queue
mathInput = null

$(document).ready ->
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]

$("#InputBox").click ->
    editor = window.open("/may-tinh-kogida?editor=true&solver=true", "popupWindow", "width=600, height=400, scrollbars=yes")

window.getMathDisplayTex = (tex, angleMode, variables = []) ->
    $("#solve-button").attr("href", if tex.length > 0 then "/bai-giai-pt-hpt?tex=#{encodeURIComponent(tex)}&variables=#{encodeURIComponent(variables)}&anglemode=#{encodeURIComponent(angleMode)}" else "#")
    Queue.Push(["Text", mathInput, tex])