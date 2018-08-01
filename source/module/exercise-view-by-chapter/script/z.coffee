Queue = MathJax.Hub.queue
mathInput = null

$(document).ready ->
    Queue.Push ->
        mathInput = MathJax.Hub.getAllJax("MathInput")[0]

$("form").submit (event) ->
    event.preventDefault();
    chapter = JSON.parse($("input[name=chapter]").val())

    content = $("input[name=content]").val()
    if content is ""
        window.location.href="/xem-bai-tap-theo-chuong/#{chapter.ChapterId}/#{KhongDau(chapter.ChapterName.toLowerCase(), ["chuyen", "url"])}/trang-1"
    else
        window.location.href="/tim-kiem-de-bai-theo-chuong/#{chapter.ChapterId}/#{KhongDau(chapter.ChapterName.toLowerCase(), ["chuyen", "url"])}/#{encodeURIComponent(content)}/trang-1"
    return false

$("#InputBox").click ->
    editor = window.open("/may-tinh-kogida?editor=true&solver=true", "popupWindow", "width=600, height=400, scrollbars=yes")

window.getMathDisplayTex = (tex, angleMode, variables = []) ->
    $("#solve-button").attr("href", if tex.length > 0 then "/bai-giai-pt-hpt?tex=#{encodeURIComponent(tex)}&variables=#{encodeURIComponent(variables)}&anglemode=#{encodeURIComponent(angleMode)}" else "#")
    Queue.Push(["Text", mathInput, tex])