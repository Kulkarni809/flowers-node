let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/mydb";
let ObjectId = require("mongodb").ObjectId;
let Events = require("../events");

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   let dbo = db.db("mydb");
//   dbo.createCollection("orders", function (err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

function createOrder(order) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = new Promise((resolveP, rejectP) => {
        console.log(order);
        dbo.collection("orders").insertOne(order, function (err, res) {
          if (err) throw err;
          resolveP(res);
        });
      });
      data
        .then((data) => {
          db.close();
          return data;
        })
        .then((dt) => {
          resolve(dt);
        })
        .catch(reject);
    });
  });
}

// createOrder({
//   Owner: "6364cbbee1eaa74a7fb8efbe",
//   Event_tickets: [
//     {
//       event: "63696c5b13f24db8d703b0f0",
//       tickets: [{ _id: "636957c15035e2afc7e18311", quantity: 3 }],
//     },
//   ],
//   date: new Date().getTime(),
//   total_price: 75,
//   currency: "USD",
// });

function getOrders(details = {}, limit = 10) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = await dbo.collection("orders").find({}).toArray();
      await db.close();
      resolve(data);
    });
  });
}

function deleteOrder(details = {}) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    let myquery = { address: "Mountain 21" };
    dbo.collection("orders").deleteMany(details, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
}

//deleteOrder({});

function getEventsByOrderForUser({ user }) {
  return new Promise((resolve, reject) => {
    getOrders({ Owner: user })
      .then(async (data) => {
        let events = [];
        for (let i = 0; i < data.length; i++) {
          let e = data[i];
          await Events.getEvents({
            _id: ObjectId(e.Event_tickets[0].event),
          }).then((ev) => {
            events.push({
              name: ev[0].Name,
              slug: ev[0].Slug,
              Desc: ev[0].Desc,
              Start_Date: ev[0].start_data,
              End_Data: ev[0].end_data,
            });
          });
        }
        return events;
      })
      .then((newEv) => {
        console.log(newEv);
        resolve(newEv);
      });
  });
}

function updateOrder(user, data) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    dbo.collection("orders").updateOne(user, data, function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}
//getOrders().then(console.log);

module.exports = {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  getEventsByOrderForUser,
};
