Queue = MathJax.Hub.queue
mathInput = null

opener = "explore"

$(document).ready ->
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]

    location = window.location.href
    functionTex = $("#draw").data("tex")

    if location.indexOf("hinh-ve-do-thi") >= 0
        $.post("/api/ve-do-thi-bat-ky", 
            { 
                functionTex: functionTex, 
                xmin: $(".math-input[data-name=xmin]").data("tex"),
                xmax: $(".math-input[data-name=xmax]").data("tex"),
                ymin: $(".math-input[data-name=ymin]").data("tex"),
                ymax: $(".math-input[data-name=ymax]").data("tex") 
            },
                (message) ->
                    if message.status is 200
                        $("#diagram").removeAttr("width")
                        $("#diagram").attr("src", "data:image/png;base64," + message.base64)
            )
    


$("#MathInput").click ->
    opener = "explore"
    editor = window.open("/may-tinh-kogida?editor=true&solver=true&init=#{encodeURIComponent $("#draw").data("tex")}", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".math-input").click ->
    opener = $(this).data("name")
    editor = window.open("/may-tinh-kogida?editor=true&solver=true&init=#{encodeURIComponent $(this).data("tex")}", "popupWindow", "width=600, height=400, scrollbars=yes")

$("#draw").click ->
    window.location.href = "/hinh-ve-do-thi-bat-ki?tex=#{encodeURIComponent $(this).data("tex")}&xmin=#{encodeURIComponent $(".math-input[data-name=xmin]").data("tex")}&xmax=#{encodeURIComponent $(".math-input[data-name=xmax]").data("tex")}&ymin=#{encodeURIComponent $(".math-input[data-name=ymin]").data("tex")}&ymax=#{encodeURIComponent $(".math-input[data-name=ymax]").data("tex")}"

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

