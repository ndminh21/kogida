Queue = MathJax.Hub.queue
mathInput = null

exercise = null

value = null

input_opener = null

$(document).ready ->
    if $("#parameterValues").length > 0
        value = JSON.parse($("#parameterValues").val())
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]
    exercise = JSON.parse $("#exercise_info").val()
    if !exercise.NoParameter and $("#parameterValues").length is 0
        value = new Array(JSON.parse(exercise.Parameter).length)

$(".parameter-value").click ->
    input_opener = $(this)
    editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")

$("#solve").click ->
    window.location.href = "/giai-bai-tap-theo-tham-so?mabaitap=#{exercise.ExerciseId}&thamso=#{encodeURIComponent JSON.stringify value}"

window.setMathFormula = (tex, anglemode) ->
    input_opener.find("div").eq(0).text("\\[ #{tex} \\]")
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    adjustSize()
    value[input_opener.data("index")] = tex

adjustSize = () ->
    texBox = input_opener.find("span.MathJax").eq(0)
    width = texBox.width()
    input_opener.css("cssText", "width: " + (width + 20) + "px !important;")