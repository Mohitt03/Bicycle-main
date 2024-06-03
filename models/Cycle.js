const mongoose = require('mongoose')
const Schema = mongoose.Schema
var Cycle = new Schema({

    cycle_name: {
        type: String,
        required: true
    },
    cycle_img: {
        type: String,
        required: true
    },
    Renting_price: {
        type: Number,
        required: true
    },
    Deposit: {
        type: Number,
        required: true
    },
    Cycle_rating: {
        type: String,
        required: true
    },
    Dealer_name: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Iframe_link: {
        type: String,
        required: true
    },
    Dealer_rating: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    specification: {
        bike_type: {
            type: String,
            required: true
        },
        Age_Range: {
            type: String,
            required: true
        },
        Brand: {
            type: String,
            required: true
        },
        gear: {
            type: Number,
            required: true
        },
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Cycle', Cycle)
