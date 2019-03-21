// export {uid};
// export var uid = null
//  JScOXO123YaXXuo02RdXPBrKT7g2
// fm7bO6j3xjaQvf1UvNRaIBx43163

var submit = document.getElementById('submit')
var email = document.getElementById('name')
var password = document.getElementById('password')
var logout = document.getElementById('logout')

submit.addEventListener('click', function(event){
    event.preventDefault()
    email = email.value
    password = password.value
    var user = firebase.auth().currentUser;
    firebase.auth().signInWithEmailAndPassword(email, password)
    
    .then(function(userUid){
        uid = user.uid
        email = user.email
        window.localStorage.setItem('user-uid', uid);
        window.localStorage.setItem('user-email', email);
        console.log(uid,email)

        swal("You Have Signed-in!","WELCOME","success", {
            buttons: {
              Ok: true
            },
          })
          .then((value) => {
            switch (value) {          
              case "Ok":
                window.location.assign("./Booking-and-Timings/Booking-Timings.html")
                break;

              default:
                break
            }
          });

    }) 
    .catch(function(err){
        swal("Wrong Email or Password","Sign in Again","warning")
    })

})