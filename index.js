/* start control coding */
var registerForm = document.querySelector("#register-form");
var allInput = registerForm.querySelectorAll("input");
var addBtn = document.querySelector("#add-btn");
var modal = document.querySelector(".modal");
var closeBtn = document.querySelector(".close-icon");
addBtn.onclick = function () {
    clearFormFields();
    modal.classList.add("active");
};

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    clearFormFields();
});

var userData = JSON.parse(localStorage.getItem("userData")) || [];
var profile_pic = document.querySelector("#profile-pic");
var uploadPic = document.querySelector("#upload-feild");
var dateE1 = document.getElementById("date");
var timeE1 = document.querySelector("#time");
var titleE1 = document.getElementById("title");
var descriptionE1 = document.querySelector("#description");
var eventE1 = document.querySelector("#event");
var nearestPlaceE1 = document.querySelector("#nearest-place");
var registerBtn = document.querySelector("#register-btn");
var updateBtn = document.querySelector("#update-btn");

if (localStorage.getItem("userData") != null) {
    userData = JSON.parse(localStorage.getItem("userData"));
}

registerBtn.onclick = function (e) {
    e.preventDefault();
    registrationData();
    getDataFromLocal();
    modal.classList.remove("active");
};

function registrationData() {
    var imgUrl = profile_pic.src; // Current image URL
    if (uploadPic.files.length > 0) { // Check if a new image has been uploaded
        imgUrl = uploadPic.value; // If yes, use the newly uploaded image
    }

    userData.push({
        date: dateE1.value,
        time: timeE1.value,
        title: titleE1.value,
        description: descriptionE1.value,
        event: eventE1.value,
        nearestPlace: nearestPlaceE1.value,
        profilePic: imgUrl == undefined ? "C:/Users/Zahra/Pictures/unknown1.jpg" : imgUrl,
    });

    var userString = JSON.stringify(userData);
    localStorage.setItem("userData", userString);
    swal("Good job!", "Registration Successful!", "success");

    console.log(userData);
}

const getDataFromLocal = () => {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    userData.forEach((data, index) => {
        cardContainer.innerHTML += `
        <div class="card">
            <div class="card-content">
                <div class="profile-image">
                    <img src="${data.profilePic}" alt="Profile Picture">
                </div>
                <div class="details">
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                    <p><strong>Title:</strong> ${data.title}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Event:</strong> ${data.event}</p>
                    <p><strong>Nearest Place:</strong> ${data.nearestPlace}</p>
                </div>
            </div>
            <div class="card-actions">
                <button class="edit-btn"><i class="fa fa-edit"></i></button>
                <button class="del-btn" style="background-color: #EE534F;"><i class="fa fa-trash"></i></button>
            </div>
        </div>
        `;
    });

    const allEditBtns = document.querySelectorAll(".edit-btn");
    allEditBtns.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            handleEdit(index);
        });
    });

    const allDelBtns = document.querySelectorAll(".del-btn");
    allDelBtns.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            deleteCard(index);
        });
    });

    function deleteCard(index) {
        userData.splice(index, 1);
        const userString = JSON.stringify(userData);
        localStorage.setItem("userData", userString);
        getDataFromLocal();
    }
};

getDataFromLocal();

uploadPic.onchange = function () {
    if (uploadPic.files[0].size < 1000000) {
        var freader = new FileReader();
        freader.onload = function (e) {
            imgUrl = e.target.result;
            profile_pic.src = imgUrl;
            console.log(imgUrl);
        };
        freader.readAsDataURL(uploadPic.files[0]);
    } else {
        alert("File size is too large");
    }
};

var searchEl = document.querySelector("#empId");
searchEl.oninput = function () {
    searchFun();
};

function searchFun() {
    var cardContainer = document.getElementById("card-container");
    var filter = searchEl.value.toLowerCase();
    var cards = cardContainer.querySelectorAll(".card");
    cards.forEach(function(card) {
        var details = card.querySelector(".details").innerText.toLowerCase();
        if (details.includes(filter)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

var delAllBtn = document.querySelector("#del-all-btn");
var allDelBox = document.querySelector("#del-all-box");
delAllBtn.addEventListener("click", () => {
    if (allDelBox.checked == true) {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                localStorage.removeItem("userData");
                window.location = location.href;
                swal("Poof! Your imaginary file has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    } else {
        swal("Check the box", "Check box to delete data!", "warning");
    }
});

function clearFormFields() {
    dateE1.value = "";
    timeE1.value = "";
    titleE1.value = "";
    descriptionE1.value = "";
    eventE1.value = "";
    nearestPlaceE1.value = "";
    profile_pic.src = "C:/Users/Zahra/Pictures/unknown1.jpg";
    uploadPic.value = "";
    registerBtn.disabled = false;
    updateBtn.disabled = true;
}

var updateBtn = document.querySelector("#update-btn");
updateBtn.onclick = function (e) {
    e.preventDefault(); // Prevent form submission
    var index = parseInt(this.getAttribute('data-index'));
    userData[index] = {
        date: dateE1.value,
        time: timeE1.value,
        title: titleE1.value,
        description: descriptionE1.value,
        event: eventE1.value,
        nearestPlace: nearestPlaceE1.value,
        profilePic: uploadPic.value == "" ? profile_pic.src : imgUrl,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    clearFormFields();
    getDataFromLocal();
    modal.classList.remove("active"); // Close the modal after update
};

function handleEdit(index) {
    var data = userData[index];
    modal.classList.add("active");
    registerBtn.disabled = true;
    updateBtn.disabled = false;
    updateBtn.setAttribute('data-index', index);
    dateE1.value = data.date;
    timeE1.value = data.time;
    titleE1.value = data.title;
    descriptionE1.value = data.description;
    eventE1.value = data.event;
    nearestPlaceE1.value = data.nearestPlace;
    profile_pic.src = data.profilePic;
}

var themeSelector = document.getElementById("theme");
var videoBackground = document.getElementById("video-background");
var videoBackgroundRain = document.getElementById("video-background-rain"); // Add reference to the rain video element
var videoBackgroundSunny = document.getElementById("video-background-sunny"); // Add reference to the sunny video element

themeSelector.addEventListener("change", function() {
    var selectedTheme = this.value;
    document.body.className = "theme-" + selectedTheme;
    if (selectedTheme === "wind") {
        videoBackground.style.display = "block";
        videoBackgroundRain.style.display = "none";
        videoBackgroundSunny.style.display = "none";
    } else if (selectedTheme === "rain") {
        videoBackground.style.display = "none";
        videoBackgroundRain.style.display = "block";
        videoBackgroundSunny.style.display = "none";
    } else if (selectedTheme === "sunny") {
        videoBackground.style.display = "none";
        videoBackgroundRain.style.display = "none";
        videoBackgroundSunny.style.display = "block";
    } else {
        videoBackground.style.display = "none";
        videoBackgroundRain.style.display = "none";
        videoBackgroundSunny.style.display = "none";
    }
});