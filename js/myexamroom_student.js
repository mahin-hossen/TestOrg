const container = document.querySelector(".container");
const noRoom = document.querySelector(".noroom");
const exam = document.querySelector("#exam");
// const attend = document.querySelector("#attend");

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

function temp(template) {
  container.innerHTML += template;
  const attend = document.querySelector(".attend");
  // console.log(doc.id);
  console.log("hello 24");
  attend.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("hello 26");
    console.log(e);
    console.log(e.id);
    // console.log(doc(e.id).data());
    // console.log(doc.id);
    // container.style.display = "none";
    // exam.style.display = "block";

    // e.preventDefault();

    // console.log("done");
    // countdown();

    // setInterval(countdown, 1000);
  });
}

const getrooms = async () => {
  const data = await db
    .collection("usersinfo")
    .doc(auth.currentUser.uid)
    .collection("myrooms")
    .get();

  //output docs
  let template = "";

  data.docs.forEach((doc) => {
    console.log(doc.id);
    console.log(doc.data());

    /* const ref = await db.collection("examrooms").doc(doc.id).get();
    console.log(ref.id);
    console.log(ref.data()); */
    db.collection("examrooms")
      .doc(doc.id)
      .get()
      .then((e) => {
        console.log("done");
        const review = e.data();
        template += `
        <div class="room">
          <li>
            <h2>${review.course_name}</h2>
            <p>Course Teacher : ${review.course_teacher}</p>
          </li>
          <li>
            <p>Exam Date : ${review.exam_date}</p>
            <p>Room Created : ${doc.data().created}</p>
          </li>
          <li>
            <form action="">
              <button class="button" type="submit">See Result</button>
            </form>
          </li>
          <li>
            <form action="" class="attend">
              <button class="button" >Attend Exam</button>
            </form>
          </li>
          </div>`;
      });
      
      console.log("second?");    
      console.log(template);    
      
  });
  console.log("success");
  container.innerHTML = template;
};

// window.addEventListener("DOMContentLoaded", () => getrooms());
/* const countdown = () => {
  const countDate = new Date("May 24, 2021 16:12:00").getTime();
  console.log(countdown);
  const now = new Date().getTime();
  console.log(now);
  const gap = countDate - now;

  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (gap <= 0) return;

  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day) / hour);
  const textMinute = Math.floor((gap % hour) / minute);
  const textSecond = Math.floor((gap % minute) / second);

  document.querySelector(".day").innerText = textDay;
  document.querySelector(".hour").innerText = textHour;
  document.querySelector(".minute").innerText = textMinute;
  document.querySelector(".second").innerText = textSecond;
}; */

/*************************save***************************/
// const getrooms = async () => {
//   7;
//   const data = await db
//     .collection("usersinfo")
//     .doc(auth.currentUser.uid)
//     .collection("myrooms")
//     .get();

//   //output docs
//   let template = "";
//   let cnt = 0;

//   data.docs.forEach((doc, index, arr) => {
//     console.log(doc.data());
//     db.collection("examrooms")
//       .doc(doc.id)
//       .get()
//       .then((e) => {
//         const review = e.data();
//         template += `
//         <div class="room">
//           <li>
//             <h2>${review.course_name}</h2>
//             <p>Course Teacher : ${review.course_teacher}</p>
//           </li>
//           <li>
//             <p>Exam Date : ${review.exam_date}</p>
//             <p>Room Created : ${doc.data().created}</p>
//           </li>
//           <li>
//             <form action="">
//               <button class="button" type="submit">See Result</button>
//             </form>
//           </li>
//           <li>
//             <form action="" class="attend">
//               <button class="button" >Attend Exam</button>
//             </form>
//           </li>
//           </div>

//         `;
//        /*  console.log("first");
//         cnt++;
//         if (cnt === arr.length) {
//           console.log("all done");
//           temp(template);
//         } */
//       })
//       .then(() => {
//         // console.log(template);
//         // container.innerHTML = template;
//         /* console.log(doc.id);
//         const attend = document.querySelector(".attend");
//         // console.log(doc.id);
//         console.log("hello 24");
//         attend.addEventListener("submit", (e) => {
//           e.preventDefault();
//           console.log("hello 26");
//           console.log(e);
//           console.log(e.id);
//           // console.log(doc(e.id).data());
//           // console.log(doc.id);
//           // container.style.display = "none";
//           // exam.style.display = "block";

//           // e.preventDefault();

//           // console.log("done");
//           // countdown();

//           // setInterval(countdown, 1000);
//         }); */

//         // const room = document.querySelector(".room");
//       });
//     // .then(()=>

//     /* console.log(doc.id);

//   })
//   /* .then(()=>
//   {
//     {
//       const attend = document.querySelector(".attend");
//       attend.addEventListener("submit",(t)=>
//       {
//         t.preventDefault();
//         console.log("second");
//         console.log(doc.id)
//       })
//     });
//   }); */

//     //   console.log(template);
//     // container.innerHTML += template;
//     //   console.log("hello");
//   })
//   container.innerHTML += template;

// };
// const countdown = () => {
//   const countDate = new Date("May 24, 2021 16:12:00").getTime();
//   console.log(countdown);
//   const now = new Date().getTime();
//   console.log(now);
//   const gap = countDate - now;

//   const second = 1000;
//   const minute = 60 * second;
//   const hour = 60 * minute;
//   const day = 24 * hour;
//   if (gap <= 0) return;

//   const textDay = Math.floor(gap / day);
//   const textHour = Math.floor((gap % day) / hour);
//   const textMinute = Math.floor((gap % hour) / minute);
//   const textSecond = Math.floor((gap % minute) / second);

//   document.querySelector(".day").innerText = textDay;
//   document.querySelector(".hour").innerText = textHour;
//   document.querySelector(".minute").innerText = textMinute;
//   document.querySelector(".second").innerText = textSecond;
// };
