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
                    title: "Tên của khối/ lớp mới"
                    closeButton: false
                    callback: (result) ->
                        window.location.href = "/tao-khoi-lop-moi?ten=#{encodeURIComponent(result)}"
                    buttons:
                        confirm: 
                            label: "Tạo mới"
                        cancel: 
                            label: "Bỏ tạo"
        }
    ];
});

$(".edit").click ->
    gradeId = $(this).data("gradeid")
    bootbox.prompt
        size: "small"
        title: "Tên mới của khối/ lớp (mã: #{gradeId})"
        closeButton: false
        callback: (result) ->
            window.location.href = "/sua-ten-khoi-lop?ma=#{encodeURIComponent(gradeId)}&ten=#{encodeURIComponent(result)}"
        buttons:
            confirm: 
                label: "Sửa"
            cancel: 
                label: "Bỏ sửa"

$(".remove").click ->
    gradeId = $(this).data("gradeid")
    bootbox.confirm
        message: "<h4>Bạn có chắc chắn xóa khối/ lớp (mã: #{gradeId}) này?</h4>"
        closeButton: false
        callback: (result) ->
            if (result)
                window.location.href = "/xoa-khoi-lop?ma=#{encodeURIComponent(gradeId)}"
        buttons:
            confirm: 
                label: "Xóa"
            cancel: 
                label: "Bỏ xóa"