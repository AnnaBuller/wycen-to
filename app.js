window.addEventListener('DOMContentLoaded', function () {
    //  variables -->
    const stopWatch = document.getElementById('stopWatch');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    const resetBtn = document.getElementById('reset');

    let startTimer = null;
    let timerSeconds = 0;
    let allSeconds = 0;

    let [hours, minutes, seconds] = [0, 0, 0];

    // helper functions -->
    function disabled(...elems) {
        elems.forEach(elem => elem.setAttribute('disabled', 'true'));
    }

    function unDisabled(...elems) {
        elems.forEach(elem => elem.removeAttribute('disabled'));
    }

    // main Stopwatch function -->
    function displayTime() {
        seconds++;
        allSeconds++;
        timerSeconds++;

        if (seconds >= 60) {
            minutes++;
            seconds = 0;

            if (minutes >= 60) {
                hours++;
                minutes = 0;

                if (hours >= 24) {
                    hours = 0;
                }
            }
        }

        let h = hours < 10 ? '0' + hours : hours;
        let m = minutes < 10 ? '0' + minutes : minutes;
        let s = seconds < 10 ? '0' + seconds : seconds;

        stopWatch.innerHTML = `${h} : ${m} : ${s}`;
    }

    // events -->
    startBtn.addEventListener('click', () => {
        if (startTimer !== null) {
            clearInterval(startTimer);
        }

        startTimer = setInterval(displayTime, 1000);

        disabled(startBtn);
        unDisabled(stopBtn, resetBtn);
    });

    stopBtn.addEventListener('click', function () {
        clearInterval(startTimer);

        disabled(stopBtn);
        unDisabled(startBtn);
    });

    resetBtn.addEventListener('click', function () {
        clearInterval(startTimer);
        allSeconds = 0;

        disabled(resetBtn, stopBtn);
        unDisabled(startBtn);

        [hours, minutes, seconds] = [0, 0, 0];

        stopWatch.innerHTML = '00 : 00 : 00';
    });

    // OBLICZENIA Z FORMULARZA
    const form = document.querySelector('.form');
    const timeEl = document.querySelector('.summary__time');
    const totalPriceEl = document.querySelector('.summary__totalPrice');
    const hourPriceEl = document.querySelector('.summary__hourPrice');
    const customTimeCheckbox = document.querySelector('.customTime__checkbox');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const pricingType = e.target.pricing.value;
        const rate = e.target.rate.value;
        const sample = e.target.sample.value;
        const totalLength = e.target.totalLength.value;

        if (!rate || !sample || !totalLength) {
            alert('Proszę uzupełnić dane.');
            return;
        }

        // Chcę wpisać czas ręcznie
        if (customTimeCheckbox.checked) {
            const customTimeHours = e.target.customTimeHours.value;
            const customTimeMinutes = e.target.customTimeMinutes.value;

            allSeconds = customTimeHours * 3600 + customTimeMinutes * 60;
        } else {
            allSeconds = timerSeconds;
        }

        // Praca nad tym tekstem zajmie Ci:
        const time = sample > 0 ? (totalLength * allSeconds) / sample : 0;

        const timeString =
            time === 0
                ? ' – '
                : new Date(time * 1000).toISOString().slice(11, 16);

        timeEl.innerText = timeString;
        // ___

        // Wycena tego zlecenia to:
        const price = (totalLength * rate) / pricingType;
        totalPriceEl.innerText = price.toFixed(2);
        // ___

        // Podczas jego realizacji będziesz zarabiać:
        const hoursDecimal = (time / 3600).toFixed(2);
        hourPriceEl.innerText =
            hoursDecimal === '0.00' ? ' – ' : (price / hoursDecimal).toFixed(2);
    });
});
