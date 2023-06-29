function addToWishList(id){
    console.log(id)
    $.ajax({
        url: '/add_wishlist?id=' + id,
        type: 'get',
        success: function(response) {
            if (response.status) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Added To WishList',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload();
                });
            } else {
                // Handle the case when the response status is not as expected
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to add to WishList',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        error: function(error) {
            console.log("Error:", error);
        }
    })
}