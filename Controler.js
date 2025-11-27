const {validationResult}=require('express-validator')
const moddel = require('./models/models.user')
const Order = require('./models/order')
const product = require('./models/Product')
const bcrypt = require('bcrypt');
const Reservation = require('./models/tablelbooking')

module.exports.register =async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
const {fullname,email,password}=req.body;

   const hashedPassword = await bcrypt.hash(password, 10);
const user = await moddel.create({
    fullname: fullname,
    email: email,
    password: hashedPassword
});

const token = user.generateAuthToken();
  res.status(200).json({token,user});
    res.send('User registered successfully');
}
module.exports.login =async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body;
const user = await moddel.findOne({email}).select('+password');

if (!user) {
    res.status(400).json("user is not found");
    return;
}
    
    const cmpar = await bcrypt.compare(password, user.password);
    if(!cmpar){
        return res.status(400).json("invalid password")
    }

    const token = user.generateAuthToken();
    res.status(200).json({token,user});
    res.status(200).json({ message:'logine sucssec fully',token});

}
module.exports.productcreate= async(req,res)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
   }

   const {name,price,discount}=req.body;

    const pngBuffer = await sharp(req.file.buffer).png().toBuffer();

    const products = await product.create({
      image: {
        data: pngBuffer,
        contentType: 'image/png'   // 👈 अब PNG के रूप में save होगा
      },
       name:name,
       price:price,
       discount:discount
   });
   res.status(200).json({message:'Product created successfully', products});
  }
exports.createOrder = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log(productId);

    // items = [{ product_id, quantity }]
    let totalPrice = 0;
    const orderItems = [];

    const products = await product.findById({ _id: productId });
    console.log("Product found:", products);

    if (!products) {
        return res.status(404).json({ error: "Product not found" });
      }

      const price = products.price * 1; // Assuming quantity is 1 for now
      totalPrice += price;

      orderItems.push({
        product_id: products._id,
        quantity: 1,
        price: products.price,
      });
    

    const newOrder = new Order({
      items: orderItems,
      total_price: totalPrice,
    });

    await newOrder.save();
 await moddel.findByIdAndUpdate(
      req.user._id, // मान लीजिए req.user._id middleware से आ रहा है
      { $push: { Orderr: products._id } },
      { new: true }
    );
    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await product.find();
    const transformedProducts = products.map(p => {
      const obj = p.toObject();
      if (p.image && p.image.data) {
        obj.image = `data:${p.image.contentType};base64,${p.image.data.toString('base64')}`;
      }
      return obj;
    });

    res.status(200).json({ products: transformedProducts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.createReservation = async (req, res) => {
  try {
    // नया reservation object बनाइए
    const reservation = new Reservation(req.body);

    // MongoDB में save करें
    await reservation.save();

    // Reservation को user की tablbook array में push करें
    await moddel.findByIdAndUpdate(
      req.user._id, // मान लीजिए req.user._id middleware से आ रहा है
      { $push: { tablbook: reservation._id } },
      { new: true }
    );

    // Success response
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.ADDtocarte = async (req,res) =>{
const {productId}=req.body


  const add = await moddel.findById({_id:req.user._id})
 add.cart.push(
  productId
 );
   await add.save();
  
  res.status(200).json({message:"scussecfully add to cart"});
}
exports.Cartilling = async (req, res) => {
  try {
    const user = await moddel.findById(req.user._id).populate("cart");

    // user.cart एक array है
    const transformedProducts = user.cart.map(p => {
      const obj = p.toObject();
      if (p.image && p.image.data) {
        obj.image = `data:${p.image.contentType};base64,${p.image.data.toString('base64')}`;
      }
      return obj;
    });

    res.status(200).json({ products: transformedProducts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getReservationsByUser = async (req, res) => {
  try {
    
    const reservations = await moddel.findById({_id:req.user._id }).populate("tablbook");

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: 'No reservations found for this user' });
    }

    res.status(200).json({reservations});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getOdersByUser = async (req, res) => {
  try { 
    const Orderr = await moddel.findById({_id:req.user._id }).populate("Orderr");


    if (!Orderr || Orderr.length === 0) {
      return res.status(404).json({ message: 'No Orderr found for this user' });
    }

    res.status(200).json({Orderr});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};