require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server running on port "+PORT);
})




mongoose.connect(process.env.MONGODB_CONN_STRING, {
    useNewUrlParser: true,
     useUnifiedTopology: true,
    useCreateIndex: true},
      (err) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("Connected to database");
            }
      });



app.use("/users",router);
app.use(postRouter);

