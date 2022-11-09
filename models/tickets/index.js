let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/mydb";

// Create collection

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("tickets", function (err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

function createTicket(ticket) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    dbo.collection("tickets").insertOne(ticket, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

function getTickets(details = {}, props = { limit: 10 }) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = await dbo.collection("tickets").find(details, props).toArray();
      await db.close();
      resolve(data);
    });
  });
}

function deleteTicket(details = {}) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    let myquery = { address: "Mountain 21" };
    dbo.collection("tickets").deleteOne(details, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
}

//deleteTicket({ Owner: "6364cbbee1eaa74a7fb8efbe" });

function updateTicket(ticket, data) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    dbo.collection("tickets").updateOne(ticket, data, function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}
//getTickets().then(console.log);

function createDummyTickets() {
  for (let i = 5; i < 20; i++) {
    createTicket({
      name: "Test Ticket " + i,
      description: "Test Desc " + i,
      price: 25,
      quantity: 20,
      currency: "USD",
      //event:"eventId"
    });
  }
}

//createDummyTickets();

// createTicket({
//   name: "Test Ticket 4",
//   description: "Test Desc 4",
//   price: 25,
//   quantity: 10,
//   currency: "USD",
// });

// createTicket({
//   name: "Test Ticket 3",
//   description: "Test Desc 3",
//   price: 300,
//   quantity: 10,
//   currency: "RUP",
// });

// getTickets({}, { limit: 2 }).then((data) =>
//   console.log(data.map((d) => d._id.toString()))
// );

// let myobj = {
//   fullname: user.fullname,
//   mobile: user.mobile,
//   email: user.email,
//   password: user.password,
//   nantionality: user.nantionality,
// };

//updateUsers({ email: "Test@google.com" }, { password: "Test@1234" });

module.exports = {
  createTicket,
  getTickets,
  deleteTicket,
  updateTicket,
};
