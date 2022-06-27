const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
// const button = document.querySelector(".top-banner button");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");

userTokenKey = "7b9dab7aa7664a84c99a8f60a307baf8";
localStorage.setItem("apiKey", EncryptStringAES(userTokenKey)); //! apiKey adı ile localStorage e kaydettik

form.addEventListener("submit", (e) => {
  e.preventDefault(); //! submit ettiğimizde sayfayı yenilemesin diye
  getWeatherData();
});

const getWeatherData = async () => {
  let tokenKey = DecryptStringAES(localStorage.getItem("apiKey"));
  //! Şifreleyip localStorage kısmına attığımız apiKeyi tekrar şifresini çözerek çağırıyoruz.
  let inputVal = input.value; //! const input = document.querySelector(".top-banner input") olan;
  let lang = "tr";
  let unitType = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${tokenKey}&units=${unitType}&lang=${lang}`;
  try {
    const response = await fetch(url).then((response) => response.json()); //! herhangi bir yöntem yazmazsak get anlamına gelir.
    const { name, main, sys, weather } = response;
    // console.log(response);

    // const response = await axios(url); //! axios ile
    // const { name, main, sys, weather } = response.data;
    // console.log(response.data);

    let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    // console.log(response);

    //? forEach kullanabilmek için => array + nodeList olması lazım
    //? map, filter, reduce kullanabilmek için => array olması lazım

    const cityListItems = list.querySelectorAll(".city");
    const cityListItemsArray = Array.from(cityListItems);
    if (cityListItemsArray.length > 0) {
      const filteredArray = cityListItemsArray.filter(
        (cityCard) =>
          cityCard.querySelector(".city-name span").innerText == name
      );
      if (filteredArray.length > 0) {
        // msg.innerText = `You already know the weather for ${name}`;
        // setTimeout(() => {
        //   msg.innerText = "";
        // }, 5000);
        generateToast({
          message: `You already know the weather for ${name}`,
          background: "#ff1e42",
          color: "hsl(13, 100%, 171%)",
          length: "3000ms",
        });
        form.reset();
        return;
      }
    }
    const createdLi = document.createElement("li");
    createdLi.classList.add("city");
    const createdLiInnerHtml = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;
    createdLi.innerHTML = createdLiInnerHtml;
    //append vs. prepend
    list.prepend(createdLi); //! append sona prepend başa ekler
    form.reset();
    input.focus();
  } catch (error) {
    // msg.innerText = "City can not find";
    generateToast({
      message: `City can not found`,
      background: "#ff1e42",
      color: "hsl(13, 100%, 171%)",
      length: "3000ms",
    });
    // setTimeout(() => {
    //   msg.innerText = "";
    // }, 3000);
  }

  form.reset(); //! input.value = ''; aynı anlama geliyor
};

//! TOASTIFY

let toastContainer;

function generateToast({
  message,
  background = "#00214d",
  // color = "#fffffe",
  length = "3000ms",
}) {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='toast' style='background-color:${background}; {localStorage.getItem('theme') == 'light' ? (color : black) : (color : white) }; animation-duration:${length}'>${message}</p>`
  );
  const toast = toastContainer.lastElementChild;
  toast.addEventListener("animationend", () => toast.remove());
}

(function initToast() {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div class='toast-container'></div>`
  );
  toastContainer = document.querySelector(".toast-container");
})();

//? Eklenen datayı işleyerek, verilen pozisyonda ilgili alana parse etmek. Böylelikle innerHTML’den daha hızlı işlem gerçekleştirebiliyorsunuz.Verilen pozisyon ne demek derseniz de açıklayayım. Bu fonksiyon iki parametre alıyor :

//* element.insertAdjacentHTML(position, text)

//? Buradaki position, element dediğimiz alanın neresine eklemek istediğinizi belirtiyor. Dört farklı string değer alabiliyor. Bunlar :

//* ‘beforebegin’ : Elementin kendisinden önce.

//* ‘afterbegin’ : Elementin içine, içindenki tüm elemanlardan önce.

//* ‘beforeend’ : Elementin içine, son eleman olarak.

//* ‘afterend’ : Elementin kendisinden sonra.

//! dark-light mode

const modeIcon = document.querySelector(".icon");
const locIcon = document.querySelector(".icon-loc");

localStorage.getItem("theme") == null
  ? localStorage.setItem("theme", "light")
  : null;

let localData = localStorage.getItem("theme");

if (localData == "light") {
  modeIcon.src = "./img/moon.png";
  locIcon.src = "./img/lightloc.png";
  document.body.classList.remove("dark-theme");
} else if (localData == "dark") {
  modeIcon.src = "./img/sun.png";
  locIcon.src = "./img/darkloc.png";
  document.body.classList.add("dark-theme");
}

modeIcon.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    modeIcon.src = "./img/sun.png";
    locIcon.src = "./img/darkloc.png";
    localStorage.setItem("theme", "dark");
  } else {
    modeIcon.src = "./img/moon.png";
    locIcon.src = "./img/lightloc.png";
    localStorage.setItem("theme", "light");
  }
});

//! location

// latlong.addEventListener("click", () => {
//   navigator.geolocation.getCurrentPosition(function (position) {
//     let lat = position.coords.latitude;
//     let long = position.coords.longitude;
//     const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
//     const res = await fetch(url2).then(resp=>resp.json)
//     console.log(res);
//   });
// });

// const showPosition = (position) => {
//   console.log(position.coords.latitude);
// };

// const errorPosition = (error) => {
//   console.error(error);
// };

// latlong.addEventListener("click", () => {
//   locWeather();
// });

// const locWeather = async () => {
//   navigator.geolocation.getCurrentPosition(showPosition, errorPosition);
//   let lat = position.coords.latitude;
//   let long = position.coords.longitude;
//   const url = `https://api.openweathermap.org/data/2.5/weather?&appid=${apiKey}`;
//   const response = await fetch(url).then((response) => response.json()); //! herhangi bir yöntem yazmazsak get anlamına gelir.
//   const { name, main, sys, weather } = response;
// };

// const options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
// };

// function success(pos) {
//   const crd = pos.coords;
//   let lat = crd.latitude;
//   let long = crd.longitude;
//   // console.log("Your current position is:");
//   // console.log(`Latitude : ${crd.latitude}`);
//   // console.log(`Longitude: ${crd.longitude}`);
//   // console.log(`More or less ${crd.accuracy} meters.`);
// }

// function error(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

//

const latLong = document.querySelector(".icon-loc");

const successPosition = (position) => {
  let tokenKey = DecryptStringAES(localStorage.getItem("apiKey"));
  const { latitude, longitude } = position.coords;
  const res = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${tokenKey}`
  )
    .then((response) => response.json())
    .then(console.log);

  const { name, main, sys, weather } = res;
  const createdLi = document.createElement("li");
  createdLi.classList.add("city");
  const createdLiInnerHtml = `
        <h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
        </figure>`;
  createdLi.innerHTML = createdLiInnerHtml;
  //append vs. prepend
  list.prepend(createdLi); //! append sona prepend başa ekler
};

const denyPosition = (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

latLong.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(successPosition, console.log);
});
