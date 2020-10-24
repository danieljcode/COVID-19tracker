console.log("Built in 2020 by danieljcode");
console.log("https://github.com/danieljcode");

const inputMain = document.getElementById("mainSelector");
const lastupdate = document.getElementById("last-update");

var timezone = "Europe/Paris";
var countryCode = "FR";

const switchDarkMode = (e) =>
  document.querySelector("body").classList.toggle("dark-mode");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async function (position) {
    await $.get(
      "https://ipinfo.io",
      function (response) {
        countryCode = response.country;
        timezone = response.timezone;
        $("#mainSelector").val(response.country).prop("selected", true);
        getAllData();
      },
      "jsonp"
    );
  });
}

const predictionsDisplay = document.getElementById("predictions");
var predictions;

var requestOptions = {
  method: "GET",
  redirect: "follow",
};

function getCurrentData() {
  //THIS CODE WILL BE RAN ON PAGE LOAD
  var settings = {
    url: `https://covid19-api.org/api/status/${countryCode}`,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);

    var casesDisplay = document.getElementById("cases");
    var deathsDisplay = document.getElementById("deaths");
    var recoveredDisplay = document.getElementById("recovered");
    deathsDisplay.innerHTML = response.deaths.toLocaleString();
    casesDisplay.innerHTML = response.cases.toLocaleString();
    recoveredDisplay.innerHTML = response.recovered.toLocaleString();
    lastupdate.innerHTML =
      "Last Updated: " +
      convertLastUpdateTime(response.last_update).toLocaleString();
    //lastupdate.innerHTML=convertTime().toLocaleString();
    // lastupdate.innerHTML="Last Updated: "+response.last_update.toLocaleString('en-US', { timeZone: 'America/New_York' });
  });
}
function convertLastUpdateTime(isoString) {
  var startTime = new Date(isoString);
  startTime = new Date(
    startTime.getTime() + startTime.getTimezoneOffset() * 60000
  );
  var text = startTime;
  return text;
  //lastupdate.innerHTML=startTime.toLocaleString();
}

function getFutureData() {
  var settingsFUTURE = {
    url: `https://covid19-api.org/api/prediction/${countryCode}`,
    method: "GET",
    timeout: 0,
  };

  $.ajax(settingsFUTURE).done(function (response) {
    console.log(response);
    predictions = response;

    var myNode = document.getElementById("predictions");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }

    response.forEach((element) => {
      var prediction = document.createElement("div");
      prediction.setAttribute("class", "box-");
      var casesNum = document.createElement("h1");
      casesNum.setAttribute("class", "crimson");
      var dateNum = document.createElement("h2");
      casesNum.innerHTML =
        `<span class="text-dark">Predicted Cases:</span> ` +
        element.cases.toLocaleString();
      dateNum.innerHTML = "Date: " + element.date;

      prediction.appendChild(casesNum);
      prediction.appendChild(dateNum);
      predictionsDisplay.appendChild(prediction);
    });

    createGraph();
  });
}

function getAllData() {
  getCurrentData();
  getFutureData();
}

inputMain.addEventListener("change", () => {
  console.log(inputMain.value);
  countryCode = inputMain.value;
  getAllData();
});

getAllData();

function createGraph() {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        predictions[0].date,
        predictions[1].date,
        predictions[2].date,
        predictions[3].date,
        predictions[4].date,
        predictions[5].date,
      ],
      datasets: [
        {
          label: "Number of cases",
          data: [
            predictions[0].cases,
            predictions[1].cases,
            predictions[2].cases,
            predictions[3].cases,
            predictions[4].cases,
            predictions[5].cases,
          ],
          backgroundColor: [
            'rgba(255,69,0, 0.2)',
            'rgba(255,69,0, 0.2)',
            'rgba(255,69,0, 0.2)',
            'rgba(255,69,0, 0.2)',
            'rgba(255,69,0, 0.2)',
            'rgba(255,69,0, 0.2)',
          ],
          borderColor: [
            'rgba(255, 0, 10, 1)',
            'rgba(255, 0, 10, 1)',
            'rgba(255, 0, 10, 1)',
            'rgba(255, 0, 10, 1)',
            'rgba(255, 0, 10, 1)',
            'rgba(255, 0, 10, 1)',
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      events: [],
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    },
  });

  var ctx = document.getElementById("myChart2").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        predictions[0].date,
        predictions[1].date,
        predictions[2].date,
        predictions[3].date,
        predictions[4].date,
        predictions[5].date,
      ],
      datasets: [
        {
          label: "Number of cases",
          data: [
            predictions[0].cases,
            predictions[1].cases,
            predictions[2].cases,
            predictions[3].cases,
            predictions[4].cases,
            predictions[5].cases,
          ],
          backgroundColor: [
            'rgba(255,69,0, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            "rgba(255, 0, 10 ,1)",
            "rgba(255, 0, 10 ,1)",
            "rgba(255, 0, 10 ,1)",
            "rgba(255, 0, 10,1)",
            "rgba(255, 0, 10 ,1)",
            "rgba(255, 0, 10 ,1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      events: [],
      responsive: true,

      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    },
  });
}

// Sort name of countries selection
sortList();

function sortList() {
  var container = document.getElementById("mainSelector");
  var contents = container.querySelectorAll("option");

  var list = [];
  for (var i = 0; i < contents.length; i++) {
    list.push(contents[i]);
  }

  list.sort(function (a, b) {
    return a.innerHTML < b.innerHTML ? -1 : a.innerHTML > b.innerHTML ? 1 : 0;
  });

  list.reverse();

  for (var i = 0; i < list.length; i++) {
    container.insertBefore(list[i], container.firstChild);
  }
}