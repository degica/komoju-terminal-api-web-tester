
var interval

$("#connectToTerminal").click(function(){

    var terminal_id = $("#terminal_id").val();
    var secret_key = $("#secret_key").val();

    $.ajax({
        url: "https://komoju.com/api/v1/pos_terminals/" + terminal_id,    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(secret_key, ""));
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


$("#createSession").click(function(){

    var amount = $("#amount").val();
    var currency = $("#currency").val();
    var secret_key = $("#secret_key").val();
    var transaction_type = $("#transaction_type").val();

    console.log(transaction_type);


    $.ajax({
        type: 'POST',
        url: "https://komoju.com/api/v1/sessions",    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(secret_key, ""));
        },
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify ({
            "amount": parseInt(amount),
            "currency": currency,
            "payment_data": {
                "capture": transaction_type
            }
        }),
        success: function(result){
            $("#session_id").val(result.id);
            fetchTransactionStatus(result.id)
        },
        error: function(responseText){
            console.log(responseText);
        }
    });
});

$("#pushToDevice").click(function(){

    var terminal_id = $("#terminal_id").val();
    var secret_key = $("#secret_key").val();
    var session_id = $("#session_id").val();

    $.ajax({
        type: 'POST',
        url: "https://komoju.com/terminal/" + terminal_id + "/session/" + session_id + "/push",    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(secret_key, ""));
        },
        success: function(result){

        },
        error: function(responseText){
            console.log(responseText);
        }
    });
});


$("#printReceipt").click(function(){

    var terminal_id = $("#terminal_id").val();
    var secret_key = $("#secret_key").val();
    var session_id = $("#session_id").val();

    $.ajax({
        type: 'POST',
        url: "https://komoju.com/terminal/" + terminal_id + "/session/" + session_id + "/print",    
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(secret_key, ""));
        },
        success: function(result){

        },
        error: function(responseText){
            console.log(responseText);
        }
    });
});

function fetchTransactionStatus(session_id) {

     clearInterval(interval);

     var secret_key = $("#secret_key").val();

     interval = window.setInterval(function(){
        $.ajax({
            url: "https://komoju.com/api/v1/sessions/" + session_id,    
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', make_base_auth(secret_key, ""));
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