let coins = [];
let cardContent = "";
let favoriteARR = [];
let coinsArrForChart = {};
let theSixthCoinOBJ;

let coins_data = [];
//double array for the fav coin
let coinsPriceAndTimeARR = [[], [], [], [], []];
//the chart
let chart;
//the interval
let myInterval;

let moreDataOBJ;

let filter = {
  searchText: "",
};

let allCoinsURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=1";
let MoreInfoURL = `https://api.coingecko.com/api/v3/coins/`;

// One Page Application: handle nav to hold on the current page and sections
function coinsClicked() {
  navHome.className = "nav-link active";
  navLive.className = "nav-link";
  navAbout.className = "nav-link";

  coinsSec.className = "page theActive pt-5";
  LiveReportsSec.className = "page";
  aboutMeSec.className = "page ";
}

function LiveReportsClicked() {
  navLive.className = "nav-link active";
  navAbout.className = "nav-link";
  navHome.className = "nav-link";

  LiveReportsSec.className = "page theActive";
  aboutMeSec.className = "page";
  coinsSec.className = "page pt-5";
}

function aboutClicked() {
  navAbout.className = "nav-link active";
  navHome.className = "nav-link";
  navLive.className = "nav-link";

  aboutMeSec.className = "page theActive";
  coinsSec.className = "page pt-5";
  LiveReportsSec.className = "page";
}

// get favorites from localStorage
function localStorageFavoriteCoins() {
  let favorites = localStorage.getItem("favorite Coins");
  favorites = JSON.parse(favorites);
  if (favorites != undefined) {
    favoriteARR = favorites;
  }
}

// get coins information from api
function getByAjax(url, type_data, callbackFun) {
  $.ajax({
    type: "GET",
    datatype: "json",
    async: type_data == 1 ? true : false,
    url: url,
    beforeSend: function () {
      //show the loading img
      if (type_data == 1) {
        $("#progressBar").css("display", "block");
      }
    },
    success: function (result) {
      switch (type_data) {
        case 1:
          localStorageFavoriteCoins();
          create_data_chart();
          callbackFun(result, favoriteARR);
          break;
        case 2:
          coinsArrForChart = { ...result };
          callbackFun == fillForLoop ? callbackFun(result) : null;
          break;
      }
    },
    complete: function () {
      //hide the loading img
      if (type_data == 1) {
        $("#progressBar").css("display", "none");
      }
    },

    error: function (error) {
      console.log("error : ", error);
      //show the err img
      $("#needToReload").css("display", "block");
    },
  });
}

getByAjax(allCoinsURL, 1, printCoins);

// filter coins by symbol
const renderCoins = function (coins, filters) {
  const filteredCoins = coins.filter(function (coin) {
    return coin.symbol.toLowerCase().includes(filters.searchText.toLowerCase());
  });

  document.getElementById("cardDV").innerHTML = "";
  cardContent = "";
  filteredCoins.map((coin, i) => printSingleCoin(coins, coin, i, favoriteARR));
  cardDV.innerHTML = cardContent;
};

// search coin by input
document.getElementById("searchFields").addEventListener("input", function (e) {
  filter.searchText = e.target.value;

  renderCoins(coins, filter);
});

// print all coins
function printCoins(result, favoriteARR) {
  coins = [...result];
  cardContent = "";

  coins.map((coin, i) => printSingleCoin(coins, coin, i, favoriteARR));

  cardDV.innerHTML = cardContent;
}

