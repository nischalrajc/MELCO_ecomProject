function removeCart(id){
$.ajax({
    url:'/cart',
    type:'put',
    data:{id,id},
    success:function(response){
        if(response.status){
            location.reload()
        }
    },
    error: function(error) {
        console.log("Error:", error);
      }
});
}