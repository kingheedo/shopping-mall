const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data:{
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default:[]
    }
},{timestamps: true})


productSchema.index({
    title:'text',
    description: 'text'
},{
    weights:{
        title:5,
        description:1 
    }
})
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { Payment }