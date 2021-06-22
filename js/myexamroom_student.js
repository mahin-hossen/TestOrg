const container = document.querySelector(".container");
const noRoom = document.querySelector(".noroom");
const exam = document.querySelector("#exam");
const roomList = document.querySelector("#room_list");
const renderPart = document.querySelector("#render-part");
const renderForm = document.querySelector("#renderForm");

const option1 = document.querySelector("#option1");
const option2 = document.querySelector("#option2");
const option3 = document.querySelector("#option3");
const option4 = document.querySelector("#option4");
const next = document.querySelector("#next");
const q = document.querySelector("#question");
const ans1 = document.querySelector("#ans1");
const ans2 = document.querySelector("#ans2");
const ans3 = document.querySelector("#ans3");
const ans4 = document.querySelector("#ans4");

const goBack = document.getElementById("go_back");


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

function renderRoom(review, doc) {
  const t = "room";
  const t2 = "button";

  console.log(doc.id);
  console.log(review.id);

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
  let attend = document.createElement("button");

  div.setAttribute("data-id", doc.id);
  div.setAttribute("class", t);
  result.setAttribute("class", t2);
  attend.setAttribute("class", t2);

  name.textContent = review.data().course_name;
  teacher.textContent = `Course Teacher : ` + review.data().course_teacher;
  examDate.textContent = `Exam Date : ` + review.data().exam_date;
  roomCreated.textContent = `Room-Created : ` + review.data().created;
  result.textContent = "See Result";
  attend.textContent = "Attend Exam";

  firstLi.appendChild(name);
  firstLi.appendChild(teacher);

  secLi.appendChild(examDate);
  secLi.appendChild(roomCreated);

  thirdLi.appendChild(result);
  fourthLi.appendChild(attend);

  div.appendChild(firstLi);
  div.appendChild(secLi);
  div.appendChild(thirdLi);
  div.appendChild(fourthLi);

  roomList.appendChild(div);

  attend.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(id);
    container.style.display = "none";

    let startTime = getInGlobalFormat(
      review.data().exam_date,
      review.data().start_time
    );
    let endTime = getInGlobalFormat(
      review.data().exam_date,
      review.data().end_time
    );

    startTime = new Date(startTime).getTime();
    endTime = new Date(endTime).getTime();
    const currentTime = getCurrentTime();

    console.log(currentTime);
    console.log(startTime);
      attend:
      {
        
      }
    if (startTime > currentTime) {
      waitingFunction(startTime, currentTime, endTime, review);
      // countdown(startTime - currentTime, 0);
    } else if (currentTime >= startTime && currentTime <= endTime) {
      runningFunction(endTime - currentTime, review);
    } else {
      ("time has passed");
    }
  });
}
goBack.addEventListener("click",(e)=>
{
  e.preventDefault();
  console.log("pressed");
  goBack.onclick = location.href = "../my_exam_room/index.html";
  
})
waitingFunction = (startTime, currentTime, endTime, review) => {
  console.log(`end time : ${endTime}`);
  countdown(startTime - currentTime, 0);
  console.log("waiting");
  
 
  //  .then(()=>
  // {
  //   console.log("back");
  //   runningFunction(endTime - currentTime, review);
  // })
};
runningFunction = (time, review) => {
  console.log("inside running");
  countdown(time, 1);
  runningExam(review);
};
renderQuestion = async (qID, roomID) => {
  const timeout = async (ms) => new Promise((res) => setTimeout(res, ms));
  let userClicked = false;

  q.innerHTML = qID.data().question;
  ans1.innerHTML = qID.data().a;
  ans2.innerHTML = qID.data().b;
  ans3.innerHTML = qID.data().c;
  ans4.innerHTML = qID.data().d;
  next.addEventListener("click", (e) => {
    userClicked = true;
    e.preventDefault();
    console.log("done");
  });

  while (userClicked === false) await timeout(50);
};

runningExam = async (review) => {
  const totalQ = review.data().total_questions;
  let arr = [];
  for (let i = 0; i <= totalQ; i++) {
    arr.push(false);
  }
  let n = totalQ;

  while (n) {
    let randomNumber = getRandom(totalQ);
    if (!arr[randomNumber]) {
      arr[randomNumber] = true;
      await db
        .collection("examrooms")
        .doc(review.id)
        .collection("questions")
        .where("serial", "==", randomNumber)
        .get()
        .then(async (snapshot) => {
          for (let doc of snapshot.docs) {
            await renderQuestion(doc, review);
          }
        });
      n--;
    }
  }
};

getRandom = (number) => {
  let temp;
  do {
    temp = Math.floor(Math.random() * (number + 1));
  } while (temp == 0);

  return temp;
};

buttonPressed = () => {
  next.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("done");
  });
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

    renderRoom(review, doc);
  });
};
getCurrentTime = () => {
  return new Date().getTime();
};

getInGlobalFormat = (date, time) => {
  console.log(time);
  console.log(date);
  return `${date} ${time}`;
};

countdown = (gap, flag) => {
  console.log(gap);
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  setInterval(() => {
    console.log(gap);
    console.log("set interval");
    gap -= 1000;

    if (gap <= 0 && flag==0)
    {
      goBack.style.display="block";
      return;
    } 

    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    if (flag == 1) {
      ///running_exam
      document.querySelector("#running_day").innerText = textDay;
      document.querySelector("#running_hour").innerText = textHour;
      document.querySelector("#running_minute").innerText = textMinute;
      document.querySelector("#running_second").innerText = textSecond;
    } ///waiting
    else {
      document.querySelector("#waiting_day").innerText = textDay;
      document.querySelector("#waiting_hour").innerText = textHour;
      document.querySelector("#waiting_minute").innerText = textMinute;
      document.querySelector("#waiting_second").innerText = textSecond;
    }
  }, 1000);

  console.log("countdown last");
};

/********************************************************************/
