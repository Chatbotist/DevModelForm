const tg = window.Telegram.WebApp;
tg.expand();

let currentStep = 0;
let role = null;
let totalSteps = 0;
const formData = {
  role: "",
  model: {
    gender: "Девушка",
    name: "",
    age: "",
    phone: "",
    telegram: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    city: "",
    instagramLinks: [],
    portfolioLinks: [],
    snapsLinks: [],
  },
  scout: {
    name: "",
    phone: "",
    telegram: "",
    height: "",
    chest: "",
    waist: "",
    hips: "",
    age: "",
    photos: [],
    city: "",
  },
};

function populateSelect(id, start, end) {
  const select = document.getElementById(id);
  for (let i = start; i <= end; i++) {
    const option = new Option(i, i);
    select.add(option);
  }
}

function populateCities(id) {
  const cities = [
    "Москва",
    "Санкт-Петербург",
    "Новосибирск",
    "Екатеринбург",
    "Казань",
    "Нижний Новгород",
    "Челябинск",
    "Самара",
    "Омск",
    "Ростов-на-Дону",
    "Уфа",
    "Красноярск",
    "Пермь",
    "Воронеж",
    "Волгоград",
    "Краснодар",
    "Саратов",
    "Тюмень",
    "Тольятти",
    "Ижевск",
    "Барнаул",
    "Иркутск",
    "Хабаровск",
    "Ярославль",
    "Владивосток",
    "Махачкала",
    "Томск",
    "Оренбург",
    "Кемерово",
    "Новокузнецк",
    "Рязань",
    "Астрахань",
    "Набережные Челны",
    "Пенза",
    "Липецк",
    "Киров",
    "Чебоксары",
    "Тула",
    "Калининград",
    "Курск",
    "Ставрополь",
    "Улан-Удэ",
    "Тверь",
    "Магнитогорск",
    "Иваново",
    "Брянск",
    "Сочи",
    "Белгород",
    "Сургут",
    "Владимир",
    "Архангельск",
    "Калуга",
    "Смоленск",
    "Чита",
    "Другое",
  ];
  const select = document.getElementById(id);
  cities.forEach((city) => select.add(new Option(city, city)));
}

// Заполняем выпадающие списки
populateSelect("model-age", 13, 60);
populateSelect("model-height", 150, 220);
populateSelect("model-chest", 60, 115);
populateSelect("model-waist", 50, 90);
populateSelect("model-hips", 80, 115);
populateCities("model-city");

populateSelect("scout-age", 13, 60);
populateSelect("scout-height", 150, 220);
populateSelect("scout-chest", 60, 115);
populateSelect("scout-waist", 50, 90);
populateSelect("scout-hips", 80, 115);
populateCities("scout-city");

function showStep(step) {
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  if (step === 0) {
    document.getElementById("role-selection").classList.add("active");
    document.getElementById("back-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("progress").style.width = "0%";
  } else if (role === "model") {
    document.getElementById(`model-step-${step}`).classList.add("active");
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("next-btn").style.display =
      step < totalSteps ? "block" : "none";
    document.getElementById("submit-btn").style.display =
      step === totalSteps ? "block" : "none";
    document.getElementById("progress").style.width = `${
      (step / totalSteps) * 100
    }%`;
  } else if (role === "scout") {
    document.getElementById(`scout-step-${step}`).classList.add("active");
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("next-btn").style.display =
      step < totalSteps ? "block" : "none";
    document.getElementById("submit-btn").style.display =
      step === totalSteps ? "block" : "none";
    document.getElementById("progress").style.width = `${
      (step / totalSteps) * 100
    }%`;
  }
  currentStep = step;
  document
    .querySelector(".step-container")
    .scrollTo({ top: 0, behavior: "smooth" });
}

// Закрытие клавиатуры при клике на свободную область
document.getElementById("step-container").addEventListener("click", (e) => {
  if (e.target === document.getElementById("step-container")) {
    document.activeElement.blur();
  }
});

// Прокрутка к активному полю при фокусе
document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      const headerHeight = document.querySelector(".fixed-header").offsetHeight;
      const inputPosition = input.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: inputPosition - headerHeight - 20,
        behavior: "smooth",
      });
    }, 300);
  });
});

