const mongoose = require('mongoose')
const Schema = mongoose.Schema
var Cycle_renting = new Schema({
    User_Id: {
        type: String,
        required: true
    },
    Cycle_Id: {
        type: String,
        required: true
    },
    Pickup: {
        date1: {
            type: String,
            required: true
        },
        time1: {
            type: String,
            required: true
        }
    },
    Droping: {
        date2: {
            type: String,
            required: true
        },
        time2: {
            type: String,
            required: true
        }
    },
    Renting_Time: {
        type: String,
        required: true
    },
    Price: {
        type: String,
        required: true
    },
    Payment: {
        status: {
            type: String,
            required: true
        },
        Payment_Method: {
            type: String,
            required: true
        },
        Card: {
            card_number: {
                type: Number
            },
            card_expiry: {
                type: Number
            },
            cvc: {
                type: Number
            },
            card_name: {
                type: String
            }
        },
        upi_payment: {
            upi_id: {
                type: String
            }
        }

    }

},

    {
        timestamps: true
    }
)
// Define function to check if reservation has expired
// Parking_Reservation.methods.isExpired = function() {
//     const now = moment();
//     const reservationEnd = moment(this.reservationTime).add(this.reservationDuration, 'minutes');
//     return now.isAfter(reservationEnd);
//   };
module.exports = mongoose.model('Cycle_renting', Cycle_renting)