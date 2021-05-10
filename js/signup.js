//signup
const signupForm = document.querySelector("#signup-form");
const password_mismatch = document.querySelector(".password_mismatch");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm["email"].value;
  const username = signupForm["username"].value; 
  const password1 = signupForm["password1"].value;
  const password2 = signupForm["password2"].value;
  const person = document.getElementsByName('person');
   
  if (password1 != password2) {
    password_mismatch.style.display = "block";
  } else {
    auth.createUserWithEmailAndPassword(email, password1).then((cred) => {  
      if(person[1].checked)      
      {        
        return db.collection("usersinfo").doc(cred.user.uid).set(
        {
          username: username,
          email: email,
          user_type: "student",
        });
      }
      else if(person[0].checked)
      {
        return db.collection("usersinfo").doc(cred.user.uid).set(
          {
            username: username,
            email: email,
            user_type: "teacher",
          });
      }
        
    }).then(()=>{
      signupForm.reset();
      document.getElementById("button").onclick = location.href = "../login.html";  
    });
  }

  //   console.log(`${email}  ${username}  ${password1}  ${password2} `);
  //   if(teacher) console.log(`${teacher}`);
  //   else console.log(`${student}`);
});