// Обработка загрузки фотографий
document.getElementById("upload-photos-btn").addEventListener("click", () => {
  document.getElementById("scout-photos").click();
});

document.getElementById("scout-photos").addEventListener("change", (e) => {
  const newFiles = Array.from(e.target.files); // Получаем все выбранные файлы
  if (newFiles.length > 0) {
    formData.scout.photos = formData.scout.photos.concat(newFiles); // Добавляем новые файлы к уже существующим
    renderPhotos();
  }
  e.target.value = ""; // Очищаем input, чтобы можно было загрузить те же файлы снова
});

function renderPhotos() {
  const preview = document.getElementById("scout-photo-preview");
  const counter = document.getElementById("photo-counter");
  preview.innerHTML = "";
  formData.scout.photos.forEach((file, index) => {
    const photoItem = document.createElement("div");
    photoItem.classList.add("photo-item");
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-photo");
    removeBtn.innerHTML = "×";
    removeBtn.addEventListener("click", () => {
      formData.scout.photos.splice(index, 1);
      renderPhotos();
    });
    photoItem.appendChild(img);
    photoItem.appendChild(removeBtn);
    preview.appendChild(photoItem);
  });
  counter.textContent = `Загружено: ${formData.scout.photos.length}/3`;
}

// Обработка добавления ссылок
document.querySelectorAll(".add-link-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    const input = document.getElementById(target.replace("-links", ""));
    const link = input.value.trim();
    if (link) {
      if (target === "model-instagram-links")
        formData.model.instagramLinks.push(link);
      if (target === "model-portfolio-links")
        formData.model.portfolioLinks.push(link);
      if (target === "model-snaps-links") formData.model.snapsLinks.push(link);
      renderLinks(target);
      input.value = "";
    }
  });
});

function renderLinks(target) {
  const linkList = document.getElementById(target);
  linkList.innerHTML = "";
  let links = [];
  if (target === "model-instagram-links") links = formData.model.instagramLinks;
  if (target === "model-portfolio-links") links = formData.model.portfolioLinks;
  if (target === "model-snaps-links") links = formData.model.snapsLinks;
  links.forEach((link, index) => {
    const linkItem = document.createElement("div");
    linkItem.classList.add("link-item");
    const linkText = document.createElement("a");
    linkText.href = link;
    linkText.textContent = link;
    linkText.target = "_blank";
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-link");
    removeBtn.innerHTML = "×";
    removeBtn.addEventListener("click", () => {
      if (target === "model-instagram-links")
        formData.model.instagramLinks.splice(index, 1);
      if (target === "model-portfolio-links")
        formData.model.portfolioLinks.splice(index, 1);
      if (target === "model-snaps-links")
        formData.model.snapsLinks.splice(index, 1);
      renderLinks(target);
    });
    linkItem.appendChild(linkText);
    linkItem.appendChild(removeBtn);
    linkList.appendChild(linkItem);
  });
}

document.querySelectorAll(".role-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    role = btn.dataset.role;
    formData.role = role;
    totalSteps = 3;
    showStep(1);
  });
});

