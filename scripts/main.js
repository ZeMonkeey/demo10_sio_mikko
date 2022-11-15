var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

        // the following functions are always called when someone is logged in
        read_display_Quote();
        insertName();
        populateCardsDynamically();
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
});


function read_display_Quote() {
    //console.log("inside the function")

    //get into the right collection
    db.collection("quotes").doc("tuesday")
        .onSnapshot(function (tuesdayDoc) {
            //console.log(tuesdayDoc.data());
            document.getElementById("quote-goes-here").innerHTML = tuesdayDoc.data().quote;
        })
}


// Insert name function using the global variable "currentUser"
function insertName() {
    currentUser.get().then(userDoc => {
        //get the user name
        var user_Name = userDoc.data().name;
        console.log(user_Name);
        $("#name-goes-here").text(user_Name); //jquery
        // document.getElementByID("name-goes-here").innetText=user_Name;
    })
}


function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    let hikeCardGroup = document.getElementById("hikeCardGroup");

    db.collection("hikes").orderBy("length").limit(2).get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().code; //gets the unique ID field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = hikeName;     //equiv getElementByClassName
                testHikeCard.querySelector('.card-length').innerHTML = hikeLength;  //equiv getElementByClassName
                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);//equiv getElementByTagName

                testHikeCard.querySelector('i').id = 'save-' + hikeID;  //assign specific ID to card that was clicked
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);  //this will call a function upon clicking bookmark

                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;   //equiv getElementByTagName
                testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName=" + hikeName + "&id=" + hikeID;
                hikeCardGroup.appendChild(testHikeCard);
            })

        })
}


function setHikeData(id) {
    localStorage.setItem('hikeID', id);
}


function saveBookmark(id) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(id)
    }, {
        merge: true
    }).then(function () {
        console.log("Bookmark for " + currentUser);
        var iconId = 'save-' + id;
        console.log(iconId);
        document.getElementById(iconId).innerText = 'bookmark';
    })
}

