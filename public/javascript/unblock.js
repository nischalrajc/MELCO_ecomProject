
function unBlock(id) {
    Swal.fire({
      title: 'Unblock User',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'unblock'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: '/admin/unblockuser',
          type: 'PUT',
          data: { id: id },
          success: function(response) {
            if(response.status){
              Swal.fire(
                'User Unblocked'
              ).then(() => {
                location.href='/admin/user_datails' 
              });
            }
            },
          error: function(error) {
            console.log("Error:", error);
          }
        });
      }
    });
  }
  