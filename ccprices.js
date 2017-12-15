var PriceService = angular.module('PriceService', [])
  .service('Price', function ($http) {
    
    var lastRetrieved = null;
    var lastUpdated = new Date();


    cryptoCurrencies = [];
    console.log('getting prices');
    cryptoTickers.forEach(crypto => {
      $http.get("https://min-api.cryptocompare.com/data/price?fsym=" + crypto + "&tsyms=BTC,USD,EUR").then(function (response) {
        cryptoCurrencies.push({ label: crypto, data: response.data });
        lastUpdated = new Date();
        console.log(cryptoCurrencies);
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

var cryptoTickers = ["BTC", "BCH", "ETH"]; 

app.controller("PricesController", function ($scope, Price) {
  console.log('setting prices');

  $scope.$watch(Price.getCryptoPrices, function(prices){
    $scope.cryptoCurrencies = prices;
  })
});

app.controller("PricesGraphController", function($scope, Price){
  var ctx = document.getElementById("myChart").getContext('2d');
  
  var labels = cryptoTickers;
  var data = new Array();

  $scope.refresh = function(){
    var cc = Price.getCryptoPrices();
    
    cc.forEach(cc => {
      data.push(cc.data.BTC);
    })
    
    myChart.update();
  };

  var myChart = new Chart(ctx, {
    type: 'bar',
      data: {
      labels: labels,
        datasets: [{
        label: 'Price per btc',
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