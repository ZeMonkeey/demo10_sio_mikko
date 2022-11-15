firebase.auth().onAuthStateChanged(user => {
    if (user) {
        getBookmarks(user)
    } else {
        console.log("No user is signed in");
    }
});


function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            var bookmarks_now = userDoc.data().bookmarks;
            // console.log(bookmarks_now);

            let CardTemplate = document.getElementById("CardTemplate");
            bookmarks_now.forEach(thisHikeID => {
                console.log(thisHikeID);

                db.collection("hikes").where("code", "==", thisHikeID).get()
                    .then(hikeData => {
                        size = hikeData.size;
                        queryData = hikeData.docs;

                        if (size == 1) {
                            // console.log("one doc returned")
                            var doc = queryData[0].data();
                            var hikeName = doc.name;
                            var hikeID = doc.code;
                            var hikeLength = doc.length;

                            let newCard = CardTemplate.content.cloneNode(true);
                            newCard.querySelector('.card-title').innerHTML = hikeName;
                            newCard.querySelector('.card-length').innerHTML = hikeLength;
                            newCard.querySelector('a').onclick = () => setHikeData(hikeID);
                            newCard.querySelector('img').src = `./images/${hikeID}.jpg`;
                            hikeCardGroup.appendChild(newCard);

                        } else {
                            console.log("query returns more than one result or no results")
                        }
                    })
            })
        })
}   