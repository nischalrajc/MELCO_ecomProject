function deleteCoupon(couponId){
    console.log(couponId)
    Swal.fire({
        title: 'Remove Coupon',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Remove'
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: '/admin/removeCoupon',
            type:'put',
            data: { id: couponId },
            success:function(response){
              if(response.status){
                Swal.fire(
                  'Removed',
                ).then(() => {
                  location.href='/admin/coupons' 
                });
              }
            },
            error: function(error) {
              console.log("Error:", error);
            }
          })
        }
      })
       
}