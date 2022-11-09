let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/mydb";
let ObjectId = require("mongodb").ObjectId;

// Create Mongodb Database

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

// Create collection

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("users", function (err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

function createUser(user) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = new Promise((resolveP, rejectP) => {
        dbo.collection("users").insertOne(user, function (err, res) {
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

function getUsers(details, props = { limit: 10 }) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, async function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = await dbo.collection("users").find({}, props).toArray();
      await db.close();
      resolve(data);
    });
  });
}

function updateUser(user, dta) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      let dbo = db.db("mydb");
      let data = new Promise((resolveP, rejectP) => {
        dbo.collection("users").updateOne(user, dta, function (err, res) {
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

function deleteUser(details = {}) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    let myquery = { address: "Mountain 21" };
    dbo.collection("users").deleteOne(details, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
}

//deleteUser({ _id: ObjectId("6364cbbee1eaa74a7fb8efbe") });
//636abd46d1bd97773975c370
//getUsers({}).then((data) => console.log(data)); //data[0]._id.toString()

module.exports = {
  createUser,
  getUsers,
  updateUser,
  ObjectId,
};

// createUser({
//   fullname: "Test User",
//   mobile: "1212121212",
//   email: "Test@google.com",
//   password: "Test@123",
//   nantionality: "Indian",
//   role: 1,
// }).then(console.log);

// let myobj = {
//   fullname: user.fullname,
//   mobile: user.mobile,
//   email: user.email,
//   password: user.password,
//   nantionality: user.nantionality,
// };

//updateUsers({ email: "Test@google.com" }, { password: "Test@1234" });
