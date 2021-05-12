//signout
const signout = document.querySelector("#signout");
signout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
  location.href = "../../login.html";
});

//listen for auth changes

auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
    }
  });