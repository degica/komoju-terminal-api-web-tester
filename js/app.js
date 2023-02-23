
var interval

$("#connectToTerminal").click(function(){

    var ip_address = $("#ip_address").val();
    var port = $("#port").val();
    var terminal_id = $("#terminal_id").val();

    $.ajax({
        url: "http://" + ip_address + ":" + port + "/info",    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(terminal_id, "password"));
        },
        success: function(result){
            if(result.enabled)
            {
                $("#status_badge").text("Connected");
                $("#status_badge").attr('class', 'badge badge-success');
            }
            else
            {
                $("#status_badge").text("Disabled");
                $("#status_badge").attr('class', 'badge badge-warning');   
            }
            console.log(result);
        }
    });
});

$("#startPayment").click(function(){
    
    var ip_address = $("#ip_address").val();
    var port = $("#port").val();
    var terminal_id = $("#terminal_id").val();

    var amount = $("#amount").val();
    var currency = $("#currency").val();
    var transaction_type = $("#transaction_type").val();

    $.ajax({
        type: 'POST',
        url: "http://" + ip_address + ":" + port + "/create",    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(terminal_id, "password"));
        },
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify ({
            "amount": parseInt(amount),
            "currency": currency,
            "transaction_type": transaction_type
        }),
        success: function(result){
            $("#session_id").val(result.session_id);
            fetchTransactionStatus(result.session_id)
        },
        error: function(responseText){
            console.log(responseText);
        }
    });
});


function fetchTransactionStatus(session_id) {
    var ip_address = $("#ip_address").val();
    var port = $("#port").val();
    var terminal_id = $("#terminal_id").val();

     clearInterval(interval);

     interval = window.setInterval(function(){
        $.ajax({
            url: "http://" + ip_address + ":" + port + "/sessionStatus/" + session_id,    
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', make_base_auth(terminal_id, "password"));
            },
            success: function(result){
                if(result.status == "completed")
                {
                    clearInterval(interval);
                    $("#session_status").text("Completed");
                    $("#session_status").attr('class', 'badge badge-success');
                }
                else if(result.status == "cancelled")
                {
                    clearInterval(interval);
                    $("#session_status").text("Cancelled");
                    $("#session_status").attr('class', 'badge badge-danger');
                }
                else if(result.status == "pending")
                {
                    $("#session_status").text("Pending");
                    $("#session_status").attr('class', 'badge badge-warning');  
                }

                console.log(result);
            }
        }); 
    }, 1000);
}


function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}