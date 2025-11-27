const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const controler = require('./Controler');
const upload =require('./middelwares/multer')
const middel = require('./middelwares/athentication');


router.post('/register',[

   body('fullname').notEmpty().withMessage('fullname is required'),
   body('email').isEmail().withMessage('Invalid email format'),
   body('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters'),

], controler.register
);
router.post('/login',[
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
], controler.login);
router.post('/productcreate',upload.single('image'),[
    body('name').notEmpty().withMessage('name enter '),
     body('price').notEmpty().withMessage('price enter'),
], controler.productcreate);
router.post('/orders',middel.Loggined,controler.createOrder);
router.get('/productfind',controler.getProducts);
router.post('/tablbooking',middel.Loggined,controler.createReservation)
router.post('/ADDtocart',middel.Loggined,controler.ADDtocarte)
router.get('/cartproduct',middel.Loggined,controler.Cartilling)
router.get('/bookst',middel.Loggined,controler.getReservationsByUser)
router.get('/getorder',middel.Loggined,controler.getOdersByUser)
module.exports = router;