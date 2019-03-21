var txtemail = document.getElementById('email')
var txtpassword = document.getElementById('password')
var txtaddress = document.getElementById('address')
var txtphone = document.getElementById('phoneNo')
var txtname = document.getElementById('firstName')


function submitData(){
    email = txtemail.value
    password = txtpassword.value
    const auth = firebase.auth()

    name = txtname.value
    address = txtaddress.value
    phone = txtphone.value

    if (email && password && name && address && phone){
        const consle = auth.createUserWithEmailAndPassword(email,password)
    }

}
