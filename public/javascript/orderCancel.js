

function orderCancelAdmin(orderId){
    console.log(orderId)
    $.ajax({
        url:'/admin/orderCancel',
        type:'put',
        data:{id:orderId},
        success:function(response){
            if(response.status){
                location.reload()
            }
        },
        error: function(error) {
            console.log("Error:", error);
        }
    })
}

