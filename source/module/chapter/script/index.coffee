$(document).ready ->
    CKEDITOR.replace('input-content', { allowedContent: true })

$("select").select2
    language: "vi"

$("table").DataTable({
    language: {
        url: "/components/datatables.net/i8n/vietnamese.json"
    }
});

$(".edit").click ->
    window.location.href = "/sua-chuong?ma=#{encodeURIComponent($(this).data("chapterid"))}"

$(".remove").click ->
    chapterId = $(this).data("chapterid")
    bootbox.confirm
        message: "<h4>Bạn có chắc chắn xóa chương này?</h4>"
        closeButton: false
        callback: (result) ->
            if (result)
                window.location.href = "/xoa-chuong?ma=#{encodeURIComponent(chapterId)}"
        buttons:
            confirm: 
                label: "Xóa"
            cancel: 
                label: "Bỏ xóa"