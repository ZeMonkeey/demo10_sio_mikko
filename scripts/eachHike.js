function populateReviews() {
    let hikeCardTemplate = document.getElementById("CardTemplate");
    let hikeCardGroup = document.getElementById("CardGroup");

    let params = new URL(window.location.href);         //get URL of search bar
    let hikeCode = params.searchParams.get("id");       //get value for key "id"
    let hikeName = params.searchParams.get("hikeName"); //get value for key "hikeNam
    document.getElementById("HikeName").innerHTML = hikeName;
    let message = "All reviews submitted for " + hikeName;
    message += " &nbsp | Document id is:  " + hikeCode;
    document.getElementById("details-go-here").innerHTML = message;

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("Reviews").where("code", "==", hikeCode).get()
        .then(allReviews => {
            reviews = allReviews.docs
            console.log(reviews);
            reviews.forEach(doc => {
                var title = doc.data().title; //gets the name field
                var level = doc.data().level; //gets the unique ID field
                var season = doc.data().season;
                var description = doc.data().description; //gets the length field
                var flooded = doc.data().flooded;
                var scrambled = doc.data().scrambled;

                let reviewCard = hikeCardTemplate.content.cloneNode(true);
                reviewCard.querySelector('.title').innerHTML = title;     //equiv getElementByClassName
                reviewCard.querySelector('.level').innerHTML = `level: ${level}`;
                reviewCard.querySelector('.season').innerHTML = `season: ${season}`;
                reviewCard.querySelector('.scrambled').innerHTML = `scrambled: ${scrambled}`;  //equiv getElementByClassName
                reviewCard.querySelector('.flooded').innerHTML = `flooded: ${flooded}`;  //equiv getElementByClassName
                reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
                hikeCardGroup.appendChild(reviewCard);
            })
        })
}
populateReviews();