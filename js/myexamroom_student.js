const container = document.querySelector(".container");
const noRoom = document.querySelector(".noroom");
const exam = document.querySelector("#exam");
const roomList = document.querySelector("#room_list");

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
  roomCreated.textContent = `Room Created : ` + review.data().created;
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
    // console.log(id);
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
    const display = document.querySelector("#time");

    console.log(currentTime);
    console.log(startTime);

    if (startTime > currentTime) {
      countdown(startTime-currentTime);
    } else if (currentTime >= startTime && currentTime <= endTime) {
      countdown(endTime-currentTime);
      runningExam(review);
    } else {
      ("time has passed");
    }
  });
}
runningExam = async (review) =>
{  

  let option1 = document.querySelector("#option1");
  let option2 = document.querySelector("#option2");
  let option3 = document.querySelector("#option3");
  let option4 = document.querySelector("#option4");
  let next = document.querySelector("#next");

  let q = document.querySelector("#question");
  let ans1 = document.querySelector("#ans_1");
  let ans2 = document.querySelector("#ans_2");
  let ans3 = document.querySelector("#ans_3");
  let ans4 = document.querySelector("#ans_4");

  const question = await db.collection("examrooms").doc(review.id).collection("questions").get();

  question.docs.forEach(async (doc)=>
  {
    console.log(doc.id);
    console.log(doc.data());
    q.innerText = doc.data().question;
    ans1.innerText = doc.data().a;
    ans2.innerText = doc.data().b;
    ans3.innerText = doc.data().c;
    ans4.innerText = doc.data().d;

    await next.addEventListener("submit",(e)=>
    {
      
    })

    
  })

}

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

countdown = (gap) => {

  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  setInterval(() => {
    gap -= 1000;

    if (gap <= 0) return;

    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    document.querySelector(".day").innerText = textDay;
    document.querySelector(".hour").innerText = textHour;
    document.querySelector(".minute").innerText = textMinute;
    document.querySelector(".second").innerText = textSecond;
  }, 1000);
};


