
parameter = []
constant = []
gradeSubjectId = null
chapterId = null

exerciseEditor = null

$("#exercise-input-wizard").steps
    headerTag: "h3"
    bodyTag: "section"
    stepsOrientation: "vertical"
    labels:
        finish: "Kết thúc"
        next: "Tiếp theo"
        previous: "Trước"
    onStepChanging: (event, currentIndex, newIndex) ->
        if currentIndex is 0
            gradeSubjectId = Number($("#input-gradeSubjectId option:selected").val())
            chapterId = Number($("#input-chapterId option:selected").val())
            if (gradeSubjectId is -1 or chapterId is -1)
                bootbox.alert("Chưa chọn thông tin về môn/ khối hoặc chương!")
                return false
        else if currentIndex is 1
            formulaRows = $(" .formula-contaniner").find(".input-formula-row");
            constant = []
            parameter = []
            for formulaRow, index in formulaRows
                tex = formulaRows.eq(index).find(".input-formula-bare-tex").eq(0).text()
                anglemode = formulaRows.eq(index).find(".input-formula-anglemode").eq(0).text()
                param = formulaRows.eq(index).find(".input-param").eq(0).prop("checked")

                if param
                    if tex is ""
                        bootbox.alert("Tham số đầu vào không được phép rỗng!")
                        return false
                    else
                        parameter.push({ tex: tex, anglemode: anglemode })
                else
                    if tex isnt ""
                        constant.push({ tex: tex, anglemode: anglemode})            
        return true
    onFinished: (event, currentIndex) ->
        content = exerciseEditor.getData()
        if window.location.href.indexOf("sua-de-bai") >= 0
            $.post("/luu-sua-de", {
                exerciseId: $("#exerciseId").val(),
                chapterId: chapterId,
                content: content,
                constant: JSON.stringify(constant),
                parameter: JSON.stringify(parameter),
                level: $("#input-level option:selected").val()
            }, (result) ->
                window.location.href = "/thong-tin-bai-tap"
            );
        else
            $.post("/luu-bai-moi", {
                chapterId: chapterId,
                content: content,
                constant: JSON.stringify(constant),
                parameter: JSON.stringify(parameter),
                level: $("#input-level option:selected").val()
            }, (result) ->
                window.location.href = "/them-bai-tap-moi"
            );

        
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

$("select").select2
    language: "vi"

$("#input-gradeSubjectId").on "change", (event) ->
    newGradeSubjectId = Number($(this).find("option:selected").val())
    defaultOption = new Option("Chọn chương học tương ứng của bài tập", "1", true, true)
    if newGradeSubjectId is -1
        $("#input-chapterId").empty().trigger("change")
        $("#input-chapterId").append(defaultOption).trigger("change")
    else
        $.post("/lay-chuong-theo-mon-khoi", { gradeSubjectId: newGradeSubjectId }, (chapterList) ->
            $("#input-chapterId").empty().trigger("change")
            $("#input-chapterId").append(defaultOption).trigger("change")
            for chapter in chapterList
                newOption = new Option(chapter.ChapterName, chapter.ChapterId, false, false)
                $("#input-chapterId").append(newOption).trigger("change")
        )
    

$(".input-param").iCheck({
    checkboxClass: "icheckbox_flat-blue"
});

input_opener = null
sample_formula_row = null

$(document).ready ->
    CKEDITOR.replace('exercise-input', { allowedContent: true, entities: false });
    exerciseEditor = CKEDITOR.instances["exercise-input"]

$(".add-new-formula").click ->
    $(".formula-contaniner").append('<div class="row input-formula-row">
                                        <div class="col-md-9 input-formula-box">
                                            <div class="input-formula">
                                                <div class="input-formula-tex">\\(\\)</div>
                                                <div class="input-formula-bare-tex hidden"></div>
                                                <div class="input-formula-anglemode hidden"></div>
                                            </div>
                                        </div>
                                        <div class="col-md-3 input-param-box">
                                            <label>
                                                <input class="input-param" type="checkbox"><span style="padding-left: 3px;">Tham số đầu vào</span>
                                            </label>
                                        </div>
                                    </div>')
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $(".input-param").iCheck
        checkboxClass: "icheckbox_flat-blue"
    $(".input-formula").click ->
        input_opener = $(this)
        editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".input-formula").click ->
    input_opener = $(this)
    editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")

$(".open-editor").click ->
    editorName = $(this).data("editor");
    if editorName is "solution"
        editor = window.open("/may-tinh-kogida?editor=true&solver=false&ck=solution-input", "popupWindow", "width=600, height=400, scrollbars=yes")
    else if editorName is "exercise"
        editor = window.open("/may-tinh-kogida?editor=true&solver=false&ck=exercise-input", "popupWindow", "width=600, height=400, scrollbars=yes")

adjustSize = () ->
    texBox = input_opener.find("div").eq(0)
    height = texBox.height()
    input_opener.css("cssText", "height: " + (height + 20) + "px !important;")

window.setMathFormula = (tex, anglemode) ->
    input_opener.find("div").eq(0).text("\\(#{tex}\\)")
    input_opener.find("div").eq(1).text(tex)
    input_opener.find("div").eq(2).text(anglemode)
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    adjustSize()

window.insertMathFormula = (ckEditorName, tex) ->
    CKEDITOR.instances[ckEditorName].insertText("\\(#{tex}\\)")
