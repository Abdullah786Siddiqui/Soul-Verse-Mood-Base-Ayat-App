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
fetchAyat();

// mood : mood ke andr wo category hey jo user ne select ke hey
// DefaultTrans :abhi translate urdu hey but agr true ho to english
let getAyatByMood = (mood, DefaultTrans = false) => {
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
  // localstorage ke key(Favorite) jo already ayat localstorage me save hey
  let alredyfav = JSON.parse(localStorage.getItem("favorites")) || [];
  // heart ka colour decide kr raha hey ke red ya gray
  let heartIcon = false;

  // Check karo  ke array me koi object exist karta hai jo `Ayat.id` match kare
  if (alredyfav.some((fav) => fav.id === Ayat.id)) {
    // agar save favorite ayat ke id existing ayat jo web pr show ho rahi hey os se milte hey to heart true yani red colour show krdo
    heartIcon = true;
  }
  // Ayat ka Skeleton dekhe ga pehle
  Ayatbox.innerHTML = ` <div class="d-flex justify-content-end mb-3">
  <div class="skeleton skeleton-box"></div>
</div>
<div class="d-flex justify-content-center align-items-center gap-2">
  <div class="skeleton skeleton-text" style="width: 50px;"></div>
  <div class="skeleton skeleton-text" style="width: 80px;"></div>
</div>
<div class="skeleton skeleton-text" style="height: 40px; width: 90%;"></div>
<div class="skeleton skeleton-text" style="height: 20px; width: 95%;"></div>
<div class="skeleton skeleton-text" style="height: 20px; width: 90%;"></div>

<!-- Buttons -->
<div class="mt-4">
  <div class="skeleton skeleton-button"></div>
</div>`;
  // setTimeout ke bd Ayat show ho ge
  setTimeout(() => {
    Ayatbox.innerHTML = `
  <div class="d-flex justify-content-between align-items-center mb-3">
  <div class="d-flex align-items-center gap-2 favorite-btn fs-1">
  <div id="heart" class="cursor"  data-toggle="modal" data-target=".bd-example-modal-sm">

  <div> 
      <i id="heart-col" 
style="${heartIcon ? "color: #ff0808" : "color:  #666666"}"
  class="fa-solid fa-heart mb-2  "></i>
</div>
  </div>

  </div>
  <select id="translate-option" class="form-select w-auto cursor fw-bold text-success border-2 shadow-sm">
    <option hidden disabled selected>Translate</option>
    <option value="English">English</option>
    <option value="Urdu">Urdu</option>
  </select>
</div>
    <!-- Ayah Info -->
  <div class="d-flex justify-content-center align-items-center gap-2 ">
    <p class="fs-4 fw-bold text-success mb-0">${Ayat.para}</p>
    <p class="fs-5 fw-semibold text-success mb-0">${Ayat.surah}</p>
  </div>

  <!-- Ayah Text -->
  <p class="ayat-show fs-2 fw-bold text-dark text-center mt-3">
    ${Ayat.ayat}
  </p>

  <!-- Translation -->
  <p class="translation fs-4 fw-semibold text-secondary mt-3 text-justify">
    ${DefaultTrans ? Ayat.translation_eng : Ayat.translation_urdu}
  </p>

  <!-- Buttons -->
  <div class="mt-4 " >
    <button id="nextayat"  class=" btn btn-lg px-4 py-2 fw-bold shadow-sm w-100 mb-2" style="background: linear-gradient(to right, #4b0082, #9370db); border: none; border-radius: 10px;">
      New Ayah
    </button>
   
  </div>`;

    // ye function Heart btn ko handle krta hey
    Ayatbox.querySelector("#heart").addEventListener("click", function (e) {
      e.preventDefault();
      let heartIcon = document.getElementById("heart-col");
      let modalmes = "";
      let modal = document.getElementById("favoriteModal");

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Ayat already favorite hai ya nahi
      let favoriteIndex = favorites.findIndex((fav) => fav.id === Ayat.id);
      console.log(favoriteIndex);

      if (favoriteIndex !== -1) {
        //  Agar pehle se favorite hai toh remove karo
        modalmes = "Favorite Removed";
        heartIcon.style.color = "#666666";
        // ye ayat ko remove kr raha hey array se  favoriteIndex yani 0 or 1 yani aik element delete kr do
        favorites.splice(favoriteIndex, 1);
      } else {
        //  Agar favorite nahi hai toh add karo
        modalmes = "Favorite Added";
        heartIcon.style.color = "red";
        // ye do cheeze add ho rahi hey taake favorite page me ayat ko inke hisaab se fetch kr sake
        favorites.push({
          id: Ayat.id,
          // agr user ne urdu select ke hoi hey to urdu save ho agr english ke hey select to english save ho
          translation: DefaultTrans ? "English" : "Urdu",
          category: Ayat.category,
          Ayat: Ayat.ayat,
          para: Ayat.para,
          Surah: Ayat.surah,
          English: Ayat.translation_eng,
          Urdu: Ayat.translation_urdu,
        });
      }

      // ✅ Updated array ko wapas localStorage me save karo
      localStorage.setItem("favorites", JSON.stringify(favorites));

      //  Modal Handling
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "favoriteModal";
        modal.className = "modal fade bd-example-modal-sm";
        modal.setAttribute("tabindex", "-1");

        modal.innerHTML = `
      <div class="modal-dialog modal-sm">
        <div class="modal-content text-center p-1">
          <h5 class="modal-title text-danger" id="modalText">${modalmes}</h5>
        </div>
      </div>
    `;
        document.body.appendChild(modal);
      } else {
        document.getElementById("modalText").innerText = modalmes;
      }

      let bootstrapModal = new bootstrap.Modal(modal, { backdrop: false });
      bootstrapModal.show();

      setTimeout(() => {
        bootstrapModal.hide();
      }, 700);
    });

    // next ayat generate krta hey
    document.getElementById("nextayat").addEventListener("click", function () {
      getAyatByMood(mood, DefaultTrans);
    });
    /// Dynamic Selection for Select element
    let translateDropdown = document.getElementById("translate-option");
    translateDropdown.addEventListener("change", function () {
      // dynamic translation place
      let translationElement = document.querySelector(".translation");
      // agr DefaultTrans true hota hey to function ke Parameter me true chala jaye ga  or ayat translate hojaye ge
      DefaultTrans = this.value === "English";
      translationElement.innerHTML = DefaultTrans
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

//// contact us ///
let contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", Contactfunc);
}

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
    }, 500);
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

/// Favorite Page //
let favoriteItems = JSON.parse(localStorage.getItem("favorites")) || [];
function favoritefunc() {
  let categories = ["Thankful", "Happiness", "Angry", "Anxious", "Sad"];
  categories.forEach((category) => {
    let categorydiv = document.getElementById(category);

    if (!categorydiv) return;
    let FilterAyat = favoriteItems.filter((ayat) => ayat.category === category);
    if (FilterAyat.length === 0) {
      categorydiv.innerHTML = `<p class="text-muted">No Ayat found for ${category}</p>`;
      return;
    }

    FilterAyat.forEach((Ayat) => {
      let div = document.createElement("div");

      div.innerHTML = `
    <div class="d-flex justify-content-end mb-3 mt-2">
    
    </div>
    <div class="d-flex justify-content-center align-items-center gap-2">
      <div class="skeleton skeleton-text" style="width: 50px;"></div>
      <div class="skeleton skeleton-text" style="width: 80px;"></div>
    </div>
    <div class="skeleton skeleton-text" style="height: 40px; width: 90%;"></div>
    <div class="skeleton skeleton-text" style="height: 20px; width: 95%;"></div>
    <div class="skeleton skeleton-text" style="height: 20px; width: 90%;"></div>
    
    <!-- Buttons -->
    <div class="mt-4">
      <div class="skeleton skeleton-button"></div>
    </div>`;
      categorydiv.appendChild(div);
      setTimeout(() => {
        div.outerHTML = `<div class="favorite-card mt-2 " data-id="${Ayat.id} ">
                <!-- Ayah Info -->
                <div class="d-flex justify-content-center align-items-center gap-2 ">
                  <p class="fs-4 fw-bold text-success mb-0">${Ayat.para}</p>
                  <p class="fs-5 fw-semibold text-success mb-0">${
                    Ayat.Surah
                  }</p>
                </div>
      
                <!-- Ayah Text -->
                <p class="ayat-show fs-2 fw-bold text-dark text-center mt-3">${
                  Ayat.Ayat
                }</p>
      
                <!-- Translation -->
               <p class="translation fs-4 fw-semibold text-secondary mt-3 text-justify">
               ${Ayat.translation === "English" ? Ayat.English : Ayat.Urdu}
      
        </p>
      
                <!-- Buttons -->
                <div class="mt-4">
                  <button class="remove-btn btn btn-lg px-4 py-2 fw-bold shadow-sm w-100 mb-2" style="background: linear-gradient(to right, rgb(244, 70, 105), red, #660000); border: none; border-radius: 10px;">
                    Remove
                  </button>
                </div>
              </div>`;
      }, 2000);
    });
  });
}
favoritefunc();
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    let card = e.target.closest(".favorite-card");
    let ayatID = parseInt(card.getAttribute("data-id")); // Convert to number

    // Remove the ayat from favoriteItems array
    favoriteItems = favoriteItems.filter((ayat) => ayat.id !== ayatID);

    //  Save updated list back to LocalStorage
    localStorage.setItem("favorites", JSON.stringify(favoriteItems));

    //  Remove card from the page
    card.remove();
    favoritefunc();
  }
});

let Scroll = document.getElementById("started");
if (Scroll) {
  Scroll.addEventListener("click", function () {
    window.scrollTo({ top: 700, behavior: "smooth" });
  });
}
