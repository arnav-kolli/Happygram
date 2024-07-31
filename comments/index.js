import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())
const winlog = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.prettyPrint()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs.log' })
    ]
  });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  const authenticateToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token)
    if (!token) return res.sendStatus(401);
    // console.log(process.env.JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err){
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
}
const commentSchema = new mongoose.Schema({
  postid: mongoose.Schema.Types.ObjectId,
  authorid: mongoose.Schema.Types.ObjectId,
  authorUser: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

//adding
app.post('/comments', authenticateToken, async (req, res) => {
    const { postid, text, authorUser } = req.body;
    console.log(req.body);
    console.log(postid,text)
    const newComment = new Comment({ postid, authorid: req.user.id, text ,authorUser});
  
    try {
      const savedComment = await newComment.save();
      res.status(200).json(savedComment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

//getting comments for a particular post
app.get('/comments/:postid',async(req,res)=>{
    try{
      // console.log("A")
        const postid = req.params.postid;
        const comments = await Comment.find({postid});
        //  console.log(comments)
        res.status(200).json(comments);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

app.delete('/comments/:id',authenticateToken,async(req,res)=>{
    const commentid = req.params.id
    console.log(req)
    try {
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        const postResponse = await fetch(`http://localhost:3001/posts/${comment.postid.toString()}/author`);

        const postData = await postResponse.json();

        // Check if the requester is the comment's author or the post's author
        if (comment.authorid.toString() !== req.user.id && postData.authorId.toString() !== req.user.id) {
            return res.status(403).send('User not authorized to delete this comment');
        }

        await Comment.deleteOne({ _id: commentid });
        res.send('Comment successfully deleted');
        } 
        catch (err) {
            res.status(500).json({ message: err.message });
        }
})
  


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Comments service running on port ${PORT}`);
});
