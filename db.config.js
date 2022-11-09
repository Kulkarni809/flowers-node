// var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://localhost:27017/mydb";

// function createRole(user) {
//   MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("roles").insertOne(user, function (err, res) {
//       if (err) throw err;
//       console.log("1 document inserted");
//       db.close();
//     });
//   });
// }

// module.exports = {
//   connect: function connect(collection, data) {
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("mydb");
//       dbo.collection(collection).insertOne(user, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//       });
//     });
//   },
// };

// let { Sequelize, Model, DataTypes } = require('sequelize');
// const sequelize = new Sequelize(
//     'information_schema',
//     "root",
//     12345678,
//      {
//        host: 'localhost',
//        dialect: 'mongodb'
//      }
//    );

//    sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
//  }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
//  });

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
