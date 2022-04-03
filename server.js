import express from "express";
import http from "http";
import "dotenv/config";
import connect from "./config/db.js";
import cors from "cors";
import User from "./models/user.js";
import Token from "./models/token.js";
import crypto from "crypto";
import sendEmail from "./utils/emailService.js";

connect();

const app = express();

const router = express.Router();

app.use(cors());
app.use(express.json());
app.use("/api", router);

router.post("/", async (req, res) => {
    try{
        let user = await User.findOne({email : req.body.Email});

        if(user){
            res.status(400).send("User already registered. Try signing in!");
        }
        else{
            user = await new User({
                name: req.body?.Name,
                email: req.body?.Email,
                password: req.body?.Password // hash this later with salting
            }).save();
        
            let token = await new Token({
                userId : user._id,
                token: crypto.randomUUID()
            }).save();

            const text = ""
            const message = `
                <h2>Please click the below link to verify your email</h2>
                <a href=${process.env.BASE_URL}/user/verify/${user._id}/${token.token} target="_blank">
                    Email Verification Link
                </a>
                `
            try{
                sendEmail(user.email, "Verify Email For Piper Account", text , message);

                res.status(200).send(`User successfully registered. 
                An Email has been sent to the registered mail id. Please verify`);
            }
            catch(error){
                console.log(error);
            }
        }
    }

    catch(error){
        res.status(400).send("An error occured");
    }
})

router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.Email})

        if(!user){
            return res.status(400).send('Username is incorrect or user is not registered');
        }

        else{
            if(!user.verified){
                return res.status(400).send("User Email not verified. Please check your inbox");
            }

            else{
                if(user.password === req.body.Password){
                    return res.status(200).send("User Authenticated");
                }

                else{
                    return res.status(400).send("Password is incorrect")
                }
            }
        }
    }

    catch(error){
        res.status(400).send("An error occured");
    }
})

router.get('/user/verify/:id/:token', async (req, res) => {
    
    try {
        const user = await User.findOne({_id : req.params.id});
        if(!user){
            return res.status(400).send('Invalid Link')
        }

        else{
            const token = await Token.findOne({
                userId : user._id,
                token: req.params.token
            })
    
            if(!token){
                return res.status(400).send('Invalid Link')
            }

            else{
                await User.updateOne({_id : user._id}, {verified: true});
                await Token.findByIdAndRemove(token._id)
            }

            res.status(200).sendFile('static/success.html', {root: process.cwd()})
        }
    } catch (error) {
        console.log(error);
        res.status(400).sendFile('static/error.html', {root: process.cwd()})
    }
})

const port = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(port, () => console.log(`Server listening on port ${port}`));