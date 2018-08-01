labelContainer = null

exam = null

focusElement = 
    element: null
    value: null

$(document).ready ->
    $("input[name=DeadlineDate]").inputmask();
    labelContainer = $(".label-container:eq(0)").clone()

    $("form#form_step1").submit (event) ->
        event.preventDefault();
        data = $(this).serializeArray()
        RawQuestionLabelList = data.filter((x) -> x.name is "QuestionLabel").map((x) -> x.value)

        SortedRawQuestionLabelList = RawQuestionLabelList.map((x) -> x.trim()).sort()
        for index in [0...(SortedRawQuestionLabelList.length - 1)] by 1
            if SortedRawQuestionLabelList[index] is SortedRawQuestionLabelList[index + 1]
                swal('Thông báo', 'Tồn tại nhãn trùng nhau', 'error')
                return false
                
        RawQuestionNumberWithLabelList = data.filter((x) -> x.name is "QuestionNumberWithLabel").map((x) -> x.value)
        RawQuestionWithLabelAndNumberList = RawQuestionLabelList.map((label, index) -> {label: label, number: RawQuestionNumberWithLabelList[index]}).filter((question) -> question.label.trim() isnt "")
        
        Time = data.find((x) -> x.name is "Time").value
        QuestionNumber = data.find((x) -> x.name is "QuestionNumber").value
        QuestionNumberInput = data.find((x) -> x.name is "QuestionNumberInput").value
        
        if isNaN(Time) or Number(Time) <= 0
            swal('Thông báo', 'Thời gian nhập vào không đúng. Vui lòng nhập lại!', 'error')
            return false

        if isNaN(QuestionNumber) or Number(QuestionNumber) < 0 or Math.floor(QuestionNumber) isnt Math.ceil(QuestionNumber)
            swal('Thông báo', 'Số lượng câu hỏi để thi không đúng. Vui lòng nhập lại!', 'error')
            return false

        if isNaN(QuestionNumberInput) or Number(QuestionNumberInput) < 0 or Math.floor(QuestionNumberInput) isnt Math.ceil(QuestionNumberInput)
            swal('Thông báo', 'Số lượng câu hỏi nhập vào không đúng. Vui lòng nhập lại!', 'error')
            return false

        if Number(QuestionNumberInput) < Number(QuestionNumber)
            swal('Thông báo', 'Số lượng câu hỏi nhập vào nhỏ hơn số lượng câu hỏi để thi. Vui lòng nhập lại!', 'error')
            return false


        if data.findIndex((x) -> x.name is "UseDeadline") >= 0
            DeadlineString = data.find((x) -> x.name is "Deadline").value
            if !moment(DeadlineString, "DD/MM/YYYY HH:mm").isValid()
                swal('Thông báo', 'Ngày nhập không đúng. Vui lòng nhập lại!', 'error')
                return false

        if RawQuestionWithLabelAndNumberList.length > 0
            QuestionNumber = Number(data.find((x) -> x.name is "QuestionNumber").value)
            QuestionLabelNumber = 0
            for questionLabelWithNumber in RawQuestionWithLabelAndNumberList
                QuestionLabelNumber += Number(questionLabelWithNumber.number)

            if QuestionNumber isnt QuestionLabelNumber
                swal('Thông báo', 'Số lượng câu hỏi không bằng với tổng số lượng trong cơ cấu nhãn. Vui lòng nhập lại!', 'error')
                return false
            else
                $(this).unbind().submit()
        else
            window.location.href = "/admin/luu-thi-thu/buoc-1?ExamName=#{data.find((x) -> x.name is "ExamName").value}&Time=#{data.find((x) -> x.name is "Time").value}&GradeSubjectId=#{data.find((x) -> x.name is "GradeSubjectId").value}&QuestionNumber=#{data.find((x) -> x.name is "QuestionNumber").value}&QuestionNumberInput=#{data.find((x) -> x.name is "QuestionNumberInput").value}&UseDeadline=#{if data.findIndex((x) -> x.name is "UseDeadline") >=0 then "yes" else "no"}&Deadline=#{data.find((x) -> x.name is "Deadline").value}&UseSecret=#{if data.findIndex((x) -> x.name is "UseSecret") >=0 then "yes" else "no"}&Secret=#{data.find((x) -> x.name is "Secret").value}"
        
        return false
    
    if (window.location.href.indexOf("buoc-2") >= 0)
        exam = JSON.parse($("#examInfo").val());
        QuestionNumberInput = JSON.parse(exam.Structure).QuestionNumberInput
        QuestionWithLabelAndNumberList = JSON.parse(exam.Structure).QuestionWithLabelAndNumberList
        
        for index in [0...QuestionNumberInput] by 1  
            editor = CKEDITOR.replace("content_#{index}", { allowedContent: true, entities: false, extraAllowedContent: 'span' })

        CKEDITOR.on "instanceReady", (event) ->
            event.editor.on "focus", () ->
                focusElement.element = "textarea"
                focusElement.value = "#{event.editor.name}"

            window.setMathFormula = (tex) ->
                if focusElement.element is "input"
                    oldText = focusElement.value.val()
                    focusElement.value.val(oldText + "\\( \\displaystyle #{tex} \\)")
                    focusElement.value.focus()
                else
                    CKEDITOR.instances["#{focusElement.value}"].insertText("\\(\\displaystyle #{tex}\\)")  

        $("form#form_step2").submit (event) ->
            event.preventDefault();
            data = $(this).serializeArray()
            QuestionList = []
            for index in [0...QuestionNumberInput] by 1
                solutionIndex = Number(data.find((x) -> x.name is "issolution_#{index}").value)
                if QuestionWithLabelAndNumberList.length > 1
                    Question =
                        Content: data.find((x) -> x.name is "content_#{index}").value,
                        Label: data.find((x) -> x.name is "label_#{index}").value,
                        AllowRandom: data.findIndex((x) -> x.name is "allowrandom_#{index}") >= 0,
                        SolutionList: data.filter((x) -> x.name is "solutiontext_#{index}").map((x) -> x.value).map((value, index) => new Object({ text: value, solution: solutionIndex is Number(index), id: index })),
                        MaxSolutionInRow: data.find((x) -> x.name is "maxsolutioninrow_#{index}").value,
                        ImageList: data.filter((x) -> x.name is "imglink_#{index}").map((x) -> x.value).filter((link) => link.trim() != ""),
                        MaxImageInRow: data.find((x) -> x.name is "maximginrow_#{index}").value
                else
                    Question =
                        Content: data.find((x) -> x.name is "content_#{index}").value,
                        AllowRandom: data.findIndex((x) -> x.name is "allowrandom_#{index}") >= 0,
                        SolutionList: data.filter((x) -> x.name is "solutiontext_#{index}").map((x) -> x.value).map((value, index) => new Object({ text: value, solution: solutionIndex is Number(index), id: index })),
                        MaxSolutionInRow: data.find((x) -> x.name is "maxsolutioninrow_#{index}").value,
                        ImageList: data.filter((x) -> x.name is "imglink_#{index}").map((x) -> x.value).filter((link) => link.trim() != ""),
                        MaxImageInRow: data.find((x) -> x.name is "maximginrow_#{index}").value
                        
                QuestionList.push(Question)

            $(this).unbind().submit()

            return false
        
        
