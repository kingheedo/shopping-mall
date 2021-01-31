const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post("/addToCart", auth, (req, res) => {
    //auth를 통해서 user정보를 가져올수 있다.

    //먼저 User Collection에 해당 유저의 정보를 가져오기
    User.findOne({_id: req.user._id},
        (err, userInfo) => {


    //가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어있는지 확인
            let duplicate = false
            userInfo.cart.forEach((item) => {
                if(item.id ===  req.body.productId){
                    duplicate = true;
                }
            })
            //상품이 이미 있을때
            
            if(duplicate) {
                User.findOneAndUpdate(
                    {_id: req.user._id, "cart.id" : req.body.productId},
                    {$inc: {"cart.$.quantity": 1}},
                    {new: true}, //업데이트된 정보를 받기위해서 new: true 설정
                    (err,userInfo) =>{
                        if(err) return res.json({success:false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
            //상품이 이미 있지 않을때
            
            else{
                User.findOneAndUpdate(
                    {_id: req.user._id},
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                data: Date.now()
                            }
                        }
                    },
                    {new: true},
                    (err, userInfo) => {
                        if(err) return res.json({success: false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )

            }
        })
    


});

router.get('/removeFromCart', auth, (req, res) =>{

    //먼저 cart 안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull":
            {"cart": {"id": req.query.id}}
        },
        {new:true},
        (err, userinfo) =>{
            let cart = userinfo.cart;
            let array = cart.map(item =>{
                return item.id
            })
    //product collection에서 현재 남아있는 상품들의 정보를 가져오기
    

      // productIds = [13213123', '1231414','142124124'] 이런식으로 바꿔주기
            
            Product.find({_id: {$in:array}})
            .populate('writer')
            .exec((err,productInfo) => {
                return res.status(200).json({
                    productInfo,
                    cart
                })
            })
        }
    )



})
router.post('/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {};

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history


    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})
module.exports = router;
