import html2canvas from "html2canvas";
import './style.css';
import './fonts.css';



// Appearance
console.log("App JS is running");


const appearance = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0.5) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target); 
    } 
  });
}, {
  threshold: 0.5
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((element) => appearance.observe(element));




// Header


const menu = document.getElementById('hamburger__menu');
const middleBar = menu.querySelector('.middle');
const overlay = document.querySelector('.overlay');
const sidebar = document.querySelector('.side__bar');

let hamburgerMenuActive = false;

menu.addEventListener('click', () => {
  if (!hamburgerMenuActive) {
    hamburgerMenuActive = true;
    menu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.querySelector('body').classList.toggle('lock')
  }
});

middleBar.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'transform') {
    hamburgerMenuActive = false;
  }
});

overlay.addEventListener('click', () => {
    if (!hamburgerMenuActive) {
    hamburgerMenuActive = true;
    menu.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.querySelector('body').classList.toggle('lock')
  }
})

sidebar.addEventListener('click', (e) => {
  const section = e.target.closest('.side__bar_title');

  if (section && e.target === section) {
    const innerUl = section.querySelector('ul');
    if (innerUl) {
      const isHidden = getComputedStyle(innerUl).display === 'none';
      innerUl.style.display = isHidden ? 'block' : 'none';
    }
  }
});


// Slider

const track = document.querySelector('.slider__track');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next')

let slides = document.querySelectorAll('.slide'); 

let firstClone = slides[0].cloneNode(true);
let lastClone = slides[slides.length - 1].cloneNode(true)

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

slides = document.querySelectorAll('.slide'); 

let index = 1;
const slideWidth = slides[0].offsetWidth;

let sliderIsMoving = false;

track.style.transform = `translateX(-${index * slideWidth}px)`;

