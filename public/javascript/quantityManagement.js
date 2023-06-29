function quantityManagement(productId,count){
    console.log(productId,count)
    $.ajax({
        url:'/quantity',
        type:'post',
        data:{id:productId,count:count},
        success:function(response){
            console.log(response.quantity)
            console.log(response.totalamount)
            document.getElementById(productId).innerHTML = response.quantity;
            document.getElementById('carttotal').innerHTML=response.totalamount;
            document.getElementById('cartamount').innerHTML=response.totalamount;
        },
        error: function(error) {
            console.log("Error:", error);
        }
    })
}