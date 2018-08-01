Queue = MathJax.Hub.queue
mathInput = null

opener = "explore"

$(document).ready ->
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]

    location = window.location.href
    functionTex = $("#draw").data("tex")
    if window.location.href.indexOf("giai-tim-gtln-gtnn-tren-khoang") >=0
        $.get("/api/ve-bang-bien-thien", { functionTex: functionTex },
            (message) ->
                if message.status is 200
                    $("#considering_change").removeAttr("width")
                    $("#considering_change").attr("src", "data:image/png;base64," + message.base64)
        );

$("#MathInput").click ->
    opener = "explore"
    editor = window.open("/may-tinh-kogida?editor=true&solver=true&init=#{encodeURIComponent $("#draw").data("tex")}", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".math-input").click ->
    opener = $(this).data("name")
    editor = window.open("/may-tinh-kogida?editor=true&solver=true&init=#{encodeURIComponent $(this).data("tex")}", "popupWindow", "width=600, height=400, scrollbars=yes")

$("#draw").click ->
    functionTex = $(this).data("tex")
    if window.location.href.indexOf("tim-gtln-gtnn-tren-doan") >= 0
        window.location.href = "/giai-tim-gtln-gtnn-tren-doan?tex=#{encodeURIComponent $(this).data("tex")}&xmin=#{encodeURIComponent $(".math-input[data-name=xmin]").data("tex")}&xmax=#{encodeURIComponent $(".math-input[data-name=xmax]").data("tex")}"
    else if window.location.href.indexOf("tim-gtln-gtnn-tren-khoang") >= 0
        xmin = $(".math-input[data-name=xmin]").data("tex")
        xmax = $(".math-input[data-name=xmax]").data("tex")
        option = $("input[name=half]:checked").val()
        window.location.href = "/giai-tim-gtln-gtnn-tren-khoang?tex=#{encodeURIComponent functionTex}&xmin=#{encodeURIComponent xmin}&xmax=#{encodeURIComponent xmax}&option=#{option}"

window.getMathDisplayTex = (tex, angleMode, variables = []) ->
    if opener is "explore"
        $("#draw").data("tex", tex)
        Queue.Push(["Text", mathInput, "y = f(x) = " + tex])
    else
        title = switch opener
            when "xmin" then "x_{min}"
            when "ymin" then "y_{min}"    
            when "xmax" then "x_{max}"
            when "ymax" then "y_{max}"
                
        $(".math-input[data-name=#{opener}]").text("\\( \\displaystyle #{title} = #{tex} \\)")
        $(".math-input[data-name=#{opener}]").data("tex", "#{tex}")
        
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);