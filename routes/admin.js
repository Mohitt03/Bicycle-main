const { Router } = require("express");

axios = require("axios")

const Cycle = require("../models/Cycle");
const Reservation = require("../models/Cycle_renting");
const User = require("../models/user");
const Cycle_renting = require("../models/Cycle_renting");
const router = Router();

router.get("/admin", (req, res) => {
    return res.render("Admin");
});


router.get("/user-Profile", (req, res) => {
    return res.render("users-profile");
});

router.get("/pages-faq", (req, res) => {
    return res.render("pages-faq");
});

router.get("/pages-contact", (req, res) => {
    return res.render("pages-contact");
});

router.get("/pages-register", (req, res) => {
    return res.render("pages-register");
});

router.get("/pages-login", (req, res) => {
    return res.render("pages-login");
});

router.get("/pages-blank", (req, res) => {
    return res.render("pages-blank");
});




router.get("/renting", async (req, res) => {

    const renting = await Cycle_renting.find();
    return res.render("Renting", { datas: renting });
});

router.get('/renting/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const renting = await Cycle_renting.findByIdAndRemove(id);


        if (!renting) {
            return res.status(404).json({ message: 'Not found' });
        }
        return res.redirect('back');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

// Users

router.get("/users", async (req, res) => {

    const user = await User.find()
    return res.render("users", { datas: user });
});


router.get('/users/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const user = await User.findByIdAndRemove(id);


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.redirect('back');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

// Cycle

router.get("/cycle", async (req, res) => {

    const cycle = await Cycle.find()
    return res.render("Cycle", { datas: cycle });
});


// Creating Cycle

router.get("/create", (req, res) => {

    return res.render("createcycle", {
        heading: "New Cycle",
        submit: "Create"
    });
});

router.post("/create", async (req, res) => {


    const cycle = await Cycle.create({

        cycle_name: req.body.cycle_name,
        cycle_img: req.body.cycle_img,
        Renting_price: req.body.Renting_price,
        Deposit: req.body.Deposit,
        Cycle_rating: req.body.Cycle_rating,
        Dealer_name: req.body.Dealer_name,
        City: req.body.City,
        Iframe_link: req.body.Iframe_link,
        Dealer_rating: req.body.Dealer_rating,
        location: req.body.location,
        specification: {
            bike_type: req.body.bike_type,
            Age_Range: req.body.Age_Range,
            Brand: req.body.Brand,
            gear: req.body.gear
        }
    })
    res.redirect("/admin/Cycle");
})

// Updating Parking

router.get("/edit/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const cycle = await Cycle.findById(id);

        return res.render("createcycle", {
            heading: "Edit Cycle data",
            submit: "Update",
            cycle
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cycle = await Cycle.findByIdAndUpdate(id, {

            cycle_name: req.body.cycle_name,
            cycle_img: req.body.cycle_img,
            Renting_price: req.body.Renting_price,
            Deposit: req.body.Deposit,
            Cycle_rating: req.body.Cycle_rating,
            Dealer_name: req.body.Dealer_name,
            City: req.body.City,
            Iframe_link: req.body.Iframe_link,
            Dealer_rating: req.body.Dealer_rating,
            location: req.body.location,
            specification: {
                bike_type: req.body.bike_type,
                Age_Range: req.body.Age_Range,
                Brand: req.body.Brand,
                gear: req.body.gear
            }   
        });
        res.redirect("/admin/cycle");

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//  Delete cycle

router.get('/cycle/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const cycle = await Cycle.findByIdAndRemove(id);


        if (!cycle) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.redirect('back');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

// Admin Data


const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${day}-${month}-${year}`;

router.get("/admin2", async (req, res) => {

    const user = await User.find()
    const parking = await Parking.find()
    const reservation = await Reservation.find()
    const numberStr = `${currentDate}`;

    // const search = req.query.search || "";
    const booking = await Reservation.findOne({ date: currentDate })

    return res.render("Admin2", {
        users: user,
        parkings: parking,
        reservations: reservation
    });

});

module.exports = router;