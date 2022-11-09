var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";
var ObjectId = require("mongodb").ObjectId;
let { getTickets } = require("../tickets");

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("Events", function (err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

function createEvent(event) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("events").insertOne(event, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

// createEvent({
//   Slug: "Test User",
//   Name: "1212121212",
//   Desc: "Test@google.com",
//   Poster: "Test@123",
//   start_data: new Date(),
//   end_data: new Date().getTime() + 100000,
//   tickets: [],
// });

function createDummyEvents() {
  for (let i = 0; i < 4; i++) {
    getTickets({}, { limit: 5, skip: 5 * i })
      .then((data) =>
        createEvent({
          Slug: "EventSlug " + i,
          Name: "Event Name " + i,
          Desc: "Event Desc " + i,
          Poster: "Event Poster " + i,
          start_data: new Date().getTime(),
          end_data: new Date().getTime() + 100000,
          tickets: data.map((a) => a._id.toString()),
        })
      )
      .catch(reject);
  }
}

//createDummyEvents();

function getEvents(details = {}, limit = 10) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = await dbo
        .collection("events")
        .find(details, { limit })
        .toArray();
      await db.close();
      resolve(data);
    });
  });
}

function deleteEvent(details = {}) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    //var myquery = { address: "Mountain 21" };
    dbo.collection("events").deleteMany(details, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
}

//deleteEvent({});

function updateEvent(user, data) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo
      .collection("events")
      .updateOne(user, { $set: data }, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
      });
  });
}
// getEvents({ _id: ObjectId("636971b20383559f5d565f43") }).then(console.log);

//console.log(new ObjectId("6364cbbee1eaa74a7fb8efbe").toString());

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
};
