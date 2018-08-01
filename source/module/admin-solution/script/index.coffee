$(document).ready ->
    

$("#input-gradeSubjectId").select2
    language: "vi"

$("#input-chapterid").select2
    language: "vi"
    disabled: true

$("table").DataTable({
    language: {
        url: "/components/datatables.net/i8n/vietnamese.json"
    }
});

$("#input-gradeSubjectId").on "change", (event) ->
    gradeSubjectId = $(this).val()

    $("#input-chapterid").empty().trigger("change");

    if (Number(gradeSubjectId) is -1)
        $("#input-chapterid").prop("disabled", true)
    else
        $("#input-chapterid").prop("disabled", false)

    $.post "/api/tim-kiem-chuong-theo-ma-phan-cong", { gradeSubjectId: gradeSubjectId }, (chapterList) ->
        for chapter, index in chapterList
            newOption = new Option(chapter.ChapterName, chapter.ChapterId, index is 0, index is 0)
            $("#input-chapterid").append(newOption).trigger("change")


            