const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const button = document.querySelector(".top-banner button");
const msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section .cities");

userTokenKey = "";
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
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${tokenKey}&units=${unitType}&lang=${lang}`;
  try {
    const response = await fetch(url).then((response) => response.json()); //! herhangi bir yöntem yazmazsak get anlamına gelir.
    // const response = await axios(url); //! axios ile
    const { name, main, sys, weather } = response;
    // console.log(response);
    let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    // console.log(response);

    //? forEach kullanabilmek için => array + nodeList olması lazım
    //? map, filter, reduce kullanabilmek için => array olması lazım

    const cityList = list.querySelectorAll(".city");
    // console.log(cityList);
    const cityListArray = Array.from(cityList);
    if (cityListArray.length > 0) {
      const filteredArray = cityListArray.filter(
        (cityCard) =>
          (cityCard.querySelector(".city-name span").innerText = name)
      );
      if (filteredArray.length > 0) {
        // msg.innerText = `You already know the weather of ${name}`;
        // setTimeout(() => {
        //   msg.innerText = "";
        // }, 3000);
        generateToast({
          message: `You already know the weather of ${name}`,
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
    const createdLiInnerHTML = `
      <h2 class="city-name" data-name="${name}, ${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
            </figure>`;
    createdLi.innerHTML = createdLiInnerHTML;
    //append vs. prepend
    list.prepend(createdLi); //! append sona prepend başa ekler
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
  color = "#fffffe",
  length = "3000ms",
}) {
  toastContainer.insertAdjacentHTML(
    "beforeend",
    `<p class='toast' style='background-color:${background}; color:${color}; animation-duration:${length}'>${message}</p>`
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
