const all = document.querySelector("#all");
const lost = document.querySelector("#lost");

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const currUser = await db
      .collection("usersinfo")
      .doc(auth.currentUser.uid)
      .get();
    if (user.emailVerified == 0 || currUser.data().user_type != "student") {
      all.style.display = "none";
      lost.style.display = "block";
      console.log("dont access");
    }
  }
  else
  {
    all.style.display = "none";
    console.log(all);
    console.log(lost);
    lost.style.display = "block";
  }
});
{/* <div id="catuion"></div> */}