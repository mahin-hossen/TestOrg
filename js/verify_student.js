const all = document.querySelector("#all");
const lost = document.querySelector("#lost");
auth.onAuthStateChanged(async (user) => {
    const currUser = await db
    .collection("usersinfo")
    .doc(auth.currentUser.uid)
    .get();
  if (user.emailVerified==0 || currUser.data().user_type != "student") {
    all.style.display="none";
    lost.style.display = "block";
    
    console.log("dont access");
  } 
});
{/* <div id="catuion"></div> */}