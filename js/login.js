const loginForm = document.querySelector("#login-form");
// const googleButton = document.querySelector("#loginWithGoogle");
const verification = document.querySelector("#verification");

// let provider = new firebase.auth.GoogleAuthProvider();
// provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
// firebase.auth().languageCode = "it";
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm["email"].value;
  const password = loginForm["password"].value;
  const loginError = document.querySelector(".login_error");

  auth.signInWithEmailAndPassword(email, password).then(
    (cred) => {
      db.collection("usersinfo")
        .doc(cred.user.uid)
        .get()
        .then((doc) => {
          loginForm.reset();
          if (cred.user.emailVerified) {
             if (doc.data().user_type == "student") {
            document.getElementById("button").onclick = location.href =
              "/Student/home_page/index.html";
          } else {
            document.getElementById("button").onclick = location.href =
              "/Teacher/home_page/index.html";
          }
          }
          else if(!cred.user.emailVerified)
          {
            window.last_email = email;
            document.querySelector("#last_part").style.display= "block";
            document.querySelector("#msg").innerHTML = `You need to verify Your email first`
          }
        });
    },
    (err) => {
      loginError.style.display = "block";
    }
  );
});

verification.addEventListener("click",(e)=>
{
  e.preventDefault();
  auth.currentUser.sendEmailVerification();
})
// googleButton.addEventListener("click", (e)=>
// {
//   firebase
//   .auth()
//   .signInWithPopup(provider)
//   .then((result) => {
//     console.log(result);
//     // /** @type {firebase.auth.OAuthCredential} */
//     // var credential = result.credential;

//     // // This gives you a Google Access Token. You can use it to access the Google API.
//     // var token = credential.accessToken;
//     // // The signed-in user info.
//     // var user = result.user;
//     // ...
//   })
// });

// function google() {

//     .catch((error) => {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // The email of the user's account used.
//       var email = error.email;
//       // The firebase.auth.AuthCredential type that was used.
//       var credential = error.credential;
//       // ...
//     });

//   // auth.signInWithPopup(provider).then((res) => {

//   // firebase.auth()
//   // .getRedirectResult()
//   // .then((result) => {
//   //   if (result.credential) {
//   //     /** @type {firebase.auth.OAuthCredential} */
//   //     var credential = result.credential;

//   //     // This gives you a Google Access Token. You can use it to access the Google API.
//   //     var token = credential.accessToken;
//   //     // ...
//   //   }
//   //   // The signed-in user info.
//   //   var user = result.user;
//   // }).catch((error) => {
//   //   // Handle Errors here.
//   //   var errorCode = error.code;
//   //   var errorMessage = error.message;
//   //   // The email of the user's account used.
//   //   var email = error.email;
//   //   // The firebase.auth.AuthCredential type that was used.
//   //   var credential = error.credential;
//   //   // ...
//   // });
//   //   console.log(res);
//   // });
// }
// /* googleButton.addEventListener("click",(e)=>
// {

// }) */

auth.onAuthStateChanged((user) => {
  if (user) {
  } else {
  }
});
