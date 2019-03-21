const bookingTimings = firebase.database().ref().child('booking-Slot-and-Timings')

// var childDiv;
// var textInLink;
var emails;



var containerDiv =  document.getElementById('container')


var slipSelect = null;
var numOFemails = []
var ALLemails = []
var UserData = []
var keysOFfirebase = []

bookingTimings.on('value', function(snapshot){
    snapshot.forEach(function(childSnapshot) {
        let temporary = []

        const item = childSnapshot.val();
        const key = childSnapshot.key
        keysOFfirebase.push(key)
        console.log(key)
        emails = item.Email

        temporary.push(item.Date)
        temporary.push(item.Time)
        temporary.push(item.Hours)
        temporary.push(item.Slot)
        temporary.push(item.Email)
        temporary.push(item.uid)

        UserData.push(temporary)

        var indexOf = emails.indexOf('@')
        emails = emails.slice(0,indexOf) 
        ALLemails.push(emails)


        

    });
    creatingDIV()

})

function creatingDIV() {

    for(var j=0;j<ALLemails.length;j++){

        containerDiv.innerHTML += `
                        <div class='row1' id=${j} onclick='showUserData(${j})' >  ${ALLemails[j]}  </div>
        `    

    }
        

}


function showUserData(data){
    slipSelect =  data
    console.log(data)

    Swal.fire({
        title: 'Are you sure?',
        text:`
            "Date: ${UserData[data][0]} \n
            Time: ${UserData[data][1]} \n
            Hours: ${UserData[data][2]} \n
            Slot:${UserData[data][3]}  \n
             UID: ${UserData[data][5]}"
        `,
        // type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete Reservation'
      }).then((result) => {
        if (result.value) {
          Swal.fire({
              title: "Are You Sure you want to Delete?",
              showCancelButton: true,
              cancelButtonColor: '#d33',
              confirmButtonText: "Yes"
          }).then((deleteIT) => {
              if(deleteIT.value){
                  deleteReservation()
              }
          })
        }
 
      })

}
function  deleteReservation(){
    firebase.database().ref().child('/booking-Slot-and-Timings/' + keysOFfirebase[slipSelect]).remove();
    console.log("hi")
    window.location.reload();

    // document.getElementById(slipSelect).display = "none"
    
}











        // var childDiv  =document.createElement('div')
        // var textInLink = document.createTextNode(ALLemails[j])
    
        // childDiv.setAttribute("class",'row1')  
        // childDiv.setAttribute('onclick',"showUserData(numOFemails[j])")
    
        // childDiv.appendChild(textInLink)
        // containerDiv.appendChild(childDiv) 