function moveToSlide() {
  if (sliderIsMoving) return;
  sliderIsMoving = true;
  track.style.transition = 'transform 0.4s ease-in-out';
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

function resetPosition() {
  track.style.transition = 'none';
  if (slides[index].id === 'first-clone') {
    index = 1;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  } else if (slides[index].id === 'last-clone') {
    index = slides.length - 2;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }
  sliderIsMoving = false;
}

track.addEventListener('transitionend', resetPosition);

nextButton.addEventListener('click', () => {
  if (index >= slides.length - 1) return;
  index++;
  moveToSlide();
});

prevButton.addEventListener('click', () => {
  if (index <= 0) return;
  index--;
  moveToSlide();
});

track.addEventListener('transitionend', resetPosition);

// Form

const form = document.querySelector('#form');
const inputImg = document.querySelector('#avatar__input');
const avatarImg = document.querySelector('.avatar_img');
const labelForInputImg = document.querySelector('.file-upload')
const maxImageSize = 1024 * 1024

inputImg.addEventListener('change', () => {
  const file = inputImg.files[0];
  if(file) {
    if(file.size > maxImageSize){
      const currentLabelValue = labelForInputImg.textContent;
      const currentFontSize = labelForInputImg.style.fontSize
      labelForInputImg.style.fontSize = '0.8rem'
      labelForInputImg.textContent = `File size more than 2 MB`
      setTimeout(() => {
        labelForInputImg.textContent = currentLabelValue
        labelForInputImg.style.fontSize = currentFontSize
      }, 2000)
      inputImg.value = ''
    } else {
      const blobURL = URL.createObjectURL(file);
      avatarImg.src = blobURL;
      avatarImg.alt = 'ur-image'
      labelForInputImg.textContent = 'Change image'
    }
  }
});

const inputFullName = document.querySelector('#input_fullname');
const buttonGetName = document.querySelector('.get_fullname');
const userName = document.querySelector('.transformed-name');
const buttonResetName = document.querySelector('.reset-button')

buttonGetName.addEventListener('click', () => {
  const givenName = inputFullName.value.trim();
  if(givenName.length === 0 || givenName === undefined){
    return
  }
  const transformValue = givenName.replace(/[^a-zA-Z \s]/g, '').trim().split(' ')
        .map(value => {
          return value[0].toUpperCase() + value.slice(1)
        }).join(' ')
  if(transformValue.length < 4){
    document.querySelector('#input_fullname').value = '';
    inputFullName.placeholder = 'Min 4 characters';
    placeHolderIsChanged = true
    return;
  }
  if(transformValue.length >= 35){
    document.querySelector('#input_fullname').value = '';
    inputFullName.placeholder = 'Characters limit (35 characters)';
    placeHolderIsChanged = true
    return;
  }

  buttonGetName.style.display = 'none'
  userName.textContent = transformValue;
  userName.style.display = 'block'
  inputFullName.style.display = 'none';
  buttonResetName.style.display = 'block'
})

buttonResetName.addEventListener('click', () => {
  inputFullName.placeholder = 'Sam Smith';
  userName.textContent = ''

  buttonResetName.style.display = 'none';
  inputFullName.style.display = 'block';
  buttonGetName.style.display = 'block';
  userName.style.display = 'none'
  inputFullName.value = '';
})

const addressForm = document.querySelector('#address__form');
const addressInputs = document.querySelectorAll('#address__form input');
const userCountry = document.querySelector('.country');
const userCity = document.querySelector('.city');
const userPostcode = document.querySelector('.postcode');
const inputCountry = document.querySelector('#countryInput');
const inputCity = document.querySelector('#cityInput');
const inputPostcode = document.querySelector('#postcodeInput');
let addressBlocks = document.querySelectorAll('#address__form div');
const addressError = document.querySelector('.address_error_caught')
addressBlocks = [...addressBlocks]

const userAddressArray = [userCountry, userCity, userPostcode];
const inputAddressArray = [inputCountry, inputCity, inputPostcode]


addressForm.addEventListener('submit', (e) => {

  e.preventDefault();
  let inputsFilled = true
  addressInputs.forEach(input => {
    if(input.value.trim() === ''){
      inputsFilled = false
    }
  })
  if(!inputsFilled) {
    addressError.style.display = 'block';
    return
  }
  for(let i = 0; i < userAddressArray.length; i++){
    userAddressArray[i].textContent = inputAddressArray[i].value.trim();
    addressBlocks[i].style.display = 'block'
    inputAddressArray[i].style.display = 'none';
  }
  document.querySelector('.submit-address').style.display = 'none';
  document.querySelector('.reset-address').style.display = 'block';
  addressError.style.display = 'none'
})

addressForm.addEventListener('reset', (e) => {

  e.preventDefault()
  document.querySelector('.submit-address').style.display = 'block';
  document.querySelector('.reset-address').style.display = 'none'
  for(i = 0; i < userAddressArray.length; i++){
    inputAddressArray[i].value = ''
    userAddressArray[i].textContent = '';
    addressBlocks[i].style.display = 'none'
    inputAddressArray[i].style.display = 'block'
  }
})

const formInfo = document.querySelector('#form_info');
const currentBytes = document.querySelector('.current');
const maxBytesLength = formInfo.getAttribute('maxlength');
const maxBytes = document.querySelector('.maxlength');
maxBytes.textContent = maxBytesLength;
const buttonGenerateInfo = document.querySelector('.generate_info')
const gottenInfo = document.querySelector('.transformed_info');
const buttonRefreshInfo = document.querySelector('.refresh_info');
const labelInfo = document.querySelector('.label_info');
const bytesBlock = document.querySelector('.bytes_amount');

formInfo.addEventListener('input', () => {
  const current = getByteLength(formInfo.value); 
  currentBytes.textContent = current;
});

function getByteLength(str) {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const codePoint = str.charCodeAt(i);
    if (codePoint <= 0x7f) bytes += 1;
    else if (codePoint <= 0x7ff) bytes += 2;
    else if (codePoint <= 0xffff) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}


const arrInfoOnLoad = [formInfo, labelInfo, buttonGenerateInfo]
const arrInfoLoaded = [gottenInfo, buttonRefreshInfo]

function toggleArrayClasses(arrHide, arrShow, arrFlexHide = [], arrFlexShow = []){
  arrHide.forEach(element => element.style.display = 'none');
  arrShow.forEach(element => element.style.display = 'block');
  arrFlexHide.forEach(element => element.style.display = 'none');
  arrFlexShow.forEach(element => element.style.display = 'flex')
}

buttonGenerateInfo.addEventListener('click', () => {
  const getInfo = formInfo.value;
  if(getInfo.length < 50){
    formInfo.placeholder = 'Type more info..';
    return
  }
  gottenInfo.innerHTML = getInfo.replace(/\n/g, '<br>');

  toggleArrayClasses(arrInfoOnLoad, arrInfoLoaded, [bytesBlock]);
})
buttonRefreshInfo.addEventListener('click', () => {
  gottenInfo.textContent = '';
  toggleArrayClasses(arrInfoLoaded, arrInfoOnLoad, [], [bytesBlock])
})

const fonts = [...document.querySelectorAll('.fonts_list li')];

fonts.forEach(font => {
  font.addEventListener('click', () => {
    fonts.forEach(el => el.classList.remove('current-font'));
    font.classList.add('current-font');

    const varName = `--${font.textContent.replace(/\s+/g, '-').toLowerCase().replace(/["']/g, '')}`;
    const computedFont = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    document.body.style.fontFamily = computedFont;

  });
});

const generateFullFormButton = document.querySelector('.generate__full_form');
let getAvatarBlock = document.querySelector('.avatar');
let getUserBlock = document.querySelector('.user__fullname');
let getUserAddressBlock = document.querySelector('.address');
let infoPoleBlock = document.querySelector('.info_pole');
let fontsBlock = document.querySelector('.font_changer');

getAvatarBlock = [...getAvatarBlock.children];
getUserBlock = [...getUserBlock.children];
getUserAddressBlock = [...getUserAddressBlock.children];
infoPoleBlock = [...infoPoleBlock.children];

let readyToPrint = false;
generateFullFormButton.addEventListener('click',() => {
  if(/^blob/.test(avatarImg.src) && userName.textContent.trim() != '' && gottenInfo.textContent.trim() != '') {
    getAvatarBlock.forEach(el => {
      if(!el.classList.contains('avatar_border')) {
        el.style.display = 'none'
      }

    });
    getUserBlock.forEach(el => {
      if(!el.classList.contains('transformed-name')) {
        el.style.display = 'none'
      }
    });
    getUserAddressBlock.forEach(el => {
      if(!el.classList.contains('address_result')){
        el.style.display = 'none'
      }
    });
    infoPoleBlock.forEach(el => {
      if(!el.classList.contains('transformed_info')){
        el.style.display = 'none'
      }
    });
    fontsBlock.style.display = 'none'

  }
  readyToPrint = true
  return readyToPrint;
})
const printButton = document.querySelector('.print');
const elementToPrint = document.querySelector('.form__container');


printButton.addEventListener('click', () => {
  html2canvas(elementToPrint).then(canvas => {
    if (readyToPrint) {
      const link = document.createElement('a');
      link.download = 'portfolio.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }).catch(err => console.error(err.type, err.message));
});

function TypeEffect(element, text, interval, i) {
  let index = i || 0;
  let intervalRepeat = 0;

  const mainInterval = setInterval(() => {
    const randChar = String.fromCharCode(Math.floor(Math.random() * 93) + 33);

    if (element.textContent.length > index) {
      element.textContent = element.textContent.slice(0, -1) + randChar;
    } else {
      element.textContent += randChar;
    }

    intervalRepeat += 1;

    if (intervalRepeat >= 3) {
      clearInterval(mainInterval);
      element.textContent = element.textContent.slice(0, -1) + text[index];
      index++;

      if (index < text.length) {
        setTimeout(() => TypeEffect(element, text, interval, index), interval);
      }
    }
  }, 30); 
}


const printButtonObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    const target = entry.target;
    const textPrint = 'Print card';

    if (entry.intersectionRatio) {
      TypeEffect(target, textPrint, 100);  
      observer.unobserve(target);  
    }
  });
});

printButtonObserver.observe(printButton);

const cardColors = document.querySelectorAll('.item-color');



cardColors.forEach(color => {
  color.addEventListener('click', (e) => {
    cardColors.forEach(el => el.classList.remove('selected-color'))
    e.target.classList.add('selected-color')
    cardBackgroundColor(cardColors)
  })
})
function cardBackgroundColor(arr) {
  arr.forEach(el => {
    if(el.classList.contains('selected-color')) {
      elementToPrint.id = el.id
    }
  })
}

cardBackgroundColor(cardColors)