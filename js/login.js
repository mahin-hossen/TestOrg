const loginForm = document.querySelector("#login-form");
// const googleButton = document.querySelector("#loginWithGoogle");
const verification = document.querySelector("#verification");

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
                "./Student/home_page/index.html";
            } else {
              document.getElementById("button").onclick = location.href =
                "./Teacher/home_page/index.html";
            }
          } else if (!cred.user.emailVerified) {
            window.last_email = email;
            document.querySelector("#last_part").style.display = "block";
            document.querySelector(
              "#msg"
            ).innerHTML = `You need to verify Your email first`;
          }
        });
    },
    (err) => {
      loginError.style.display = "block";
    }
  );
});

verification.addEventListener("click", (e) => {
  e.preventDefault();
  auth.currentUser.sendEmailVerification();
});

auth.onAuthStateChanged((user) => {
  if (user) {
  } else {
  }
});
