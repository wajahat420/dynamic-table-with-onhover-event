
var selectDate = document.getElementById('date').value
var selectTime = document.getElementById('time').value
var selectHours = (document.getElementById('hours').selectedIndex) + 1

// rows button
var slot1 = document.getElementById('slot1')
var slot2 = document.getElementById('slot2')
var slot3 = document.getElementById('slot3')
var slot4 = document.getElementById('slot4')
var slot5 = document.getElementById('slot5')
var slot6 = document.getElementById('slot6')
var slot7 = document.getElementById('slot7')
var slot8 = document.getElementById('slot8')

var selectSlot = document.getElementById('selectSlot')
var donebtn = document.getElementById('donebtn')
var slotImg = document.getElementById('reservation')

var knowSlot = null
var validDate = false
var sendAllDataToDB = false

slotsArray =  [slot1,slot2,slot3,slot4,slot5,slot6,slot7,slot8]
slotsStringName = ['slot1','slot2','slot3','slot4','slot5','slot6','slot7','slot8']

var userYear = null
var userMonth = null
var userStartDate =null
var userEndDate = null
var userStartHours = null
var userEndHours =null
var userMin = null

bookingTimings = firebase.database().ref().child('booking-Slot-and-Timings')

// Slot Booked  Disable
// bookingTimings.on('value', function(snapshot){
//     snapshot.forEach(function(childSnapshot) {
//         var item = childSnapshot.val();
//         var itemKey = childSnapshot.key;
//         slotNumber =  item.Slot
//         for (var i=0; i<slotsArray.length; i++){
//             if (slotsStringName[i] == slotNumber){
//                 slotsArray[i].style.backgroundColor = 'blue'
//                 slotsArray[i].disabled = true
//             }
//         }


//     });
// })

// On clicking button Change Color  

function slotSelect(clickSlot){
    donebtn.disabled = false
    for (var i=0; i<slotsArray.length; i++){
        if (slotsArray[i] == clickSlot){
            slotsArray[i].style.backgroundColor = 'blue'
            knowSlot = slotsStringName[i]
        }
        if (slotsArray[i].disabled == false){
            if (slotsArray[i] != clickSlot){
                slotsArray[i].style.backgroundColor = 'black'
            }
        }
    }
}

// Enable Select Slot button  

function dateTimeHours(){
    selectHours = (document.getElementById('hours').selectedIndex) + 1
    selectDate = document.getElementById('date').value
    selectTime = document.getElementById('time').value



    userYear = parseInt(selectDate.slice(0,4))
    userMonth = parseInt(selectDate.slice(5,7))
    userStartDate = parseInt(selectDate.slice(8,10))
    userEndDate = userStartDate

    userStartHours = parseInt(selectTime)
    userMin = parseInt(selectTime.slice(3,5))
    userEndHours = userStartHours + selectHours

    var DATE = new Date

    const userFullDate = new Date(userYear,userMonth-1,userStartDate)

    var makeButtonDisable = false


    if (userEndHours >= 24){
        userEndHours = userStartHours + selectHours -24
        userEndDate += 1
    }

    if (selectDate && selectTime ){

        if (userFullDate > DATE){
            validDate = true
        }
        else{
            validDate = false
            makeButtonDisable = true
            swal("Wrong Date Entered..","Please Change Your Date..","warning")
        }

        selectSlot.disabled = makeButtonDisable
        selectSlot.style.backgroundColor = 'white'

        if(!makeButtonDisable){
            selectSlot.style.backgroundColor = 'rgb(190, 39, 114)'
        }


    } 
}

