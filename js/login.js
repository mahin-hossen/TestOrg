//login

const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm["email"].value;
  const password = loginForm["password"].value;
  const person = document.getElementsByName('person');
  const loginError = document.querySelector(".login_error");

  auth.signInWithEmailAndPassword(email, password).then((cred) => {      
    // loginForm.reset();
    if (person[1].checked) {        ////////have some error
        db.collection("students").doc(cred.user.uid).get().then((doc)=>
        {    
          // console.log(doc.data().user_type);      
          if(doc.data().user_type==="student")
          {            
            document.getElementById("button").onclick = location.href =
            "/Student/home_page/index.html";
          }
        },err=>
        {
          loginError.style.display="block";
        }
        );
      
    } else if(person[0].checked){       ////////have some error
      db.collection("teachers").doc(cred.user.uid).get().then((doc)=>
      {
        // console.log(doc.data().user_type);
        if(doc.data().user_type==="teacher")
        {
          document.getElementById("button").onclick = location.href =
          "/Teacher/home_page/index.html";
        }
        
      }
      ,err=>
        {
          loginError.style.display="block";
        });
      
    }
  });
});

//listen for auth changes

auth.onAuthStateChanged((user)=>
{
  if(user)
  {
    console.log(user);
  }
})