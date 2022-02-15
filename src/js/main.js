const burger = document.querySelector(".burger");
const menu = document.querySelector(".nav__menu");

const allMenuItems = document.querySelectorAll(".nav__menu__list__item");

const menuBurger = () => {
  burger.classList.toggle("active");
  menu.classList.toggle("showMenu");
};

allMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    burger.classList.toggle("active");
    menu.classList.toggle("showMenu");
  });
});

burger.addEventListener("click", menuBurger);
