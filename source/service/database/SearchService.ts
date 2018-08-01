
var elasticsearch = require('elasticsearch');
var Promise = require('bluebird');

var log = console.log.bind(console);

var client = new elasticsearch.Client({
  host: 'localhost:8012',
  log: 'trace'
});

function dropIndex() {
//   return client.indices.delete({
//     index: 'test',
//   });
client.indices.delete({
    index: 'test_index',
    ignore: [404]
  }).then(function (body) {
    // since we told the client to ignore 404 errors, the
    // promise is resolved even if the index does not exist
    console.log('index was deleted or never existed');
  }, function (error) {
    // oh no!
  });
}

function createIndex() {
    var body = {
    tweet:{
        properties:{
            tag         : {"type" : "string", "index" : "not_analyzed"},
            type        : {"type" : "string", "index" : "not_analyzed"},
            namespace   : {"type" : "string", "index" : "not_analyzed"},
            tid         : {"type" : "string", "index" : "not_analyzed"}
        }
    }
}
  return client.indices.create({
    index: 'test',
    mapping: {
      house: {
        name: {
          type: 'string'
        }
      }
    }
  });
}

function addToIndex() {
  return client.index({
    index: 'test',
    type: 'house',
    id: '1',
    body: {
      name: 'huhu'
    }
  });
}

function search() {
  return client.search({
    index: 'test',
    q: 'huhu'
  }).then(log);
}

function closeConnection() {
  client.close();
}

function getFromIndex() {
  return client.get({
    id: 1,
    index: 'test',
    type: 'house',
  }).then(log);

}

function waitForIndexing() {
  log('Wait for indexing ....');
  return new Promise(function(resolve) {
    setTimeout(resolve, 2000);
  });
}
export function test(){
    Promise.resolve()
    .then(dropIndex)
    .then(createIndex)
    .then(addToIndex)
    .then(getFromIndex)
    .then(waitForIndexing)
    .then(search)
    .then(closeConnection);
}