$("#open_editor").click ->
    editor = window.open("/may-tinh-kogida?editor=true&solver=false", "popupWindow", "width=600, height=400, scrollbars=yes")


$("#input-gradesubjectid").select2
    language: "vi"

$("select").select2
    language: "vi"

$("#add-label").click ->
    $("#form_step1 .box-body").append(labelContainer)
    labelContainer = $(".label-container:eq(0)").clone()
    $(".remove-label").click ->
        $(this).closest(".label-container").remove()

$(".remove-label").click ->
    $(this).closest(".label-container").remove()

$("#previous").click ->
    currentIndex = Number($("#questionList").find("option:selected").val())
    newIndex = currentIndex - 1
    if newIndex >= 0
        $(".question-container.show").toggleClass("hidden")
        $(".question-container.show").toggleClass("show")
        $(".question-container[data-index=#{newIndex}]").toggleClass("hidden")
        $(".question-container[data-index=#{newIndex}]").toggleClass("show")
        $("#questionList").val(newIndex).trigger("change")

$("#next").click ->
    currentIndex = Number($("#questionList").find("option:selected").val())
    newIndex = currentIndex + 1
    QuestionNumberInput = JSON.parse(exam.Structure).QuestionNumberInput
    if newIndex < QuestionNumberInput
        $(".question-container.show").toggleClass("hidden")
        $(".question-container.show").toggleClass("show")
        $(".question-container[data-index=#{newIndex}]").toggleClass("hidden")
        $(".question-container[data-index=#{newIndex}]").toggleClass("show")
        $("#questionList").val(newIndex).trigger("change")

$("#questionList").on "change", (event) ->
    newIndex = Number($(this).find("option:selected").val())
    $(".question-container.show").toggleClass("hidden")
    $(".question-container.show").toggleClass("show")
    $(".question-container[data-index=#{newIndex}]").toggleClass("hidden")
    $(".question-container[data-index=#{newIndex}]").toggleClass("show")

$("textarea").focus (event) ->
    focusElement.element = "textarea"
    focusElement.value = $(this).attr("name")

$("input").focus (event) ->
    focusElement.element = "input"
    focusElement.value = $(this)

    