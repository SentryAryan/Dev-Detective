//Variables
const searchbar = document.querySelector(".searchbar-container");
const profilecontainer = document.querySelector(".profile-container");
const root = document.documentElement.style;
const get = (param) => document.getElementById(`${param}`);
const url = "https://api.github.com/users/";
const noresults = get("no-results");
const btnmode = get("btn-mode");
const modetext = get("mode-text");
const modeicon = get("mode-icon");
const btnsubmit = get("submit");
const input = get("input");
const avatar = get("avatar");
const userName = get("name");
const user = get("user");
const date = get("date");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const bio = get("bio");
const repos = get("repos");
const followers = get("followers");
const following = get("following");
const user_location = get("location");
const page = get("page");
const twitter = get("twitter");
const company = get("company");
// init function calling to set the initial UI
init();

// Event Listners
// searching and displaying user data on clicking the submit button
btnsubmit.addEventListener("click", () => {
  if (input.value !== "") {
    getUserData(url + input.value);
  }
});

// on pressing enter key display user data
document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Enter") {
      if (input.value !== "") {
        getUserData(url + input.value);
      }
    }
  },
  false
);

// While writing username in input field remove "no user found" if it was made visible during previous
// search
input.addEventListener("input", () => {
  noresults.style.display = "none";
});

// When clicking on dark mode button change the color theme of UI based on darkMode variables value
btnmode.addEventListener("click", () => {
  if (localStorage.getItem("dark-mode") === "false") {
    darkModeProperties();
  } else {
    lightModeProperties();
  }
});

// Functions
// Call API
function getUserData(giturl) {
  fetch(giturl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      updateProfile(data);
    })
    .catch((error) => {
      throw error;
    });
}


// Render the data on UI
function updateProfile(data) {
    if(data.message === "Not Found") {
        noresults.style.display = "flex";
    }
    else {
        noresults.style.display = "none";
        function checkNull(param1, param2) {
            if(param1 === "" || param1 === null) {
                param2.style.opacity = 0.5;
                param2.previousElementSibling.style.opacity = 0.5;
                return false;
            }
            else {
                return true;
            }
        }
        avatar.src = `${data.avatar_url}`;
        userName.innerText = data.name === null ? data.login : data.name;
        user.innerText = `@${data.login}`;
        user.href = `${data.html_url}`;
        const datesegments = data.created_at.split("T").shift().split("-");
        date.innerText = `Joined ${datesegments[2]} ${months[datesegments[1]-1]} ${datesegments[0]}`;
        bio.innerText = data.bio === null ? "This profile has no bio" : `${data.bio}`;
        repos.innerText = `${data.public_repos}`;
        followers.innerText = `${data.followers}`;
        following.innerText = `${data.following}`;
        user_location.innerText = checkNull(data.location, user_location) ? `${data.location}` : "Not Available";
        page.innerText = checkNull(data.blog, page) ? `${data.blog}` : "Not Available"
        page.href = checkNull(data.blog, page) ? `${data.blog}` : "#";
        twitter.innerText = checkNull(data.twitter_username, twitter) ? `${data.twitter_username}` : "Not Available";
        twitter.href = checkNull(data.twitter_username, twitter) ? `https://twitter.com/${data.twitter_username}` : "#";
        company.innerText = checkNull(data.company, company) ? `${data.company}` : "Not Available";
        searchbar.classList.toggle("active");
        profilecontainer.classList.toggle("active");
    }
}

// function to set dark theme in UI
function darkModeProperties() {
  root.setProperty("--lm-bg", "#141D2F");
  root.setProperty("--lm-bg-content", "#1E2A47");
  root.setProperty("--lm-text", "white");
  root.setProperty("--lm-text-alt", "white");
  root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
  root.setProperty("--lm-icon-bg", "brightness(1000%)");
  modetext.innerText = "LIGHT";
  modeicon.src = "./assets/images/sun-icon.svg";
  localStorage.setItem("dark-mode", "true");
}

// function to set light theme in UI
function lightModeProperties() {
  root.setProperty("--lm-bg", "#F6F8FF");
  root.setProperty("--lm-bg-content", "#FEFEFE");
  root.setProperty("--lm-text", "#4B6A9B");
  root.setProperty("--lm-text-alt", "#2B3442");
  root.setProperty("lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
  root.setProperty("--lm-icon-bg", "brightness(100%)");
  modetext.innerText = "DARK";
  modeicon.src = "./assets/images/moon-icon.svg";
  localStorage.setItem("dark-mode", "false");
}

// init function to initialise the color theme of the UI according to color theme of users 
// computer and call the getUser data with a default github profile
function init() {
  const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if(localStorage.getItem("dark-mode") === null) {
    if(prefersDarkMode) {
      darkModeProperties();
    }
    else {
      lightModeProperties();
    }
  }
  else if(localStorage.getItem("dark-mode") === "true") {
    darkModeProperties();
  }
  else {
    lightModeProperties();
  }
  getUserData(url + "SentryAryan");
}