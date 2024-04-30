//Додавання бібліотеки flatpickr
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// Додавання бібліотеки iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const dataDay = document.querySelector('[data-days]');
const dataHour = document.querySelector('[data-hours]');
const dataMin = document.querySelector('[data-minutes]');
const dataSec = document.querySelector('[data-seconds]');
const dataElements = document.querySelectorAll('.value');

startBtn.disabled = true;

flatpickr(dateInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', onStartBtnClick);

let userSelectedDate = null;

function onStartBtnClick() {
  dataElements.forEach(item => item.classList.toggle('end'));
  startBtn.disabled = false;
  dateInput.disabled = true;
  const timerId = setInterval(() => {
    const userSelectedDate = new Date(dateInput.value);
    const delatTime = userSelectedDate - Date.now();
    const { days, hours, minutes, seconds } = convertMs(delatTime);

    dataDay.textContent = addLeadingZero(days);
    dataHour.textContent = addLeadingZero(hours);
    dataMin.textContent = addLeadingZero(minutes);
    dataSec.textContent = addLeadingZero(seconds);

    if (delatTime < 1000) {
      dataElements.forEach(item => item.classList.toggle('end'));
      clearInterval(timerId);
      dateInput.disabled = false;
    }
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return `${value}`.padStart(2, '0');
}