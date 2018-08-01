$("select").select2({
    language: "vi"
});

$("table").DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Vietnamese.json"
    }
});

$("select[name='gf[GFId]']").on("change", function(event) {
    $("#deleteGFuncBtn").attr("href", "/xoa-cum-chuc-nang?id=" + $(this).val());
});

$("select[name='function[FId]']").on("change", function(event) {
    $("#deleteFuncBtn").attr("href", "/xoa-chuc-nang?id=" + $(this).val());
});