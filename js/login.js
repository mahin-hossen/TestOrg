//login

const loginForm = document.querySelector("#login-form");

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
          if (doc.data().user_type == "student") {
            document.getElementById("button").onclick = location.href =
              "/Student/home_page/index.html";
          } else {
            document.getElementById("button").onclick = location.href =
              "/Teacher/home_page/index.html";
          }
        });
    },
    (err) => {
      loginError.style.display = "block";
    }
  );
});


//listen for auth changes

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
  }
});
