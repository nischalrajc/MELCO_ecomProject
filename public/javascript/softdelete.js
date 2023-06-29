
function softdelete(id){
    console.log(id)
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to delete this item!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'delete'
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/admin/deleteitem',
                type:'put',
                data:{id,id},
                success:function(response){
                    if(response.status){
                        Swal.fire(
                            'Deleted!',
                            'item has been deleted.',
                            'success'
                          ).then(() => {
                            location.href='/admin/product_info' 
                          });
                    }
                },
                error:function(error){
                    console.log("error:",error)
                }
            })
         
        }
      })
}
