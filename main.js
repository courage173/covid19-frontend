/* eslint-disable no-plusplus */
const name = document.querySelector('#name');
const aveAge = document.querySelector('#aveAge');
const avgDailyIncome = document.querySelector('#aveDailyIncome');
const avgDailyIncomePop = document.querySelector('#avgDailyPop');
const population = document.querySelector('#pop');
const timeToElapse = document.querySelector('#time');
const reportedCases = document.querySelector('#reportCases');
const totalHospitalBeds = document.querySelector('#beds');
const periodType = document.getElementsByName('period');
const button = document.querySelector('#btn');
const error = document.querySelector('#error');
let period = '';

const validation = (data) => {
  for (let i = 0; i < Object.keys(data).length; i++) {
    if (typeof (data[Object.keys(data)[i]]) === 'object') {
      const d = data[Object.keys(data)[i]];
      for (let j = 0; j < Object.keys(d).length; j++) {
        if (!d[Object.keys(d)[j]]) {
          return false;
        }
      }
    } else if (!data[Object.keys(data)[i]]) return false;
  }
  return true;
};

const displayResult = (data) => {
  for (let i = 0; i < Object.keys(data).length; i++) {
    if (Object.keys(data)[i] === 'impact') {
      const impact = data[Object.keys(data)[i]];
      for (let j = 0; j < Object.keys(impact).length; j++) {
        const node = document.createTextNode(`${Object.keys(impact)[j]}:  ${impact[Object.keys(impact)[j]]}`);
        const div = document.querySelector('.Impact');
        const para = document.createElement('p');
        para.appendChild(node);
        div.appendChild(para);
      }
    }
    if (Object.keys(data)[i] === 'severeImpact') {
      const impact = data[Object.keys(data)[i]];
      for (let k = 0; k < Object.keys(impact).length; k++) {
        const div = document.querySelector('.severe');
        const para = document.createElement('p');
        const node = document.createTextNode(`${Object.keys(impact)[k]}:  ${impact[Object.keys(impact)[k]]}`);
        para.appendChild(node);
        div.appendChild(para);
      }
    }
  }
};

const handleError = (errMessage) => {
  error.innerHTML = errMessage;
  setTimeout(() => {
    error.innerHTML = '';
  }, 3000);
};
button.addEventListener('click', (event) => {
  event.preventDefault();
  for (let i = 0; i < periodType.length; i++) {
    if (periodType[i].checked) {
      period = periodType[i].value;
    }
  }
  const data = {
    region: {
      name: name.value,
      aveAge: aveAge.value,
      avgDailyIncomeInUSD: parseFloat(avgDailyIncome.value),
      avgDailyIncomePopulation: avgDailyIncomePop.value
    },
    periodType: period,
    timeToElapse: timeToElapse.value,
    reportedCases: reportedCases.value,
    population: population.value,
    totalHospitalBeds: totalHospitalBeds.value
  };

  const valid = validation(data);

  if (valid) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('https://covid19-estimate.herokuapp.com/api/v1/on-covid-19/json', req).then((res) => {
      res.json().then((result) => {
        const div = document.querySelector('.Impact');
        const Sevdiv = document.querySelector('.severe');
        div.innerHTML = '';
        Sevdiv.innerHTML = '';
        displayResult(result);
      });
    }).catch(() => {
      handleError('internal Server Error');
    });
  } else {
    const errorMessage = 'Fields cannot be blank';
    handleError(errorMessage);
  }
});