function comparingDBUserDataAndInserting(){
    var counter  = 0;
    if (validDate){
        sendAllDataToDB = true
        var dataSend = false;



        bookingTimings.on('value', function(snapshot){
            if(!dataSend){
            console.log("times")
            snapshot.forEach(function(childSnapshot) {

                const item = childSnapshot.val();
                // console.log(childSnapshot.key)
                var slotOfDB = item.Slot

                // console.log("Database Slot",slotOfDB,"\n","my selected Slot",knowSlot)

                const fetchingdbTime =  item.Time
                const fetchingdbHours = item.Hours
                const fetchingdbDate = item.Date

                const dbYear = parseInt(fetchingdbDate.slice(0,4))
                const dbMonth = parseInt(fetchingdbDate.slice(5,7)) 
                const dbStartDate = parseInt(fetchingdbDate.slice(8,10))
                var dbEndDate = dbStartDate



                var dbStartTimeHours = parseInt(fetchingdbTime)
                const dbTimeMin = parseInt(fetchingdbTime.slice(3,5))
                var dbEndTimeHours = dbStartTimeHours + fetchingdbHours



                var checkingDBdateAndTimings = false

                if (fetchingdbHours + dbStartTimeHours >= 24 ){
                    dbEndDate += 1
                    dbEndTimeHours =  fetchingdbHours + dbStartTimeHours- 24 

                }

                //  Checking User Data and DB Data
                console.log("hi")
                if (knowSlot != slotOfDB){
                    // console.log("not same slot")
                    checkingDBdateAndTimings = true
                }

                else if(userYear !=  dbYear){
                    checkingDBdateAndTimings = true
                }
                else if(userYear == dbYear && userMonth != dbMonth){
                    checkingDBdateAndTimings = true
                }
                else if(userYear == dbYear && userMonth == dbMonth && (userEndDate <  dbStartDate || userStartDate > dbEndDate)){
                    checkingDBdateAndTimings = true
                }
                
                else if (userStartDate ==  dbEndDate ){
                    if(userStartHours > dbEndTimeHours){
                        checkingDBdateAndTimings = true
                    }
                    else if(userStartHours == dbEndTimeHours && userMin >= dbTimeMin){
                        checkingDBdateAndTimings = true
                    }
                    else if(userEndDate == dbStartDate && userEndHours < dbStartTimeHours){
                        checkingDBdateAndTimings = true
                    }
                    else if(userEndDate == dbStartDate && userEndHours == dbStartTimeHours && userMin <= dbTimeMin ){
                        checkingDBdateAndTimings = true
                    }

                }
                else if(userEndDate == dbStartDate){
                    if(userEndHours < dbStartTimeHours){
                        checkingDBdateAndTimings = true
                    }
                    else if(userEndHours ==   dbStartTimeHours && userMin <= dbTimeMin ){
                        checkingDBdateAndTimings = true
                    }
                }
                // console.log("chechkingDBDateAndTimings",checkingDBdateAndTimings)

                if(!checkingDBdateAndTimings){
                    sendAllDataToDB = false
                }

    

            });

            // console.log()

            if(sendAllDataToDB && validDate){
                dataSend = true
                // console.log("i have to enter data")
                console.log("data sending in database")
                selectHours = (document.getElementById('hours').selectedIndex) + 1
                firebase.database().ref('booking-Slot-and-Timings').push({
                    Email: window.localStorage.getItem('user-email'),
                    uid: window.localStorage.getItem('user-uid'),
                    Slot: knowSlot,
                    Date:selectDate,
                    Time: selectTime,
                    Hours: selectHours
                })
                setTimeout(function(){
                    swal("Successfully Booked Slot..","","success")
                },500)
                setTimeout(function(){
                    window.location.assign("../Slips/slip.html")
                },1000)
            }
            else{
                console.log("data not sending in DB")
                swal("Timing Already Reserved..","Please Change Your Timings..","warning")
        
            }

        } // new if ends

            // console.log("ho")
            // donebtnFunction()
            // console.log("sendAllDataInDB",sendAllDataToDB) 
        })  

 
    }
}

function selectedSlot(){
    slotImg.classList.remove("hidden");
    donebtn.classList.remove("hidden");
}

// Sending Data to firebase 

function donebtnFunction(){
    // dateTimeHours()
    // comparingDBUserDataAndInserting()
    // console.log("sendALLData",sendAllDataToDB,"\n","Valid Date",validDate)
    if(sendAllDataToDB && validDate){
        // console.log("i have to enter data")
        console.log("in if")
        selectHours = (document.getElementById('hours').selectedIndex) + 1
        firebase.database().ref('booking-Slot-and-Timings').push({
            Email: window.localStorage.getItem('user-email'),
            uid: window.localStorage.getItem('user-uid'),
            Slot: knowSlot,
            Date:selectDate,
            Time: selectTime,
            Hours: selectHours
        })
        // setTimeout(function(){
        //     swal("Successfully Booked Slot..","","success")
        // },1000)
        // setTimeout(function(){
        //     window.location.assign("../Slips/slip.html")
        // },4000)
    }
    else{
        console.log("in else")
        swal("Timing Already Reserved..","Please Change Your Timings..","warning")

    }
}



