function cryptoCompareObject(responseTicker, data){
  this.responseTicker = responseTicker;
  this.data = data;
}

var cryptoTickers = ["BTC", "BCH", "ETH", "LTC"];
var responseTicker = ["BTC", "USD", "EUR", "CAD"];

var PriceService = angular.module('PriceService', [])
  .service('Price', function ($http) {

    var responseTickerString = "";

    responseTicker.forEach(tick=>{
      if(!(responseTickerString == ""))
      {
        responseTickerString+=",";
      }

      responseTickerString+=tick;
    })

    var cryptoCurrencies = [];
    console.log('getting prices');
    cryptoTickers.forEach(crypto => {
      $http.get("https://min-api.cryptocompare.com/data/price?fsym=" + crypto + "&tsyms=" + responseTickerString).then(function (response) {
      
      var cryptoCompareArray = [];
      
      responseTicker.forEach(tick=>{
        cryptoCompareArray.push(new cryptoCompareObject(tick, response.data[tick]));          
      })

      console.log(cryptoCompareArray);

      cryptoCurrencies.push({ label: crypto, data: cryptoCompareArray});
      });
    });

    cryptoCurrencies = cryptoCurrencies.slice();

    return {
      getCryptoPrices: function(){
        return cryptoCurrencies;
      }
    };
  });

var app = angular.module("myapp", ['PriceService']);

app.controller("PricesController", function ($scope, Price) {
  console.log('setting prices');

  $scope.$watch(Price.getCryptoPrices, function(prices){
    $scope.cryptoCurrencies = prices;
  })
});

app.controller("PricesGraphController", function($scope, Price){
  var ctx = document.getElementById("myChart").getContext('2d');

  $scope.responseTicker = responseTicker;
  $scope.graphTicker = 'BTC';
  
  var labelobj = { label: $scope.graphTicker};
  var labels = new Array();
  var data = new Array();

  $scope.refresh = function(){
    var cc = Price.getCryptoPrices();
    // data = new Array();
    data.length = 0;
    labels.length = 0;
    // labels = new Array();
    
    cc.forEach(cc => {
      var price;

      cc.data.forEach(val=>{
        if (val.responseTicker == $scope.graphTicker){
          //found
          price = val.data;
        }
      })
      data.push(price);
      labels.push(cc.label);
    })
    
    myChart.update();
  };

  var myChart = new Chart(ctx, {
    type: 'bar',
      data: {
      labels: 
        labels,
        datasets: [{
          label: "By Currency",
          data: data,
          borderWidth: 1
        }]
      },
      options: {
    scales: {
    yAxes: [{
    ticks: {
    beginAtZero: true
        }
      }]
    }
  }
  });
});