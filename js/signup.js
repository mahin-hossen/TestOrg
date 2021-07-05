//signup
const signupForm = document.querySelector("#signup-form");
const password_mismatch = document.querySelector(".password_mismatch");
const msg = document.querySelector("#msg");
const prevs = document.querySelector("#prevs");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm["email"].value;
  const username = signupForm["username"].value;
  // const university = signupForm["university"].value;
  // const semester = signupForm["semester"].value;
  // const birthday = signupForm["birthday"].value;
  const password1 = signupForm["password1"].value;
  const password2 = signupForm["password2"].value;
  const person = document.getElementsByName("person");

  if (password1 != password2) {
    password_mismatch.style.display = "block";
  } else {
    auth
      .createUserWithEmailAndPassword(email, password1)
      .then(async (cred) => {
        await auth.currentUser.sendEmailVerification();
        if (person[1].checked) {
          return db.collection("usersinfo").doc(cred.user.uid).set({
            username: username,
            email: email,
            // university: university,
            // birthday: birthday,
            user_type: "student",
            totalrooms: 0,
          });
        } else if (person[0].checked) {
          return db.collection("usersinfo").doc(cred.user.uid).set({
            username: username,
            email: email,
            user_type: "teacher",
            // university: university,
            // birthday: birthday,
            totalrooms: 0,
          });
        }
      })

      .then(() => {
        signupForm.reset();
        prevs.style.display = "none";
        msg.style.display = "block";
        msg.innerHTML =
          "Verification link has been sent to your email. Please verify to login";
        // document.getElementById("button").onclick = location.href =
        //   "../login.html";
      });
  }

  //   console.log(`${email}  ${username}  ${password1}  ${password2} `);
  //   if(teacher) console.log(`${teacher}`);
  //   else console.log(`${student}`);
});
