const { Router } = require("express");
const User = require("../models/user");
const Cycle = require("../models/Cycle");
const Reservation = require("../models/Cycle_renting");
axios = require("axios")
var session = require('express-session');
const pdf = require('html-pdf');
const router = Router();
const fs = require('fs');
const ejs = require('ejs');
const { createVerify } = require("crypto");
const Cycle_renting = require("../models/Cycle_renting");

router.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

// Date
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

router.get("/signin", (req, res) => {

  // req.session.returnTo = req.originalUrl;
  // res.render("signin");
  return res.render("signin");
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const email2 = req.body.email; // Assuming you retrieve the username from the login form
  const response = await User.findOne({ email: email2 });
  const userData = response;
  // Store user data in the session
  req.session.userData = userData;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo; // Clear the saved URL
    return res.cookie("token", token).redirect(returnTo);
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});



router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});



router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});


// Middleware to check if the user is authenticated
function requireLogin(req, res, next) {
  if (!req.user) {
    // Save the current URL to redirect after login
    req.session.returnTo = req.originalUrl;
    res.render("signin", { message: "Please log in or signup!" });
  } else {
    next();
  }
}

router.get("/Availibility", async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await Cycle.find({ City: { $regex: search, $options: "i" } });
    // if (search == "City") {
    //   return res.render("home", { message: "Please select your city !!" });
    // }
    return res.render("Availibility", { cycles: data });
  } catch (err) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get("/seemore/:id", async (req, res) => {
  try {
    const cycle = await Cycle.findById(req.params.id);
    return res.render("seemore", { cycle });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

router.get("/booking/:id", requireLogin, async (req, res) => {

  let currentDate = `${day}-${month}-${year}`;

  const cycle = await Cycle.findById(req.params.id);
  req.session.cycle = cycle;
  return res.render("booking",
    {
      cycle,
      currentDate,
    });
});

router.post("/Reservation", async (req, res) => {
  try {

    // Time, Price, Discount Calculator
    function getTimeDifference(STT, ETT, Price) {
      // Convert dates to milliseconds since epoch
      const startMillis = new Date(STT).getTime();
      const endMillis = new Date(ETT).getTime();

      // Calculate the difference in milliseconds
      const diffInMilliseconds = Math.abs(endMillis - startMillis);


      // Convert milliseconds to days, hours, minutes, and seconds
      const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);
      // Format the output string
      TT = "";
      if (days > 0) {
        TT += `${days} day${days > 1 ? "s" : ""} `;
      }
      if (hours > 0) {
        TT += `${hours} hour${hours > 1 ? "s" : ""} `;
      }
      if (minutes > 0) {
        TT += `${minutes} minute${minutes > 1 ? "s" : ""} `;
      }
      TT = (days * 24) + hours;
      TP = (Price * ((days * 24) + hours));
    }


    const cycle = req.session.cycle;
    var data = req.body;


    const STT = data.P_date + "T" + data.P_time;
    const ETT = data.D_date + "T" + data.D_time;
    const Price = cycle.Renting_price;

    // Calling function
    getTimeDifference(STT, ETT, Price)






    res.render("Reservationproc1", {

      cycle: req.session.cycle,
      user: req.session.userData,
      renting: {
        Price,
        TotalTime: TT,
        TotalPrice: TP,
        Pickup: {
          date: req.body.P_date,
          time: req.body.P_time,
        },
        Droping: {
          date: req.body.D_date,
          time: req.body.D_time
        }
      }
    })
  } catch (error) {
  }

});


router.post("/Booking", async (req, res) => {
  const Payment = req.body.Payment_Method
  if (Payment === "COD") {
    var status = "pending"
  } if (Payment === "Card") {
    var status = "success"
  } else {
    var status = "success"

  }


  const renting = await Cycle_renting.create({
    User_Id: req.body.User_Id,
    Cycle_Id: req.body.Cycle_Id,
    Pickup: {
      date1: req.body.date1,
      time1: req.body.time1
    },
    Droping: {
      date2: req.body.date2,
      time2: req.body.time2
    },
    Renting_Time: req.body.Renting_Time,
    Price: req.body.Price,
    Payment: {
      status: status,
      Payment_Method: req.body.Payment_Method,

      Card: {
        card_number: req.body.card_number,
        card_expiry: req.body.card_expiry,
        cvc: req.body.cvc,
        card_name: req.body.card_name
      }
      ,
      upi_payment: {
        upi_id: req.body.upi_id
      }
    }
  });
  res.render("ReservationComplete.ejs")

})


// History of reservations
router.get("/reservations", requireLogin, async (req, res) => {
  const userData = req.session.userData;
  const history = await Cycle_renting.find({ User_Id: userData._id })
  return res.render("history", {
    datas: history
  });
})


router.get("/invoice/:id", async (req, res) => {

  const template = fs.readFileSync('./views/Invoice.ejs', 'utf-8');

  // Compile the template
  const compiledTemplate = ejs.compile(template);

  // Example data (replace with your actual data)
  const cycle = await Cycle_renting.findById(req.params.id)
  // Generate the HTML string
  const invoiceHtml = compiledTemplate(cycle);

  // Generate PDF from HTML
  pdf.create(invoiceHtml).toStream((err, stream) => {
    if (err) {
      res.status(500).send('Error generating PDF');
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
      stream.pipe(res);
    }
  });
});





module.exports = router;
