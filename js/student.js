const userID = document.querySelector("#userID");

auth.onAuthStateChanged(async(user) => {
    if (user) {
      const currUser = await db.collection("usersinfo").doc(auth.currentUser.uid).get();
      userID.textContent = currUser.data().username;
      console.log(currUser.data().username);
    } else {
      console.log(`hello`);
    }
  });


