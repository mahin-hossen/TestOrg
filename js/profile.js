const name = document.querySelector("#name");
const university = document.querySelector("#university");
const department = document.querySelector("#department");
const semester = document.querySelector("#semester");
const email = document.querySelector("#email");
const birthday = document.querySelector("#birthday");
const cgpa = document.querySelector("#cgpa");
const edit = document.querySelector(".edit");
const profile = document.querySelector(".profile");
const addForm = document.querySelector("#addForm");
const add = document.querySelector("#add");
const save = document.querySelector("#save_button");

const showUniversity = document.querySelector("#show_university");
const showDepartment = document.querySelector("#show_department");
const showSemester = document.querySelector("#show_semester");
const showBirthday = document.querySelector("#show_birthday");
const showCgpa = document.querySelector("#show_cgpa");
const lost = document.querySelector("#lost");
const all = document.querySelector("#all");
auth.onAuthStateChanged((user) => {

  if (user) {
    if(user.emailVerified)
    {
      setProfile();
    }
    else
    {
      all.style.display = "none";
      lost.style.display = "block";
    }
    // const currUser = db.collection("usersinfo").doc(auth.currentUser.uid);
    
  } else {
    all.style.display="none";
    lost.style.display = "block";
    console.log("dont access");
    console.log(`hello`);
  }
});

setProfile = async () => {
  const currUser = await db
    .collection("usersinfo")
    .doc(auth.currentUser.uid)
    .get();

  window.currUser = currUser;

  document.querySelector(".profile").style.display = "block";

  name.textContent = currUser.data().username;
  email.textContent = currUser.data().email;

  console.log(showUniversity);

  if (currUser.data().university) {
    showUniversity.style.display = "block";
    university.textContent = currUser.data().university;
  }
  if (currUser.data().department) {
    showDepartment.style.display = "block";
    department.textContent = currUser.data().department;
  }
  if (currUser.data().semester) {
    showSemester.style.display = "block";
    semester.textContent = currUser.data().semester;
  }
  if (currUser.data().cgpa) {
    showCgpa.style.display = "block";
    cgpa.textContent = currUser.data().cgpa;
  }
  if (currUser.data().birthday) {
    showBirthday.style.display = "block";
    birthday.textContent = currUser.data().birthday;
  }
};

edit.addEventListener("click", (e) => {
  e.preventDefault();
  profile.style.display = "none";
  add.style.display = "block";
  addForm["username"].value = currUser.data().username;
  if (currUser.data().university)
    addForm["university"].value = currUser.data().university;
  if (currUser.data().department)
    addForm["department"].value = currUser.data().department;
  if (currUser.data().semester)
    addForm["semester"].value = currUser.data().semester;
  if (currUser.data().cgpa) addForm["cgpa"].value = currUser.data().cgpa;
  if (currUser.data().birthday)
    addForm["birthday"].value = currUser.data().birthday;
});

save.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = addForm["username"].value;
  const university = addForm["university"].value;
  const department = addForm["department"].value;
  const semester = addForm["semester"].value;
  const cgpa = addForm["cgpa"].value;
  const birthday = addForm["birthday"].value;

  await db.collection("usersinfo").doc(auth.currentUser.uid).set(
    {
      username: username,
      university: university,
      department: department,
      semester: semester,
      cgpa: cgpa,
      birthday: birthday,
    },
    {
      merge: true,
    }
  );
  save.onclick = location.href = "../profile/index.html";
});
