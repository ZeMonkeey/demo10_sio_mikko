

var currentUser;

// Get user information from database and place them in the form.
function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Get current user information from Firestore
            currentUser = db.collection("users").doc(user.uid)

            currentUser.get()
                .then(userDoc => {
                    let userName = userDoc.data().name;
                    let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }

                })

        } else {
            console.log("No User is Logged In")
        }
    })
}
populateInfo();


function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}


function saveUserInfo() {
    userName = document.getElementById("nameInput").value;
    userSchool = document.getElementById("schoolInput").value;
    userCity = document.getElementById("cityInput").value;

    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    document.getElementById('personalInfoFields').disabled = true;
}


