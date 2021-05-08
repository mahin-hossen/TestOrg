//signup
console.log("hello world");
const signupForm = document.querySelector("#signup-form");
const password_mismatch = document.querySelector(".password_mismatch");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm["email"].value;
  const username = signupForm["username"].value;
  const password1 = signupForm["password1"].value;
  const password2 = signupForm["password2"].value;
  const teacher = signupForm["teacher"].value;
  const student = signupForm["student"].value;

  if (password1 != password2) {
    password_mismatch.style.display = "block";
  } else {
    auth.createUserWithEmailAndPassword(email, password1).then((cred) => {        
        signupForm.reset();
        document.getElementById("button").onclick = location.href = "../login.html";  
    });
  }

  //   console.log(`${email}  ${username}  ${password1}  ${password2} `);
  //   if(teacher) console.log(`${teacher}`);
  //   else console.log(`${student}`);
});
