var Factual = require('factual-api');
var factual = new Factual(process.env.FACTUAL_KEY, process.env.FACTUAL_SECRET);

module.exports = {
  // cors:{origin: ['http://192.168.1.26:1881'], credentials: true},
  cors: true,
  handler: function(request, reply) {
    console.log('MADE IT TO THE SCAN.JS ON THE SERVER')
    console.log('REQUEST.PARAMS', request.params);
    factual.get('/t/products-cpg?q=' + request.params.upc, function (error, res) {
      console.log('error from factual!!!!!!!!!', error)
      var productInfo = res.data;
      console.log('RESPONSE FROM FACTUAL!!!!!!!', res.data);
      console.log('ERROR FROM FACTUAL???????', error)
      reply(productInfo);
      });
    }
};
