auth.onAuthStateChanged((user) => {
  if (user) {
    const currUser = db.collection("usersinfo").doc(auth.currentUser.uid);
    currUser.get().then((doc) => {
      console.log(doc);
      console.log(doc.data());
      console.log(doc.data().user_type);
      if (doc.data().user_type === "student") {
        findRoom(doc);
      } else console.log("hello");
    });
  } else {
    console.log(`hello`);
  }
});

findRoom = (doc) => {
  console.log(doc.id);
  const roomForm = document.querySelector("#roomForm");
  const join = document.querySelector("#join");
  const joinSection = document.querySelector("#join-sec");
  const success = document.querySelector("#success");
  const fail = document.querySelector("#fail");

  join.addEventListener("click", (e) => {
    e.preventDefault();

    const id = roomForm["room-id"].value;
    const ref = db.collection("examrooms").doc(id);
    ref.get().then((room) => {
      if (room.exists) {
        joinSection.style.display = "none";
        success.style.display = "block";
        db.collection("examrooms")
          .doc(id)
          .collection("students")
          .doc(doc.id)
          .set({});

        db.collection("usersinfo")
          .doc(auth.currentUser.uid)
          .collection("myrooms")
          .doc(id)
          .set({});

          const user = db.collection("usersinfo").doc(auth.currentUser.uid);
            user.get().then((e) => {
              user.set(
                {
                  totalrooms: e.data().totalrooms + 1,
                },
                { merge: true }
              );
            });
      } else {
        joinSection.style.display = "none";
        fail.style.display = "block";
      }
    });
  });
  // console.log(roomID);
};