document.querySelectorAll(".gender-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".gender-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    formData.model.gender = btn.dataset.gender;
  });
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (role === "model") {
    if (currentStep === 1) {
      formData.model.gender =
        document.querySelector(".gender-btn.active").dataset.gender;
      formData.model.name = document.getElementById("model-name").value;
      formData.model.age = document.getElementById("model-age").value;
      formData.model.phone = document.getElementById("model-phone").value;
      formData.model.telegram = document.getElementById("model-telegram").value;
      if (
        !formData.model.name ||
        !formData.model.age ||
        !formData.model.phone ||
        !formData.model.telegram
      ) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
      }
    } else if (currentStep === 2) {
      formData.model.height = document.getElementById("model-height").value;
      formData.model.chest = document.getElementById("model-chest").value;
      formData.model.waist = document.getElementById("model-waist").value;
      formData.model.hips = document.getElementById("model-hips").value;
      formData.model.city = document.getElementById("model-city").value;
      if (
        !formData.model.height ||
        !formData.model.chest ||
        !formData.model.waist ||
        !formData.model.hips ||
        !formData.model.city
      ) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
      }
    }
  } else if (role === "scout") {
    if (currentStep === 1) {
      formData.scout.name = document.getElementById("scout-name").value;
      formData.scout.phone = document.getElementById("scout-phone").value;
      formData.scout.telegram = document.getElementById("scout-telegram").value;
      if (
        !formData.scout.name ||
        !formData.scout.phone ||
        !formData.scout.telegram
      ) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
      }
    } else if (currentStep === 2) {
      formData.scout.height = document.getElementById("scout-height").value;
      formData.scout.chest = document.getElementById("scout-chest").value;
      formData.scout.waist = document.getElementById("scout-waist").value;
      formData.scout.hips = document.getElementById("scout-hips").value;
      formData.scout.age = document.getElementById("scout-age").value;
      if (
        !formData.scout.height ||
        !formData.scout.chest ||
        !formData.scout.waist ||
        !formData.scout.hips ||
        !formData.scout.age
      ) {
        alert("Пожалуйста, заполните все обязательные поля!");
        return;
      }
    }
  }
  if (currentStep < totalSteps) showStep(currentStep + 1);
});

document.getElementById("back-btn").addEventListener("click", () => {
  if (currentStep > 0) showStep(currentStep - 1);
});

document.getElementById("submit-btn").addEventListener("click", () => {
  if (role === "scout") {
    formData.scout.city = document.getElementById("scout-city").value;
    // Проверка на минимум 3 фото для скаутов
    if (formData.scout.photos.length < 3) {
      alert("Пожалуйста, загрузите минимум 3 фотографии модели!");
      return;
    }
  }

  // Отправка в Telegram через бэкенд
  const telegramData = new FormData();
  telegramData.append("role", formData.role);
  if (role === "model") {
    telegramData.append("gender", formData.model.gender);
    telegramData.append("name", formData.model.name);
    telegramData.append("age", formData.model.age);
    telegramData.append("phone", formData.model.phone);
    telegramData.append("telegram", formData.model.telegram);
    telegramData.append("height", formData.model.height);
    telegramData.append("chest", formData.model.chest);
    telegramData.append("waist", formData.model.waist);
    telegramData.append("hips", formData.model.hips);
    telegramData.append("city", formData.model.city);
    formData.model.instagramLinks.forEach((link, index) =>
      telegramData.append(`instagramLinks[${index}]`, link)
    );
    formData.model.portfolioLinks.forEach((link, index) =>
      telegramData.append(`portfolioLinks[${index}]`, link)
    );
    formData.model.snapsLinks.forEach((link, index) =>
      telegramData.append(`snapsLinks[${index}]`, link)
    );
  } else {
    telegramData.append("name", formData.scout.name);
    telegramData.append("phone", formData.scout.phone);
    telegramData.append("telegram", formData.scout.telegram);
    telegramData.append("height", formData.scout.height);
    telegramData.append("chest", formData.scout.chest);
    telegramData.append("waist", formData.scout.waist);
    telegramData.append("hips", formData.scout.hips);
    telegramData.append("age", formData.scout.age);
    telegramData.append("city", formData.scout.city);
    formData.scout.photos.forEach((file, index) => {
      telegramData.append(`photos`, file, file.name);
    });
  }

  fetch("https://vprojectscoutbot.ru/submit", {
    method: "POST",
    body: telegramData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      const modal = document.getElementById("success-modal");
      modal.style.display = "flex";
    })
    .catch((error) => {
      console.error("Ошибка отправки в Telegram:", error);
      alert(
        "Произошла ошибка при отправке анкеты в Telegram. Пожалуйста, попробуйте снова."
      );
    });
});

document.getElementById("modal-close-btn").addEventListener("click", () => {
  const modal = document.getElementById("success-modal");
  modal.style.display = "none";
  tg.close();
});

showStep(0);
