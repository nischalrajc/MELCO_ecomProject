function removeAddress(addressId){
    console.log(addressId)
    Swal.fire({
        title: 'Remove ?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url:'/removeAddress',
                type:'put',
                data:{id:addressId},
                success:function(response){
                   if(response.status){
                    Swal.fire(
                        'Deleted!',
                        'success'
                      ).then(() => {
                        location.href='/profile' 
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