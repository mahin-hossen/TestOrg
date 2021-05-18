const firstForm = document.querySelector("#first-form");
const secondForm = document.querySelector("#second-form");
const questions = document.querySelector("#added-question");

/* auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
  } else {
  }
});
 */
let cnt = 0;
let arr = new Array();
let number;

function renderQuestion(doc, ref) {
  console.log("rendered");
  let li = document.createElement("li");
  let question = document.createElement("span");
  let a = document.createElement("span");
  let b = document.createElement("span");
  let c = document.createElement("span");
  let d = document.createElement("span");
  let ans = document.createElement("span");
  let cross = document.createElement("div");

  // li.setAttribute("data-id", doc.id);
  li.setAttribute("id", `a` + doc.id);

  question.textContent = doc.data().question;
  a.textContent = `Option-1 : ` + doc.data().a;
  b.textContent = `Option-2 : ` + doc.data().b;
  c.textContent = `Option-3 : ` + doc.data().c;
  d.textContent = `Option-4 : ` + doc.data().d;
  ans.textContent = `Answer : ` + doc.data().ans;
  cross.textContent = "x";

  li.appendChild(question);
  li.appendChild(a);
  li.appendChild(b);
  li.appendChild(c);
  li.appendChild(d);
  li.appendChild(ans);
  li.appendChild(cross);

  questions.appendChild(li);

  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    // let id = e.target.parentElement.getAttribute("id");
    let id = e.target.parentElement.getAttribute("id");
    id = id.substring(1);
    // console.log(id);
    // let id = e.target.parentElement.getAttribute("data-id");
    arr.push(id);
    db.collection("examrooms")
      .doc(ref)
      .collection("questions")
      .doc(id)
      .delete();
  });
}


firstForm.addEventListener("submit", (e) => {
  e.preventDefault();
  secondForm.style.display = "block";
  firstForm.style.display = "none";

  db.collection("examrooms")
    .add({
      course_teacher: firstForm["course-name"].value,
      course_name: firstForm["course-teacher"].value,
      exam_date: firstForm["exam-date"].value,
      start_time: firstForm["start-time"].value,
      end_time: firstForm["ending-time"].value,
      user: auth.currentUser.uid,
    })
    .then((docRef) => {
      secondForm.addEventListener("submit", (e) => {
        if(arr.length==0) cnt++,number=cnt;
        else
        {
          number = arr.pop();
        }
        e.preventDefault();
        db.collection("examrooms")
          .doc(docRef.id)
          .collection("questions")
          .doc(`${number}`)
          .set({
            question: secondForm["question"].value,
            a: secondForm["Option_1"].value,
            b: secondForm["Option_2"].value,
            c: secondForm["Option_3"].value,
            d: secondForm["Option_4"].value,
            ans: secondForm["ans"].value,
          });
        secondForm.reset();
      });

      db.collection("examrooms")
        .doc(docRef.id)
        .collection("questions")
        .onSnapshot((snapshot) => {
          let changes = snapshot.docChanges();
          changes.forEach((change) => {
            const ref = docRef.id;
            if (change.type == "added") renderQuestion(change.doc, ref);
            else if (change.type == "removed") {
              console.log(change.doc.id);

              // let li = questions.querySelector(`[data-id=`+"${change.doc.id}"+ `]`);
              let li = questions.querySelector(
                "[id=" + `a` + change.doc.id + "]"
              );
              questions.removeChild(li);
            }
          });
        });

      // firstForm.reset();
    });
});

// /*********************************realtime******************************/
/* db.collection("examrooms")
  .doc(docRef.id)
  .collection("questions")
  .onSnapShot((snapshot) => {
    let changes = snapshot.docChanges();

  });
 */
// console.log(currID);
/* 
secondForm.addEventListener("submit",(e)=>
{
    e.preventDefault();
    db.collections("examrooms").add(
        {
            
        }
    )
}) */
