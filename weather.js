//? HTML'den gerekli elementleri secelim
const form = document.querySelector("section.weather-banner form");
const input = document.querySelector(".weather-container input");
const msg = document.querySelector("span.weather-msg");
const list = document.querySelector(".weather-results ul.weather-cities");

form.addEventListener("submit", (event) => {
  event.preventDefault(); //? Formun varsayılan davranışını engelliyoruz
  getWeatherDataFromApi(); //? API'den hava durumu verisini almak için fonksiyonu çağırıyoruz
});

const getWeatherDataFromApi = async () => {
  const API_KEY = "532f6fb121b89285ec354c1ff1137593";
  const inputValue = input.value;
  const units = "metric";
  const lang = "tr";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&lang=${lang}&units=${units}`;

  try {
    const response = await axios(url);
    console.log(response);

    const { main, sys, name, weather } = response.data; //! Dest.

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    //? Şehir listesinde aynı şehirin daha önce eklenip eklenmediğini kontrol ediyoruz
    const cityNameSpans = list.querySelectorAll(".weather-city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    if (cityNameSpansArray.length > 0) {
      const filteredArray = cityNameSpansArray.filter(
        (item) => item.innerText == name
      );
      console.log(filteredArray);
      if (filteredArray.length > 0) {
        msg.innerText = `Zaten ${name} şehri için hava durumunu biliyorsunuz, lütfen başka bir şehir arayın 😉`;
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }

    //? Yeni bir li elementi oluşturup, şehir listesine ekliyoruz
    const createdLi = document.createElement("li");
    createdLi.classList.add("weather-city");
    createdLi.innerHTML = `
        <h2 class="weather-city-name">
        <span>${name}</span>
        <sup>${sys.country}</sup>
        </h2>
        <div class="weather-city-temp">
        ${Math.round(main.temp)}    
        <sup>°C</sup>
        </div>
        <figure>
        <img src="${iconUrl}" class="weather-city-icon" alt="" />
        <figcaption>${weather[0].description}</figcaption>
        </figure>
    `;
    list.prepend(createdLi); //? Yeni oluşturulan şehri listeye ekliyoruz. append sona ekleme yaparken, prepend one ekleme yapar.
  } catch (error) {
    console.log(error);
    msg.innerText = `404 (Şehir Bulunamadı)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000); //? Mesajı 5 saniye sonra temizliyoruz
  }

  form.reset(); //? Formu sıfırlıyoruz
};