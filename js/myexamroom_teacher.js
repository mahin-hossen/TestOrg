const container = document.querySelector(".container");
const noRoom = document.querySelector(".noroom");

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

const getrooms = async () => {
  const data = await db
    .collection("usersinfo")
    .doc(auth.currentUser.uid)
    .collection("myrooms")
    .get();

  //output docs
  let template = "";

  data.docs.forEach((doc) => {
    
    db.collection("examrooms")
      .doc(doc.id)
      .get()
      .then((e) => {
        
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
              <button class="button">See Result</button>
            </form>
          </li>
          
          </div>
        
        `;
        
      })
      .then((e) => {
          console.log(template);
        container.innerHTML = template;
      });
      
  });
//   console.log(template);
//   container.innerHTML += template;
//   console.log("hello");
};
