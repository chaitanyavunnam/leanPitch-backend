var express = require('express');
var mongoose=require('mongoose');
const cors = require("cors");
var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
const pointsData={
  onlineClass: 1000,
  quiz: 200,
  crashCourse: 500,
}


const db = mongoose.createConnection("mongodb://localhost:27017/Leanpitch", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// schemas
const userSchema = new mongoose.Schema({
  userName: String,
  points: Number,
});
const userModel = db.model("user", userSchema);

const isNullOrUndefined = (val) => val === null || val === undefined;

app.post("/addUpdateUser",async (req,res)=>{
  const userName=req.body.userName;
  console.log(req.body.userName)
  const result=await userModel.findOne({userName: userName});
  if(isNullOrUndefined(result)){
    const newUser = new userModel({ userName: userName, points: 0 });
    await newUser.save();
    res.send({userName: userName,
               points: 0});
  }
  else{
    res.send({
      userName: result.userName,
      points: result.points
    })
  }
})

app.get("/topUsers", async (req,res)=>{
  const result=await userModel.find({}).sort({points: -1}).limit(10)
  res.send(result);
})

app.get("/sendPointsData",(req,res)=>{
  res.send(pointsData);
})

app.post("/updatePoints",async (req,res)=>{
  const type=req.body.type;
  const userName=req.body.userName;
  const user=await userModel.findOne({userName: userName});
  if(type==="quiz"){
    user.points=user.points+pointsData.quiz;
    user.save()

  }
  if(type==="onlineClass"){
    user.points=user.points+pointsData.onlineClass;
    user.save()

  }
  if(type==="crashCourse"){
    user.points=user.points+pointsData.crashCourse;
    user.save()
  }
  console.log(user)
  res.send(user);


})









let port=9999;
app.listen(port,()=>{
  console.log("listening to port",port);
}
)

module.exports = app;

