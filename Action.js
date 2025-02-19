//// Mood Chosing Functionality ////
// All Ayat Array
let AyatArray = [];
async function fetchAyat() {
  try {
    let response = await fetch("ayat.json");
    AyatArray = await response.json();
  } catch (error) {
    console.error("Error fetching Ayat:", error);
  }
}

window.onload = async function () {
  /// Contact Form ///
  let contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", Contactfunc);
  }
  /// Scroll Function ///

  let Scroll = document.getElementById("started");
  if (Scroll) {
    Scroll.addEventListener("click", function () {
      window.scrollTo({ top: 700, behavior: "smooth" });
    });
  }
  await fetchAyat();
};


// mood : mood ke andr wo category hey jo user ne select ke hey

let getAyatByMood = (mood, transafter = false) => {
  //  porey ayat ke dataset ko filter kr ke wohi ayat ke category return kare ga jo user ne select ke hey
  let filteredAyat = AyatArray.filter((ayat) => ayat.category === mood);
  // error agar ayat ke category na mily
  if (filteredAyat.length === 0) {
    console.warn(`No Ayat found for mood: ${mood}`);
    return;
  }
  //  aik random number generate krta hey
  let randomIndex = Math.floor(Math.random() * filteredAyat.length);

  // jo selected category hey os me random ayat display krta hey
  let Ayat = filteredAyat[randomIndex];

  // yaha display hoti hey
  let Ayatbox = document.getElementById("ayat-box");

  // ye ayat ka display box hey
  Ayatbox.innerHTML = ` <div class="d-flex justify-content-end mb-3">
  <div class="skeleton skeleton-box"></div>
</div>

<!-- Ayah Info -->
<div class="d-flex justify-content-center align-items-center gap-2">
  <div class="skeleton skeleton-text" style="width: 50px;"></div>
  <div class="skeleton skeleton-text" style="width: 80px;"></div>
</div>

<!-- Ayah Text -->
<div class="skeleton skeleton-text" style="height: 40px; width: 90%;"></div>

<!-- Translation -->
<div class="skeleton skeleton-text" style="height: 20px; width: 95%;"></div>
<div class="skeleton skeleton-text" style="height: 20px; width: 90%;"></div>

<!-- Buttons -->
<div class="mt-4">
  <div class="skeleton skeleton-button"></div>
</div>`;
  setTimeout(() => {
    Ayatbox.innerHTML = ` <div class="d-flex justify-content-end mb-3">
    <select id="translate-option"  class="form-select w-auto cursor fw-bold text-success border-2 shadow-sm">
    <option hidden disabled selected >Translate</option> 
      <option value="English">English</option>
      <option value="Urdu">Urdu</option>
    </select>
  </div>
  

  <!-- Ayah Info -->
  <div class="d-flex justify-content-center align-items-center gap-2">
    <p class="fs-4 fw-bold text-success mb-0">${Ayat.para}</p>
    <p class="fs-5 fw-semibold text-success mb-0">${Ayat.surah}</p>
  </div>

  <!-- Ayah Text -->
  <p class="ayat-show fs-2 fw-bold text-dark text-center mt-3">
    ${Ayat.ayat}
  </p>

  <!-- Translation -->
  <p class="translation fs-4 fw-semibold text-secondary mt-3 text-justify">
    ${transafter ? Ayat.translation_eng : Ayat.translation_urdu}
  </p>

  <!-- Buttons -->
  <div class="mt-4 " >
    <button id="nextayat"  class=" btn btn-lg px-4 py-2 fw-bold shadow-sm w-100 mb-2" style="background: linear-gradient(to right, #4b0082, #9370db); border: none; border-radius: 10px;">
      New Ayah
    </button>
   
  </div>`;

    // next ayat generate krta hey
    document.getElementById("nextayat").addEventListener("click", function () {
      getAyatByMood(mood, transafter);
    });
      /// Dynamic Selection for Select element
    let translateDropdown = document.getElementById("translate-option");
    translateDropdown.addEventListener("change", function () {
      // dynamic translation place
      let translationElement = document.querySelector(".translation");
      // agr transafter true hota hey to function ke Parameter me true chala jaye ga  or ayt translate hojaye ge
      transafter = this.value === "English";
      translationElement.innerHTML = transafter
        ? Ayat.translation_eng
        : Ayat.translation_urdu;
    });
  }, 1000);
  document
    .getElementById("targetSection")
    .scrollIntoView({ behavior: "smooth" });
};
//  jo bhi user mood select krta hey ose html ke attrribute se utha kr getayatbymood ke function k o bhejta hey
document.querySelectorAll(".mood-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    let mood = this.getAttribute("data-mood");
    getAyatByMood(mood);
  });
});

// async function fetchtranslate() {
//   let data = await fetch("https://mp3quran.net/api/_english.php");
//   let response = await data.json();
//   console.log(response);
// }
// fetchtranslate();
// console.log("fetch api done");

//// contact us ///

function Contactfunc(e) {
  e.preventDefault(); // Form submit hone se roko

  let isValid = true;

  // Get Input Values
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let subject = document.getElementById("subject").value.trim();
  let message = document.getElementById("message").value.trim();

  // Get Error Message Elements
  let errorName = document.getElementById("error-name");
  let errorEmail = document.getElementById("error-email");
  let errorSubject = document.getElementById("error-subject");
  let errorMessage = document.getElementById("error-textarea");

  // Reset Error Messages
  errorName.textContent = "";
  errorEmail.textContent = "";
  errorSubject.textContent = "";
  errorMessage.textContent = "";

  // Validation Checks
  if (!name) {
    errorName.textContent = "Please enter your name";
    isValid = false;
  }
  if (!email) {
    errorEmail.textContent = "Please enter your email";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errorEmail.textContent = "Enter a valid email address";
    isValid = false;
  }
  if (!subject) {
    errorSubject.textContent = "Please enter a subject";
    isValid = false;
  }
  if (!message) {
    errorMessage.textContent = "Please enter your message";
    isValid = false;
  }

  // If All Fields Are Valid
  if (isValid) {
    alert("THANK YOU! Your message has been sent successfully.");

    // Form Reset
    document.getElementById("contact-form").reset();

    // Small delay before redirect
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1000);
  }
}
//  Toggle function Universe.io   /////
const toggleSwitch = document.getElementById("input");
const currentTheme = localStorage.getItem("theme") || "light";

// Set initial theme
document.documentElement.setAttribute("data-theme", currentTheme);
toggleSwitch.checked = currentTheme === "dark";

// Toggle theme on switch change
toggleSwitch.addEventListener("change", () => {
  let theme = toggleSwitch.checked ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});
