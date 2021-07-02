const container = document.querySelector(".container");
const noRoom = document.querySelector(".noroom");
const exam = document.querySelector("#exam");
const roomList = document.querySelector("#room_list");
const goBack = document.querySelector("#go_back");

// const details = document.querySelector("#details");

// const seeResult = document.querySelector("#")

auth.onAuthStateChanged((user) => {
  if (user) {
    const currUser = db.collection("usersinfo").doc(auth.currentUser.uid);
    currUser.get().then((doc) => {
      if (doc.data().totalrooms == 0) {
        noRoom.style.display = "block";
      } else {
        getrooms();
      }
    });
  } else {
    console.log(`hello`);
  }
});

/*************************save***************************/
// import { doc, getDoc } from "firebase/firestore";
goBack.addEventListener("click", (e) => {
  e.preventDefault();
  goBack.onclick = location.href = "../my_exam_room/index.html";
});
function renderRoom(room) {
  ///review==roomID from examroom
  ///doc == roomID from usersinfo

  const t = "room";
  const t2 = "button";

  let firstLi = document.createElement("li");
  let secLi = document.createElement("li");
  let thirdLi = document.createElement("li");
  let fourthLi = document.createElement("li");
  let div = document.createElement("div");
  let name = document.createElement("h2");
  let teacher = document.createElement("p");
  let examDate = document.createElement("p");
  let roomCreated = document.createElement("p");
  let result = document.createElement("button");
  // let attend = document.createElement("button");

  div.setAttribute("data-id", room.id); //usersinfo/myroom.id
  // div.setAttribute("data-id", doc.id);//usersinfo/myroom.id
  div.setAttribute("class", t);
  result.setAttribute("class", t2);
  // attend.setAttribute("class", t2);

  name.textContent = room.data().course_name;
  teacher.textContent = `Course Teacher : ` + room.data().course_teacher;
  examDate.textContent = `Exam Date : ` + room.data().exam_date;
  roomCreated.textContent = `Room Created : ` + room.data().created;
  result.textContent = "See Result";
  // attend.textContent = "Attend Exam";

  firstLi.appendChild(name);
  firstLi.appendChild(teacher);

  secLi.appendChild(examDate);
  secLi.appendChild(roomCreated);

  thirdLi.appendChild(result);
  // fourthLi.appendChild(attend);

  div.appendChild(firstLi);
  div.appendChild(secLi);
  div.appendChild(thirdLi);
  // div.appendChild(fourthLi);

  roomList.appendChild(div);
  // console.log(room.data().start_time);

  result.addEventListener("click", async (e) => {
    let roomID = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(roomID);
    // window.room = roomID;

    // console.log(room);
    let endTime = getInGlobalFormat(
      room.data().exam_date,
      room.data().end_time
    );
    endTime = new Date(endTime).getTime();
    const currentTime = getCurrentTime();

    if (endTime >= currentTime) {
      container.style.display = "none";
      document.querySelector(".message").style.display = "block";
      document.querySelector(
        "#message1"
      ).innerHTML = `This exam hasn't been finished yet ...`;
    } else {
      console.log("else");
      const students = await db
        .collection("examrooms")
        .doc(room.id)
        .collection("students")
        .get();
      console.log("else2");
      students.docs.forEach(async (students) => {
        renderResult(students, roomID);
      });
    }
  });
}
renderResult = async (students, roomID) => {
  console.log(students.data());
  // const students = await db.collection("examrooms").doc(roomID).collection("students").doc(students).get();
  // console.log(students);
  // console.log(students.data());
  // // console.log(students.doc(students));
  // console.log(students.doc(students.id));
  // console.log(students.id);
  const studentInfo = await db.collection("usersinfo").doc(students.id).get();
  console.log(studentInfo.data().username);
  let div = document.createElement("div");
  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let tr1 = document.createElement("tr");
  let tr2 = document.createElement("tr");
  let p1 = document.createElement("p");
  let p2 = document.createElement("p");
  let p3 = document.createElement("p");
  let details = document.createElement("button");

  div.setAttribute("id", "firstDiv");
  p1.setAttribute("id", "answered");
  p2.setAttribute("id", "score");
  details.setAttribute("id", "details");
  details.setAttribute("class", "button");
  details.setAttribute("data-id", students.id);

  tr1.appendChild(div1);
  div1.appendChild(p3);
  div2.appendChild(p1);
  div2.appendChild(p2);
  tr2.appendChild(div2);
  div.appendChild(details);
  div.appendChild(tr1);
  div.appendChild(tr2);

  document.querySelector(".renderResult").appendChild(div);
  let answer = students.data().totalAnswered;
  let score = students.data().totalResult;
  if (students.data().participated === 0)
    (answer = "Did Not Participate"), (score = "Did Not Participate");

  details.textContent = `See Details`;
  p3.textContent = `Student's Name : ${studentInfo.data().username}`;
  p1.textContent = `Total Answered : ${answer}`;
  p2.textContent = `Final Score : ${score}`;

  console.log(roomID);
  console.log(students.id);
  container.style.display = "none";

  details.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(students.data());
    if (students.data().participated === 0) {
      console.log("yes");
      document.querySelector(".renderResult").style.display = "none";
      document.querySelector(".message").style.display = "block";
      document.querySelector(
        "#message1"
      ).innerHTML = `This Student didn't participate in the exam ...`;
    } else {
      document.querySelector(".renderResult").style.display = "none";
      const studentResult = await db
        .collection("examrooms")
        .doc(roomID)
        .collection("students")
        .doc(students.id)
        .collection("result")
        .get();

      studentResult.docs.forEach(async (result) => {
        /* const detailedResult = await db
          .collection("examrooms")
          .doc(roomID)
          .collection("students")
          .doc(students.id)
          .collection("result")
          .doc(result.id)
          .get(); */

        console.log(result);
        /* console.log(detailedResult);
        console.log(result.id);          
        console.log(detailedResult.id);
        console.log(result.data());
        console.log(detailedResult.data()); */

        // renderResult(detailedResult);
        detailedResult(result);
      });
    }
  });
};