// print every Single Coin
function printSingleCoin(coins, singleCoin, i, favoriteARR) {
  let isChecked = favoriteARR.some((item) => item.name === singleCoin.name) ? "checked" : "unchecked";
  cardContent += `
   <div id="theCoinCol" class="col-lg-4 col-md-4 col-sm-6 col-12">
        <div class="container p-2 m-2 container p-2 mx-auto rounded coins-cards">
            <div class="row">
                <div class="col-7 col-md-7 col-lg-8">
                    <h6>${singleCoin.name}</h6>
                </div>
                <div class="col-5 col-md-5 col-lg-4">
                    <div class="form-check form-switch">
                        <label class="heart-switch">
                            <input type="checkbox" name="favCheck"  ${isChecked} onclick="onlyFiveCheckBox(coins[${i}],${i})" />
                            <svg viewBox="0 0 33 23" fill="white">
                              <path d="M23.5,0.5 C28.4705627,0.5 32.5,4.52943725 32.5,9.5 C32.5,16.9484448 21.46672,22.5 16.5,22.5 C11.53328,22.5 0.5,16.9484448 0.5,9.5 C0.5,4.52952206 4.52943725,0.5 9.5,0.5 C12.3277083,0.5 14.8508336,1.80407476 16.5007741,3.84362242 C18.1491664,1.80407476 20.6722917,0.5 23.5,0.5 Z"></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p>${singleCoin.symbol}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-7 col-md-7 col-lg-8">
                    <p>
                      <a onclick="moreInfo('${singleCoin.id}')" class="btn btn-dark" data-bs-toggle="collapse" href="#${singleCoin.symbol}" role="button" aria-expanded="false" aria-controls="${singleCoin.symbol}">More Info</a>
                    </p>
                    
                </div>
                <div class="col-5 col-md-5 col-lg-4">
                    <img src="${singleCoin.image}" id="img${singleCoin.symbol}" class="currencyImg  mx-auto" alt="${singleCoin.id}-img">
                </div>
            </div>
            <div class="row">
                <div class="collapse" id="${singleCoin.symbol}">
                    <div class="card card-body" id="${singleCoin.name}">
                                
                    </div>
                </div>
            </div>
        </div>
    </div> `;
}

// limit favorite to five -Execute when input checkbox selected to favorite.
function onlyFiveCheckBox(singleCoin, indexFromAll) {
  let favoriteCheck = document.getElementsByName("favCheck");
  favoriteCheck[indexFromAll].onchange = function () {
    if ($(this).prop("checked") == true) {
      if (favoriteARR.length < 5) {
        favoriteARR.push(singleCoin);
        localStorage.setItem("favorite Coins", JSON.stringify(favoriteARR));
        create_data_chart();
      } else {
        theSixthCoinOBJ = singleCoin;
        openModal(favoriteARR, theSixthCoinOBJ);
        this.checked = false;
      }
    } else if ($(this).prop("checked") == false) {
      favoriteARR.splice(
        favoriteARR.findIndex((item) => item.name === singleCoin.name),
        1
      );
      localStorage.setItem("favorite Coins", JSON.stringify(favoriteARR));
      create_data_chart();
    }
  };
}

function openModal(favoriteARR, theSixthCoinOBJ) {
  let theModal = "";
  cardContent = "";
  theModal = `
  <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Select a currency to remove </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
             <div class="row" id="dropHeartsDV"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="updateModal" disabled  onclick="updateFavorites(favoriteARR, theSixthCoinOBJ)" data-bs-dismiss="modal">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  `;
  modalDIV.innerHTML = theModal;
  favoriteARR.map((singleCoin, i) => printSingleFavoriteToModal(singleCoin, i));
  dropHeartsDV.innerHTML = cardContent;
  var myModal = new bootstrap.Modal(document.getElementById("myModal"), focus);
  myModal.show();
}

function printSingleFavoriteToModal(singleCoin, i) {
  cardContent += `
        <div class="col-6">
          <div class="container p-2 m-2 rounded coins-cards">
            <div class="row">
                <div class="col-7 col-md-7 col-lg-8">
                  <h6>${singleCoin.name}</h6>
                </div>
                <div class="col-5 col-md-5 col-lg-4">   
                  <input type="radio" onclick="countChecked();" value="${singleCoin.name}" name="favCheck-modal"/>
                </div>
            </div>
            <div class="row">
                <div class="col-7 col-md-7 col-lg-8">
                  <p>${singleCoin.symbol}</p>  
                </div>
                <div class="col-5 col-md-5 col-lg-4">
                    <img src="${singleCoin.image}" class="currencyImgModal  mx-auto d-block" alt="${singleCoin.id}-img">
                </div>
            </div>  
          </div>
        </div>
        `;
}

// able save Changes button
function countChecked() {
  document.getElementById("updateModal").removeAttribute("disabled");
}

// update favorites
function updateFavorites(favoriteARR, theSixthCoinOBJ) {
  let allRadio = document.getElementsByName("favCheck-modal");

  let unfavoriteCoinToDelete;
  for (let i = 0; i < allRadio.length; i++) {
    if (allRadio[i].checked) {
      unfavoriteCoinToDelete = allRadio[i].value;
    }
  }
  favoriteARR.splice(
    favoriteARR.findIndex((item) => item.name === unfavoriteCoinToDelete),
    1
  );
  favoriteARR.push(theSixthCoinOBJ);
  localStorage.setItem("favorite Coins", JSON.stringify(favoriteARR));

  document.getElementById("cardDV").innerHTML = "";
  cardContent = "";
  coins.map((coin, i) => printSingleCoin(coins, coin, i, favoriteARR));
  cardDV.innerHTML = cardContent;
  create_data_chart();
}

