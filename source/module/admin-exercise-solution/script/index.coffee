Queue = MathJax.Hub.queue

formula = []

contentEditor = null

exerciseInfo = null

input_opener = null

$("#exercise-input-wizard").steps
    headerTag: "h3"
    bodyTag: "section"
    stepsOrientation: "vertical"
    labels:
        finish: "Kết thúc"
        next: "Tiếp theo"
        previous: "Trước"
    onStepChanging: (event, currentIndex, newIndex) ->
        if currentIndex is 1 and !exerciseInfo.NoParameter
            formula = []
            formulaRows = $(".formula-contaniner").find(".input-formula-row");
            constant = []
            parameter = []
            for formulaRow, index in formulaRows
                tex = formulaRows.eq(index).find(".input-formula-bare-tex").eq(0).text()
                anglemode = formulaRows.eq(index).find(".input-formula-anglemode").eq(0).text()
                if tex is ""
                    bootbox.alert("Công thức không được phép rỗng!")
                    return false
                else
                    formula.push({ tex: tex, anglemode: anglemode })
        return true
    onStepChanged: () ->
        adjustSizeAll()
    onFinished: (event, currentIndex) ->
        content = contentEditor.getData()
        if window.location.href.indexOf("sua-bai-giai") < 0
            if exerciseInfo.NoParameter
                window.location.href="/luu-bai-giai?mabaitap=#{exerciseInfo.ExerciseId}&noidung=#{encodeURIComponent content}"
            else
                window.location.href="/luu-bai-giai?mabaitap=#{exerciseInfo.ExerciseId}&noidung=#{encodeURIComponent content}&congthuc=#{encodeURIComponent JSON.stringify formula}"
        else
            solution = JSON.parse $("#solution").val()
            if exerciseInfo.NoParameter
                window.location.href="/luu-sua-bai-giai?mabaitap=#{exerciseInfo.ExerciseId}&mabaigiai=#{solution.SolutionId}&noidung=#{encodeURIComponent content}"
            else
                window.location.href="/luu-sua-bai-giai?mabaitap=#{exerciseInfo.ExerciseId}&mabaigiai=#{solution.SolutionId}&noidung=#{encodeURIComponent content}&congthuc=#{encodeURIComponent JSON.stringify formula}"
         
$(".add-param").click ->
    bootbox.prompt
        title: "Chọn 1 tham số đầu vào để hiển thị"
        inputType: "checkbox"
        inputOptions: parameter.map((x) -> { text: "\\(#{x.tex}\\)", value: "#{x.tex}" } )
        closeButton: false
        callback: (result) ->
            if (result.length > 0)
                parameterToInsert = result[0]
                exerciseEditor.insertText("\\(#{result[0]}\\)")
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

$(document).ready ->
    CKEDITOR.replace("input-content", { allowedContent: true, entities: false, extraAllowedContent: 'span', fillEmptyBlocks: false, tabSpaces: 0, basicEntities: false })
    contentEditor = CKEDITOR.instances["input-content"]
    exerciseInfo = JSON.parse $("#exerciseInfo").val()

$(".add-new-formula").click ->
    $(".formula-contaniner").append('<div class="row input-formula-row">
                                        <div class="col-md-12 input-formula-box">
                                            <div class="input-formula">
                                                <div class="input-formula-tex">\\(\\)</div>
                                                <div class="input-formula-bare-tex hidden"></div>
                                                <div class="input-formula-anglemode hidden"></div>
                                            </div>
                                        </div>
                                    </div>')
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $(".input-formula").click ->
        input_opener = $(this)
        editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".input-formula").click ->
    input_opener = $(this)
    editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".open-editor").click ->
    editor = window.open("/may-tinh-kogida?editor=true&solver=false&ck=input-content", "popupWindow", "width=600, height=400, scrollbars=yes")
    
$(".open-param").click ->
    swal({
        title: "Nhập công thức vào bài giải"
        html: formula.map((value, index) -> "<div class='row input-formula-select'><div class='col-md-2'>Công thức #{index + 1}</div><div class='col-md-6 text-left'>\\(#{value.tex}\\)</div><div class='col-md-2'><input type='checkbox' data-formula='#{index}' /><label style='margin-left:5px;'>Chọn</label></div><div class='col-md-2'><select data-formula='#{index}'><option value='1' selected>Dạng 1</option><option value='2'>Dạng 2</option><option value='3'>Dạng 3</option><option value='4'>Dạng 4</option></select></div></div>").reduce((prev, curr) -> prev + curr)
        width: "800px"
        focusConfirm: true
        preConfirm: () ->
            formulaRows = $(".input-formula-select")
            for formulaRow, index in formulaRows
                selected = formulaRows.eq(index).find("input[type=checkbox]").is(':checked')
                if selected
                    format = formulaRows.eq(index).find("select").val()
                    contentEditor.insertHtml("<span formula='#{index}' format='#{format}' style='font-weight: bolder'>Công thức #{index + 1}</span><p><p>")
                
    })
    MathJax.Hub.Queue(["Typeset", MathJax.Hub])

adjustSizeAll = () ->
    texBoxList = $(".input-formula-tex")
    for index in [0...texBoxList.length] by 1
        texBox = texBoxList.eq(index)
        height = texBox.height()
        texBox.parent().css("cssText", "height: " + (height + 20) + "px !important;")
        
adjustSize = () ->
    texBox = input_opener.find("div").eq(0)
    height = texBox.height()
    input_opener.css("cssText", "height: " + (height + 20) + "px !important;")

window.setMathFormula = (tex, anglemode) ->
    input_opener.find("div").eq(0).text("\\(\\displaystyle #{tex}\\)")
    input_opener.find("div").eq(1).text(tex)
    input_opener.find("div").eq(2).text(anglemode)
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    adjustSize()

window.insertMathFormula = (ckEditorName, tex) ->
    CKEDITOR.instances[ckEditorName].insertText("\\(\\displaystyle #{tex}\\)")
