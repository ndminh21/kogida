$("select").select2
    language: "vi"

$("table").DataTable({
    language: {
        url: "/components/datatables.net/i8n/vietnamese.json"
    }
});

$(".remove").click ->
    subjectId = $(this).data("subjectid")
    bootbox.confirm
        message: "<h4>Bạn có chắc chắn xóa môn học (mã: #{subjectId}) này?</h4>"
        closeButton: false
        callback: (result) ->
            if (result)
                window.location.href = "/xoa-mon-hoc?ma=#{encodeURIComponent(subjectId)}"
        buttons:
            confirm: 
                label: "Xóa"
            cancel: 
                label: "Bỏ xóa"