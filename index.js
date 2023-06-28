const siteBody = document.querySelector('.site');
const siteHeader = document.querySelector('.header');
const menuButton = document.querySelector('.header__burger');
const introForm = document.querySelector('.intro-form');

// добавить класс active на форму
const introFormInput = introForm.querySelector('.intro-form__input');
const introFormButton = introForm.querySelector('.intro-form__button');
const introElementList = [introFormInput, introFormButton];

introElementList.forEach((item) => {
  item.addEventListener('focus', () => {
    introForm.classList.add('intro-form--active');
  });
});

introElementList.forEach((item) => {
  item.addEventListener('blur', () => {
    introForm.classList.remove('intro-form--active');
  });
});
// end

// вывести сообщение-заглушку при отправке формы
introForm.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Заглушка для отправки формы');
  introForm.reset();
})
// end

// открыть | закрыть бургер меню в мобайле
menuButton.addEventListener('click', () => {
  siteBody.classList.toggle('site--menu-opened');
});
// end

/*
при клике по ссылке главного меню:
  - выделить активный пункт меню
  - закрыть бургер-меню (в мобайле)
*/
const headerLinkAll = document.querySelectorAll('.header__link');

const closeMenu = () => {
  siteBody.classList.remove('site--menu-opened');
};

headerLinkAll.forEach((item) => {
  item.addEventListener('click', () => {
    headerLinkAll.forEach((item) => {
      item.classList.remove('header__link--active');
    });

    item.classList.add('header__link--active');

    if (window.innerWidth < 768) {
      closeMenu();
    }
  });
});
// end

// развернуть | свернуть список ссылок в блоках в футере
const footerUnitAll = document.querySelectorAll('.footer-unit');
const footerUnitTitleAll = document.querySelectorAll('.footer-unit__title');
const footerUnitListAll = document.querySelectorAll('.footer-unit__list');

footerUnitTitleAll.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (window.innerWidth < 576) {
      footerUnitAll[index].classList.toggle('footer-unit--expanded');

      const list = footerUnitListAll[index];
      if (!list.style.height || list.style.height === '0px') {
        list.style.height = list.scrollHeight + 'px';
      } else {
        list.style.height = '0px';
      }
    }
  });
});

const removeFooterStyles = () => {
  footerUnitListAll.forEach((item) => {
    item.style.removeProperty('height');
  });

  footerUnitAll.forEach((item) => {
    item.classList.remove('footer-unit--expanded');
  });
};
// end

// показывать кнопку бургер меню поверх конента, если отскроллили вниз
const removeBurgerOntop = () => {
  menuButton.classList.remove('header__burger--ontop');
};

const highlightBurger = () => {
  if (window.scrollY === 0) {
    removeBurgerOntop();
  } else {
    menuButton.classList.add('header__burger--ontop');
  }
};

const burgerObserver = new IntersectionObserver(highlightBurger, {
  threshold: 1,
});

burgerObserver.observe(siteHeader);
// end

// перекидывать класс --active в меню при прокрутке страницы
const updateActive = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      const currentSectionId = entry.target.getAttribute('id');

      if (currentSectionId) {
        siteHeader.querySelector('.header__link--active').classList.remove('header__link--active');
        siteHeader.querySelector(`[href="#${currentSectionId}"]`).classList.add('header__link--active');
      }
    }
  });
};

const anchorObserver = new IntersectionObserver(updateActive, {
  threshold: 0.5,
});

const pageSectionAll = document.querySelectorAll('.page__section');
pageSectionAll.forEach((section) => anchorObserver.observe(section));
// end

/*
обработка события resize
при переходе в десктоп - закрыть бургер меню и развернуть списки ссылок в футере
при переходе в мобайл - если находимся наверху страницы - убрать для кнопки меню оформление поверх конента
*/
const debounce = (callback, delay = 250) => {
  let timeout;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
    }, delay);
  };
};

const handleResize = () => {
  if (window.innerWidth >= 768 && siteBody.classList.contains('site--menu-opened')) {
    closeMenu();
  }

  if (window.innerWidth >= 576) {
    removeFooterStyles();
  }

  if (window.innerWidth < 768) {
    if (window.scrollY === 0) {
      removeBurgerOntop();
    }
  }
};

window.addEventListener('resize', debounce(handleResize));
// end
