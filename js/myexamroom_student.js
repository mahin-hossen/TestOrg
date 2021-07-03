const container = document.querySelector(".container");
const noRoom = document.querySelector("#noroom");
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
const goBackTwo = document.getElementById("go_back_2");
const goBackThree = document.getElementById("go_back_3");
const waitingHidden = document.getElementById("waiting_hidden");

const waitingPart = document.querySelector(".waiting");
const runningPart = document.querySelector("#exam_running");
const finishedPart = document.querySelector(".exam_finished");
const message = document.querySelector("#message");

const renderDiv = document.querySelector("#render");

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

  attend.addEventListener("click", async (e) => {
    e.stopPropagation();
    const participation = await db
      .collection("examrooms")
      .doc(review.id)
      .collection("students")
      .doc(auth.currentUser.uid)
      .get();

    // console.log(participation.data().participated);
    if (participation.data().participated === 1) {
      document.querySelector(
        "#message1"
      ).innerHTML = `You have already participated in this exam...`;

      container.style.display = "none";
      message.style.display = "block";
    } else {
      let id = e.target.parentElement.parentElement.getAttribute("data-id");
      console.log(id);
      container.style.display = "none";
      /*  let d = new Date();
      let x = review.data().exam_date;
      console.log(d);
      console.log(d.getTime());
      
      console.log(x);
      let ret = parseDate(x);
      console.log(ret); */
      // console.log(x.getTime());
      // if(d===x) console.log("yes");

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

      if (startTime > endTime) endTime += 86400000;

      const currentTime = getCurrentTime();
      console.log(currentTime);
      console.log(startTime);
      console.log(endTime);

      if (startTime > currentTime) {
        waitingFunction(startTime, currentTime, endTime, review);
        // countdown(startTime - currentTime, 0);
      } else if (currentTime >= startTime && currentTime <= endTime) {
        runningFunction(endTime - currentTime, review);
      } else {
        finishedFunction();
      }
    }
  });

  result.addEventListener("click", async (e) => {
    const st = await db
      .collection("examrooms")
      .doc(review.id)
      .collection("students")
      .doc(auth.currentUser.uid)
      .get();

    if (st.data().participated === 0) {
      document.querySelector(
        "#message1"
      ).innerHTML = `You haven't participated in this exam...`;

      container.style.display = "none";
      message.style.display = "block";
    } else {
      let endTime = getInGlobalFormat(
        review.data().exam_date,
        review.data().end_time
      );
      endTime = new Date(endTime).getTime() ;
      const currentTime = getCurrentTime();
      endTime+=60000;

      console.log(endTime);
      // console.log(endTime+60000);
      console.log(currentTime);

      if (currentTime <= endTime) {
        document.querySelector(
          "#message1"
        ).innerHTML = `You have to wait till the exam is finished ...`;
  
        container.style.display = "none";
        message.style.display = "block";
      } else {
        document.querySelector(".top_section").style.display = "block";
        container.style.display = "none";

        document.querySelector("#course_name").innerHTML =
          `Course Name : ` + review.data().course_name;
        document.querySelector("#exam_date").innerHTML =
          `Exam Date : ` + review.data().exam_date;
        document.querySelector("#finalResult").innerHTML =
          `Your Score : ` + st.data().totalResult;
        document.querySelector("#answered").innerHTML =
          `Your Answered : ` +
          st.data().totalAnswered +
          `/` +
          review.data().total_questions;

        const studentResult = await db
          .collection("examrooms")
          .doc(review.id)
          .collection("students")
          .doc(auth.currentUser.uid)
          .collection("result")
          .get();

        studentResult.docs.forEach(async (doc) => {
          const detailedResult = await db
            .collection("examrooms")
            .doc(review.id)
            .collection("students")
            .doc(auth.currentUser.uid)
            .collection("result")
            .doc(doc.id)
            .get();
          console.log(detailedResult);
          console.log(detailedResult.data());

          renderResult(detailedResult);
        });
      }
    }
  });
}
/* function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
} */
renderResult = (resultID) => {
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

  q.textContent = resultID.data().question;
  quote1.textContent = `Correct Answer : ${resultID.data().ans}`;
  quote2.textContent = `Your Answer : ${resultID.data().student}`;
  // p1.textContent = resultID.data().ans;
  // p2.textContent = resultID.data().student;

  // trow2.appendChild(p1);
  // trow2.appendChild(p2);

  trow1.appendChild(quote1);
  trow1.appendChild(quote2);

  render.appendChild(q);
  render.appendChild(trow1);
  // render.appendChild(trow2);

  renderDiv.appendChild(render);
  if (resultID.data().correct) {
    render.style.backgroundColor = "#33b998";
  } else {
    render.style.backgroundColor = "#ff8383";
  }
};
goBack.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("pressed");
  goBack.onclick = location.href = "../my_exam_room/index.html";
});
goBackTwo.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("pressed");
  goBackTwo.onclick = location.href = "../my_exam_room/index.html";
});
goBackThree.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("pressed");
  goBackThree.onclick = location.href = "../my_exam_room/index.html";
});
waitingFunction = (startTime, currentTime, endTime, review) => {
  waitingPart.style.display = "block";
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
  runningPart.style.display = "block";
  console.log("inside running");
  countdown(time, 1);
  runningExam(review);
};
finishedFunction = () => {
  console.log("finished");
  finishedPart.style.display = "block";
};