detailedResult = (result) => {


  let render = document.createElement("div");
  let trow1 = document.createElement("tr");
  // let trow2 = document.createElement("tr");
  let q = document.createElement("h1");
  let quote1 = document.createElement("p");
  let quote2 = document.createElement("p");
  // let p1 = document.createElement("p");
  // let p2 = document.createElement("p");

  render.setAttribute("class", "render_result");
  q.setAttribute("id", "question");
  quote1.setAttribute("class", "quote");
  quote2.setAttribute("class", "quote");
  // p1.setAttribute("id", "your_ans");
  // p2.setAttribute("id", "correct_ans");

  q.textContent = result.data().question;
  quote1.textContent = `Correct Answer : ${result.data().ans}`;
  quote2.textContent = `Your Answer : ${result.data().student}`;
  // p1.textContent = result.data().ans;
  // p2.textContent = result.data().student;

  // trow2.appendChild(p1);
  // trow2.appendChild(p2);

  trow1.appendChild(quote1);
  trow1.appendChild(quote2);

  render.appendChild(q);
  render.appendChild(trow1);
  // render.appendChild(trow2);

  document.querySelector(".detailedResult").appendChild(render);
  if (result.data().correct) {
    render.style.backgroundColor = "#33b998";
  } else {
    render.style.backgroundColor = "#ff8383";
  }
};

const getrooms = async () => {
  const data = await db
    .collection("usersinfo")
    .doc(auth.currentUser.uid)
    .collection("myrooms")
    .get();

  //output docs
  await data.docs.forEach(async (doc) => {
    const review = await db.collection("examrooms").doc(doc.id).get();
    // console.log(review.data().course_teacher);
    // console.log(doc.id);

    renderRoom(review);
  });
};
getInGlobalFormat = (date, time) => {
  console.log(time);
  console.log(date);
  return `${date} ${time}`;
};
getCurrentTime = () => {
  return new Date().getTime();
};
