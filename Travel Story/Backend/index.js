require("dotenv").config();
const config=require("./config.json")
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const express=require("express");
const { authenticate } =require("./utilities");
const User =require("./Model/User");
const travel =require("./Model/story");
const upload=require("./multer");
const fs=require("fs");
const path=require("path");
const {error} = require("console");         
const story = require("./Model/story");


mongoose.connect(config.connectionString)
const app=express();


app.use(express.json());
app.use(cors({origin:"*"}));

// Create account

app.post("/create-account",async (req,res) => {
    const {fullname,email,password }=req.body;

    if(!fullname || !email || !password){
        return res.
        status(400)
        .json({error:true,message:"All credential needed"});
    }

    const present=await User.findOne({email});
    if(present){
       return res.
        status(400)
        .json({error:true,message:"Already existed"});  
    }

    const hash=await bcrypt.hash(password,10);
    const user=new User({
        fullname, 
        email,
        password:hash,
    });
    await user.save();
    const accessToken=jwt.sign({userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.status(201).json(
        {
            error:false,
            user:{fullname:user.fullname,email:user.email},
            accessToken:accessToken,
            message:"Registration Successfull",
        }
    );
});

//login

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const present = await bcrypt.compare(password, user.password);
    if (!present) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
    );

    // console.log("Access Token generated:", accessToken); // Log the token

    return res.json({
        error: false,
        message: "Login Successful",
        user: { fullname: user.fullname, email: user.email },
        accessToken: accessToken, // Ensure this key matches what your frontend expects
    });
});


// get the user

app.get("/get-user", authenticate, async (req, res) => {
    const {userId}=req.user;
    const isUser=await User.findOne({_id:userId});
    if(!isUser) return res.sendStatus(404);
    return res.json({
        user:isUser,
        message:"",
    })
});

// Route to handle upload image 

app.post('/image-upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded" });
        }

        const imageurl = `http://localhost:8000/uploads/${req.file.filename}`;
        return res.status(200).json({ imageurl });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

// Delete file from uploads folder

app.delete("/delete-image", async (req,res)=>{
    const {imageUrl}=req.query;
    if(!imageUrl){
        return res.status(400).json({error:true,message:"Image parameter is required"})
    }

    try{
        const filename=path.basename(imageUrl)
        const filepath=path.join(__dirname,'uploads', filename);
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
             res.status(200).json({error:false,message:"Image deleted successfully"});
        }
        else{
            
             res.status(200).json({error:true,message:"Image is not found"});
        }

    }catch(error){
         res.status(500).json({error:true,message:error.message});
    }

})

// serve static file from assets and uploads

app.use("/uploads",express.static(path.join(__dirname, "uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

//Add story 

app.post("/add-story",authenticate, async (req,res)=>{
  const {title,story,visitedLocation,imageUrl,visitedDate}=req.body;
  const {userId}=req.user;
  if(!title || !story || !visitedLocation ||!imageUrl ||  !visitedDate){
    return res.status(400).json({error:true,message:"All fields are required"});
  }
  const parseVisited=new Date(parseInt(visitedDate));
  try{
    const travelstory=new travel({
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,   
        visitedDate:parseVisited,
    });
    await travelstory.save();
    res.status(200).json({story : travelstory,message:'Added Successfully'})
  }
  catch(error){
    return res.status(400).json({error:true,message:error.message})
  }
})

// Get all story 

app.get("/get-all-story",authenticate,async (req,res)=>{
    const {userId}=req.user;
    try{
        const stories=await travel.find({userId:userId}).sort({
            isFavourite:-1,
        });
        res.status(200).json({stories:stories});
    }catch(error){
        return res.status(400).json({error:true,message:error.message});
    }
})

//edit story

app.put("/edit-story/:id" ,authenticate, async (req,res)=> {
    const { id }=req.params;
      const {title,story,visitedLocation,imageUrl,visitedDate}=req.body;
      const { userId }=req.user;

      if(!title || !story || !visitedLocation || !visitedDate){
        return res.status(400).json({error:true,message:"All fields are required"});
        }

        const parseVisited=new Date(parseInt(visitedDate));

    try{
        const Travelstory=await travel.findOne({ _id:id ,userId:userId});
        if(!Travelstory){
            return res.status(404).json({error:true,message:"Story not found"});
        }

        const defaulturl=`http://localhost:8000/assets/image.png`;

        Travelstory.title=title;
        Travelstory.story=story;
        Travelstory.visitedLocation=visitedLocation;
        Travelstory.imageUrl=imageUrl || defaulturl;
        Travelstory.visitedDate=parseVisited;

        await Travelstory.save();
        
        return res.status(200).json({story:Travelstory,message:"Story edited successfully"});
     }catch(error){
        return res.status(500).json({error:true,message:error.message});
    }

})

// Delete story
app.delete("/delete-story/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // Find the travel story by id and userId
        const travelStory = await travel.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        // Delete the travel story
        await travel.deleteOne({ _id: id, userId: userId });

        // Get the image URL and filename
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename);

        // Check if the file exists before attempting to delete it
        
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete image file:", err);
                } else {
                    console.log("Image file deleted successfully");
                }
            });

        res.status(200).json({ message: "Travel story deleted successfully" });
    } catch (error) {
        console.error("Error deleting travel story:", error);
        res.status(500).json({ error: true, message: error.message });
    }
});

// update fav

app.put("/update-isfavourite/:id",authenticate,async (req,res)=>{
    const {id}=req.params;
    const {userId}=req.user;
    const {isFavourite}=req.body;
    try{
        const Travelstory=await travel.findOne({_id:id,userId:userId});
        if(!Travelstory){
            return res.status(404).json({error:true,message:"Story is not found"});
        }
        Travelstory.isFavourite=isFavourite;
        await Travelstory.save();
        return res.status(200).json({story:Travelstory,message:"Updated successfully"});
    }catch(error){
        return res.status(500).json({error:true,message:error.message});
    }
})

//search by query

app.get("/search", authenticate, async (req, res) => {
    const { query } = req.query;  // Corrected to directly access 'query' from req.query
    const { userId } = req.user;  // Assuming req.user contains user information, like userId
    
    // Check if the query parameter is provided
    if (!query) return res.status(400).json({ error: true, message: "Query is not provided" });

    try {
        // Search for stories based on the query in the title, story, or visitedLocation
        const searchres = await travel.find({
            userId: userId,  // Search for stories by the authenticated user
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } }
            ]
        }).sort({ isFavourite: -1 });  // Sorting by 'isFavourite' in descending order
        
        // Return the search results as JSON
        if (searchres.length === 0) {
            return res.status(200).json({ stories: [] });  // No stories found
        }

        return res.status(200).json({ stories: searchres });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
});


// filter bw 2 dates

app.get("/travel-stories/filter", authenticate, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        // Validate startDate and endDate
        if (!startDate || !endDate) {
            return res.status(400).json({ error: true, message: "Start date and end date are required." });
        }

        const a = new Date(parseInt(startDate));
        const b = new Date(parseInt(endDate));

        // Check for valid date objects
        if (isNaN(a.getTime()) || isNaN(b.getTime())) {
            return res.status(400).json({ error: true, message: "Invalid date format." });
        }

        const filtered = await travel.find({
            userId: userId,
            visitedDate: { $gte: a, $lte: b },
        }).sort({ isFavourite: -1 });

        return res.status(200).json({ stories: filtered });
    } catch (error) {
        console.error("Error fetching travel stories:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
});

   
app.listen(8000);
module.exports=app;