next.addEventListener("click", (e) => {
  let getSelectedValue = document.querySelector('input[name="ans"]:checked');
  renderForm.reset();
  console.log(flag2);
  totalAnswered++;
  if (!flag2) {
    db.collection("examrooms")
      .doc(roomID.id)
      .collection("students")
      .doc(auth.currentUser.uid)
      .set({
        participated: 1,
      });

    flag2 = 1;
  }
  console.log(totalAnswered);

  const ans = document.getElementById(`${getSelectedValue.value}`).textContent; ///student's ans
  let flag;
  if (ans === qID.data().ans) {
    totalResult++;
    flag = true;
  } else {
    flag = false;
  }
  // console.log(ans3.textContent);
  userClicked = true;
  e.preventDefault();

  db.collection("examrooms")
    .doc(roomID.id)
    .collection("students")
    .doc(auth.currentUser.uid)
    .collection("result")
    .doc(qID.id)
    .set(
      {
        serial: qID.data().serial,
        question: qID.data().question, ///respected question
        correct: flag, ///true/false
        ans: qID.data().ans, ///original ans
        student: document.getElementById(`${getSelectedValue.value}`)
          .textContent, ///student's ans
      },
      {
        merge: true,
      }
    );

  if (totalAnswered === totalQ) {
    examFinished = 1;
    questionFinished(1);
  }
});

renderQuestion = async (qID, roomID, ongoing, totalQ) => {
  window.examFinished = 0;

  const timeout = async (ms) => new Promise((res) => setTimeout(res, ms));
  window.userClicked = false;
  window.roomID = roomID;
  window.qID = qID;
  console.log("render");

  let arr = [ans1, ans2, ans3, ans4]; //option er array

  for (let i = arr.length - 1; i > 0; i--) {
    ////randomizing array
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  for (let i = 0; i < arr.length; i++) console.log(arr[i]);

  q.innerHTML =
    `${ongoing}/${totalQ}` + `&nbsp;&nbsp;&nbsp;&nbsp;` + qID.data().question;
  arr[0].innerHTML = qID.data().a;
  arr[1].innerHTML = qID.data().b;
  arr[2].innerHTML = qID.data().c;
  arr[3].innerHTML = qID.data().d;

  while (userClicked === false) await timeout(50);
};
questionFinished = (
  time //if time = 0 time finished //time = 1 all questions finished
) => {
  if (time === 0 && examFinished === 0) {
    document.querySelector(
      "#message1"
    ).innerHTML = `Opps!!! Provided time finished. You have Answered ${totalAnswered}/${totalQ}  Questions.`;
  } else {
    document.querySelector(
      "#message2"
    ).innerHTML = `You have Answered ${totalAnswered}/${totalQ} Questions. Best of Luck ...`;
  }
  runningPart.style.display = "none";
  message.style.display = "block";

  db.collection("examrooms")
    .doc(roomID.id)
    .collection("students")
    .doc(auth.currentUser.uid)
    .set({
      totalAnswered: totalAnswered,
      totalResult: totalResult,
      participated: 1,
    });
};
runningExam = async (review) => {
  window.totalQ = review.data().total_questions; //totalQ = total question
  // const totalQ = review.data().total_questions; //totalQ = total question
  window.totalAnswered = 0;
  window.totalResult = 0;
  window.flag2 = 0;

  let arr = [];
  for (let i = 0; i <= totalQ; i++) {
    arr.push(false);
  }
  let n = totalQ;

  window.ongoing = 0;
  // let ongoing = 0;
  while (n) {
    let randomNumber = getRandom(totalQ);
    if (!arr[randomNumber]) {
      ongoing++;
      arr[randomNumber] = true;
      await db
        .collection("examrooms")
        .doc(review.id)
        .collection("questions")
        .where("serial", "==", randomNumber)
        .get()
        .then(async (snapshot) => {
          for (let doc of snapshot.docs) {
            console.log("runningexam");
            await renderQuestion(doc, review, ongoing, totalQ);
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
    // console.log(gap);
    // console.log("set interval");
    gap -= 1000;

    if (gap <= 0 && flag == 0) {
      ///flag==0 means waiting
      waitingHidden.style.display = "block";
      return;
    } else if (gap <= 0 && flag == 1) {
      questionFinished(0);
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