// more info -Execute when more info button is clicked
function moreInfo(id) {
  // if there is data for this coin-take data from localStorage, else -execute ajax function
  let moreInfoFromLocal = localStorage.getItem(`${id}-prices`);
  moreInfoFromLocal = JSON.parse(moreInfoFromLocal);
  if (moreInfoFromLocal != undefined) {
    printMoreDetails(moreInfoFromLocal);
  } else {
    getByAjax(MoreInfoURL + id, 1, printMoreDetails);
  }
}

function printMoreDetails(result) {
  moreDataOBJ = { ...result };

  let doesItExist = localStorage.getItem(`${moreDataOBJ.id}-prices`);

  doesItExist == undefined ? localStorage.setItem(`${moreDataOBJ.id}-prices`, JSON.stringify(moreDataOBJ)) : doesItExist;
  var logoutTimer = setTimeout(function () {
    localStorage.removeItem(`${moreDataOBJ.id}-prices`);
  }, 19000);

  var myCollapsible = document.getElementById(`${moreDataOBJ.symbol}`);
  myCollapsible.addEventListener("hide.bs.collapse", function () {
    document.getElementById(`img${moreDataOBJ.symbol}`).style.display = "none";
  });

  myCollapsible.addEventListener("show.bs.collapse", function () {
    document.getElementById(`img${moreDataOBJ.symbol}`).style.display = "block";
  });
  let moreData = "";
  moreData = `
    <div> EUR: ${moreDataOBJ.market_data.current_price.eur}&#8364;</div>
    <div> USD: ${moreDataOBJ.market_data.current_price.usd}&dollar; </div>
    <div> ILS: ${moreDataOBJ.market_data.current_price.ils}&#8362; </div>
        `;
  document.getElementById(`${moreDataOBJ.name}`).innerHTML = moreData;
}

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

create_chart();

function create_data_chart() {
  let info_of_coin = {};
  coins_data.length = 0;
  coinsPriceAndTimeARR.map((coin_num) => (coin_num.length = 0));
  clearInterval(myInterval);

  if (favoriteARR.length > 0) {
    $(".empty-chart").css("display", "none");
    $(".isCoinExist").css("display", "block");
    fill_first_five();
    favoriteARR.map((coin, index) => {
      info_of_coin = {
        type: "spline",
        name: coin.symbol,
        showInLegend: true,
        xValueFormatString: "HH mm ss",
        yValueFormatString: "#,##0 Units",
        dataPoints: coinsPriceAndTimeARR[index],
      };
      coins_data.push(info_of_coin);
    });
    getValueOfCoin();
  } else {
    $(".empty-chart").css("display", "block");
    $(".isCoinExist").css("display", "none");
  }

  chart.render();
}

function fill_first_five() {
  let str_coins = "";
  str_coins += favoriteARR.map((coin) => coin.symbol.toUpperCase()) + ",";
  let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str_coins}&tsyms=USD`;
  getByAjax(url, 2, fillForLoop);
}

function fillForLoop() {
  for (let i = 5; i >= 0; i--) {
    favoriteARR.map((coin, index) => {
      val = {
        x: new Date(Date.now() - i * 2000),
        y: coinsArrForChart[coin.symbol.toUpperCase()].USD,
      };
      coinsPriceAndTimeARR[index].push(val);
    });
  }
}

function getValueOfCoin() {
  let val = {};
  //create the interval and get the data every two seconds
  myInterval = setInterval(function () {
    let str_coins = "";
    str_coins += favoriteARR.map((coin) => coin.symbol.toUpperCase()) + ",";
    let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${str_coins}&tsyms=USD`;
    getByAjax(url, 2);

    favoriteARR.map((coin, index) => {
      val = {
        x: new Date(),
        y: coinsArrForChart[coin.symbol.toUpperCase()].USD,
      };
      if (coinsPriceAndTimeARR[index].length > 10) {
        coinsPriceAndTimeARR[index].shift();
      }
      coinsPriceAndTimeARR[index].push(val);
    });

    chart.render();
  }, 2000);
}
