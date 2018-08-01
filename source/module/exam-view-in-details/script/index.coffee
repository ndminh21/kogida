Time = Number($("input[type=hidden]").val())

$('#clock').countdown(moment().add(Time, 'm').format("YYYY/MM/DD HH:mm:ss"))
    .on('update.countdown', (event) ->
        format = '%H:%M:%S';
        $(this).html(event.strftime(format));
    )
    .on('finish.countdown', (event) ->
        console.log ("Duy")
        $("form[action='/nop-bai']").unbind().submit()
    );