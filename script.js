const sr = ScrollReveal({
  origin: "left",
  distance: "80px",
  duration: 2000,
  reset: true,
});


sr.reveal(".contact_input", { interval: 200 });
sr.reveal(".login_input", { interval: 200 });
sr.reveal(".why_us", { interval: 200 });
sr.reveal(".will_go_right", { interval: 200 });

const st_top = ScrollReveal({
    origin: "top",
    distance: "80px",
    duration: 2000,
    reset: true,
  });
  
st_top.reveal(".create_acc_input", { interval: 200 });


const st_right = ScrollReveal({
  origin: "right",
  distance: "80px",
  duration: 2000,
  reset: true,
});

 st_right.reveal(".will_go_left", { interval: 200 });

 const fading = ScrollReveal({
  origin: "top",
  distance: "10px",
  duration: 2000,
  reset: true,
});

fading.reveal(".first_page", { interval: 500 });