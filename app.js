let express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
let Events = require("./models/events");
let Orders = require("./models/orders");
let users = require("./models/users");
let tickets = require("./models/tickets");
let cors = require('cors');
app.use(cors())

app.listen(2002, console.log("Flowers!"));
app.use(bodyParser.json({ extended: false }));

let jwtVerify = (req, res, next) => {
  // jwt.verify()
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, "shhhhh", function (err, decoded) {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

app.post("/signUp", (req, res) => {
  //   req.body = {
  //     fullname: "Test User",
  //     mobile: "1212121212",
  //     email: "Test@google.com",
  //     password: "Test@123",
  //     nantionality: "Indian",
  //     role: 1,
  //   };
  if (
    req.body.fullname &&
    req.body.mobile &&
    req.body.email &&
    req.body.password &&
    req.body.nantionality
  ) {
    users
      .createUser({ ...req.body, role: 1 })
      .then((dt) =>
        dt.acknowledged
          ? res.send({ status: true, msg: "Successful!" })
          : res.sendStatus(503)
      )
      .catch(res.sendStatus(501));
  } else {
    res.sendStatus(503);
  }
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    users
      .getUsers({
        email: req.body.email,
        password: req.body.password,
      })
      .then((usr) => {
        if (usr.length === 1) {
          let token = jwt.sign(
            {
              data: { userId: usr[0]._id.toString() },
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            "secret"
          );
          res.send({
            isLoggedIn: true,
            JWT: "Bearer " + token,
          });
        }
      });
  }
});

app.get("/", (req, res) => {});

app.get("/getOrders", jwtVerify, (req, res) => {
  let user = req.user.userId;
  Orders.getOrders({ user: user })
    .then((data) => {
      res.send(data);
    })
    .catch(res.sendStatus(404));
});

app.get("/getEvents", (req, res) => {
  if (req.query.userId) {
    let user = req.query.userId;
    Orders.getEventsByOrderForUser({ Owner: user }).then((newEv) => {
      res.json(newEv);
    });
  } else {
    res.sendStatus(503);
  }
});

app.post("/createOrder", jwtVerify, (req, res) => {
  if (
    req.body.userId &&
    req.body.ticketId &&
    req.body.quantity &&
    req.body.eventId
  ) {
    let user = req.user.userId;
    let ticket = req.body.ticketId;
    let quantity = req.body.quantity;
    let eventt = req.body.eventId;
    let now = new Date().getTime();
    tickets
      .getTickets({ _id: users.ObjectId(ticket) })
      .then((data) => {
        if (data.length && data[0].quantity >= quantity) {
          Events.getEvents({ _id: users.ObjectId(eventt) })
            .then((evt) => {
              if (
                evt.length &&
                evt[0].start_data < now &&
                now < evt[0].end_data
              ) {
                Orders.createOrder({
                  Owner: user,
                  Event_tickets: [
                    {
                      event: eventt,
                      tickets: [{ _id: ticket, quantity }],
                    },
                  ],
                  date: now,
                  total_price: data[0].price * quantity,
                  currency: data[0].currency,
                })
                  .then((dt) =>
                    dt.acknowledged
                      ? res.send({ status: true, msg: "Successful!" })
                      : res.sendStatus(503)
                  )
                  .catch(console.log);
              } else {
                res.json({
                  status: false,
                  msg: "Event Expired!",
                });
              }
            })
            .catch(console.log);
        } else {
          res.json({
            status: false,
            msg: "Sold Out!",
          });
        }
      })
      .catch(console.log);
  } else {
    res.sendStatus(503);
  }
});
