function addToCart(id) {
    $.ajax({
        url: '/add_Cart?id=' + id,
        type: 'get',
        success: function(response) {
            if (response.status) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Added To Cart',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to add to cart',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        error: function(error) {
            console.log("Error:", error);
        }
    });
}
