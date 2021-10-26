import { favoriteARR, coinsArrForChart, searchPlease1 } from "./mains";

//global vars
let coins_data = [];
//double array for the fav coin
let the_coins = [[], [], [], [], []];
//the chart
let chart;
//the interval
let myInterval;

window.onload = function () {
  //create the chart on load
  create_chart();
};

function create_chart() {
  //create the structure of the array
  chart = new CanvasJS.Chart("chartContainer", {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Live reports of Favorite",
    },
    subtitles: [
      {
        text: "Click Legend to Hide or Unhide Data Series",
        fontFamily: "verdana",
      },
    ],
    axisX: {
      title: "Time",
    },
    axisY: {
      title: "Profit in USD",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e) {
        if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
      },
    },
    //using a global array so when  using render it will update
    data: coins_data,
  });

  create_data_chart();
  chart.render();
}

function create_data_chart() {
  let info_of_coin = {};
  coins_data.length = 0;
  the_coins.map((coin_num) => (coin_num.length = 0));
  clearInterval(myInterval);

  if (favoriteARR.length > 0) {
    $("#empty-chart").css("display", "none");
    fill_first_five();
    favoriteARR.map((coin, index) => {
      info_of_coin = {
        type: "spline",
        name: coin.symbol,
        showInLegend: true,
        xValueFormatString: "HH mm ss",
        yValueFormatString: "#,##0 Units",
        dataPoints: the_coins[index],
      };
      coins_data.push(info_of_coin);
    });

    get_value_of_coin();
  } else {
    $("#empty-chart").css("display", "block");
  }

  chart.render();
}

function fill_first_five() {
  let val = {};
  let str_coins = "";
  str_coins += favoriteARR.map((coin) => coin.symbol.toUpperCase()) + ",";
  let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str_coins}&tsyms=USD`;
  searchPlease1(url, 2);
  // read_ajax(url, 3);
  for (let i = 5; i >= 0; i--) {
    favoriteARR.map((coin, index) => {
      val = {
        x: new Date(Date.now() - i * 2000),
        y: coinsArrForChart[coin.symbol.toUpperCase()].USD,
      };
      the_coins[index].push(val);
    });
  }
}

function get_value_of_coin() {
  let val = {};
  //create the interval and get the data every two seconds
  myInterval = setInterval(function () {
    let str_coins = "";
    str_coins += favoriteARR.map((coin) => coin.symbol.toUpperCase()) + ",";

    let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str_coins}&tsyms=USD`;
    //read_ajax(url,3) will fill favoriteARR array with only the data that we are looking for in tha graph
    // read_ajax(url, 3);
    searchPlease1(url, 2);

    favoriteARR.map((coin, index) => {
      val = {
        x: new Date(),
        y: coinsArrForChart[coin.symbol.toUpperCase()].USD,
      };
      if (the_coins[index].length > 10) {
        the_coins[index].shift();
      }
      the_coins[index].push(val);
    });
    chart.render();
  }, 2000);
}
