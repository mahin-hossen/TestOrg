const firstForm = document.querySelector("#first-form");
const secondForm = document.querySelector("#second-form");
const thirdForm = document.querySelector("#third-form");
const questions = document.querySelector("#added-question");
const timeError = document.querySelector("#time_error");
const room_id = document.querySelector(".room_id");
const firstPart = document.querySelector("#first-part");
const secPart = document.querySelector("#sec_part");
const lastVis = document.querySelector(".last_visible");
const minQues = document.querySelector("#minimum_question");
/****************************Render-Question*************************/
let cnt = 0;
let arr = new Array();
let number = 0;
let roomID;
let test;

function renderQuestion(doc, ref) {
  let li = document.createElement("li");
  let question = document.createElement("span");
  let a = document.createElement("span");
  let b = document.createElement("span");
  let c = document.createElement("span");
  let d = document.createElement("span");
  let ans = document.createElement("span");
  let cross = document.createElement("div");

  // li.setAttribute("data-id", doc.id);
  li.setAttribute("data-id", `a` + doc.id);

  question.textContent = `Question : ` + doc.data().question;
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
    let id = e.target.parentElement.getAttribute("data-id");
    id = id.substring(1);
    // console.log(id);
    // let id = e.target.parentElement.getAttribute("data-id");
    // arr.push(id);

    db.collection("examrooms")
      .doc(ref)
      .collection("questions")
      .doc(id)
      .delete();
  });
}
/**************************check date and time****************************/

// var dd = String(today.getDate()).padStart(2, '0');

const currTime = new Date();
let day = currTime.getDate();
let month = currTime.getMonth() + 1;
let year = currTime.getFullYear();
if (day < 10) day = `0` + day;
if (month < 10) month = `0` + month;
let final_date = `${year}-${month}-${day}`;
const time = currTime.toTimeString();
let final_time = time.slice(0, 5);

/**********************************save data***************************/

firstForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (firstForm["exam-date"].value < final_date) {
    timeError.style.display = "block";
  } else if (
    firstForm["exam-date"].value == final_date &&
    firstForm["start-time"].value <= final_time
  ) {
    timeError.style.display = "block";
  } else {
    secondForm.style.display = "block";
    thirdForm.style.display = "block";
    firstForm.style.display = "none";

    db.collection("examrooms")
      .add({
        course_teacher: firstForm["course-teacher"].value,
        course_name: firstForm["course-name"].value,
        exam_date: firstForm["exam-date"].value,
        start_time: firstForm["start-time"].value,
        end_time: firstForm["ending-time"].value,
        user: auth.currentUser.uid,
        completed: 0,
      })
      .then((docRef) => {
        secondForm.addEventListener("submit", (e) => {
          e.preventDefault();
          minQues.style.display = "none";
          db.collection("examrooms")
            .doc(docRef.id)
            .collection("questions")
            .add({
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
              if (change.type == "added")
                number++, renderQuestion(change.doc, ref);
              else if (change.type == "removed") {
                number--;
                // console.log(change.doc.id);

                // let li = questions.querySelector(`[data-id=`+"${change.doc.id}"+ `]`);
                let li = questions.querySelector(
                  "[data-id=" + `a` + change.doc.id + "]"
                );
                questions.removeChild(li);
              }
            });
          });

        thirdForm.addEventListener("submit", (e) => {
          e.preventDefault();

          if (number == 0) {
            minQues.style.display = "block";
          } else {
            ///saving doc id(examrooms) in myrooms
            db.collection("usersinfo")
              .doc(auth.currentUser.uid)
              .collection("myrooms")
              .doc(docRef.id)
              .set({
                created: final_date,
              });

            ///giving questions serial no.
            docRef
              .collection("questions")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.update({
                    serial: number--,
                  });
                });
              });

            ///giving room completed mark
            docRef.set(
              {
                total_questions: number,
                completed: 1,
                created: final_date,
                classlink: docRef.id,
              },
              {
                merge: true,
              }
            );

            /****************changing Total_rooms value**************** */

            const user = db.collection("usersinfo").doc(auth.currentUser.uid);
            user.get().then((doc) => {
              user.set(
                {
                  totalrooms: doc.data().totalrooms + 1,
                },
                { merge: true }
              );
            });

            // lastInv.style.display = "none";
            firstPart.style.display = "none";
            secPart.style.display = "none";
            lastVis.style.display = "block";
            room_id.innerHTML = docRef.id;
          }
        });

        // firstForm.reset();
      });
  }
});
