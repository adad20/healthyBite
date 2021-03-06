const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Product = require('../../models/Product');
const AdminOrder = require('../../models/AdminOrder');
const Payment = require('../../models/Payment');
const User = require('../../models/User');

// @route   POST api/order
// @desc    Order Successful
// @access  Private

router.post('/', auth.user, async (req, res) => {
    try {
        let executed = false;
        let profile = await Profile.findOne({user: req.user.id});
        let user = await User.findById(req.user.id);
        if(!profile) {
            res.status(400).json({msg: 'Update your profile'});
        }
        
        let { items, order_id, mode, amount } = req.body;
        for(let i=0 ; i<items.length ; i++) {
            let item = await Product.findOne({name: items[i].name});
            let Stock = item.stock;
            if(Stock >= items[i].quantity) {
                let left = Stock - items[i].quantity;
                await Product.findOneAndUpdate({name: items[i].name}, {$set: {stock: left}}, {useFindandModify: false});
            } else{
                res.status(400).json({msg: 'Order Can\'t\ be placed'});
                executed = true;
                break;
            }
        }
        let status = true;
        if(!executed) {
            await profile.updateOne({$push: {orders: {items, order_id, mode, status}}});
            if(mode === 'online') {
                let payment_details = await Payment.findOne({o_id : order_id});
                if(!payment_details) {
                    res.status(200).json({msg: 'Try again sometime'});
                }
                let adminDetails = {
                    name: user.name,
                    address: profile.address,
                    pincode: profile.pincode,
                    amount: payment_details.amount,
                    method: 'online',
                    o_id: order_id,
                    status: payment_details.status,
                    orderItems: items
                }
                let data_to_save = new AdminOrder(adminDetails);
                await data_to_save.save();
                res.send('Added to db');
            }
            if(mode === 'offline') {
                let adminDetails = {
                    name: user.name,
                    address: profile.address,
                    pincode: profile.pincode,
                    amount: amount,
                    method: 'Cash on delivery',
                    status: 'Not paid',
                    orderItems: items,
                    o_id: order_id
                }
                let data_to_save = new AdminOrder(adminDetails);
                await data_to_save.save();
                res.send('Added to db');
            }
        }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});

// @route   GET api/order
// @desc    get all orders of user
// @access  Private
router.get('/', auth.user, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const orders = await profile.orders;
        if(!orders.length) {
            res.status(200).json({msg: "No Order"});
        } else {
            res.send(orders);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
