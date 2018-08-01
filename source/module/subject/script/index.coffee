$("table").DataTable({
    language: {
        url: "/components/datatables.net/i8n/vietnamese.json"
    },
    dom: 'Bfrtip',
    paging: false,
    buttons: [
        {
            text: 'Thêm mới',
            action: (e, dt, node, config) ->
                bootbox.prompt
                    size: "small"
                    title: "Tên của môn học mới"
                    closeButton: false
                    callback: (result) ->
                        if result?
                            window.location.href = "/tao-mon-hoc-moi?ten=#{encodeURIComponent(result)}"
                    buttons:
                        confirm: 
                            label: "Tạo mới"
                        cancel: 
                            label: "Bỏ tạo"
        }
    ];
});

$(".edit").click ->
    subjectId = $(this).data("subjectid")
    bootbox.prompt
        size: "small"
        title: "Tên mới của môn học (mã: #{subjectId})"
        closeButton: false
        callback: (result) ->
            window.location.href = "/sua-ten-mon-hoc?ma=#{encodeURIComponent(subjectId)}&ten=#{encodeURIComponent(result)}"
        buttons:
            confirm: 
                label: "Sửa"
            cancel: 
                label: "Bỏ sửa"

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