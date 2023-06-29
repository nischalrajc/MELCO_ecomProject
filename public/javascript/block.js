
function block(id){
    Swal.fire({
  title: 'Block User',
  text: "Are you sure you want to block this user?",
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Block'
}).then((result) => {
  if (result.isConfirmed) {
    $.ajax({
      url: '/admin/blockuser',
      type:'put',
      data: { id: id },
      success:function(response){
        if(response.status){
          Swal.fire(
            'User blocked',
          ).then(() => {
            location.href='/admin/user_datails' 
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