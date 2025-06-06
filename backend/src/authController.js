
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req, res) {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if(!name|| !email || !password){
        return res.status(400).json({message:"All field are required"})
    }
    if(existing) {
       return res.status(400).json({ message: "Email already exists" });}
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ 
        name, 
        email, 
        password: hash });

    const token = jwt.sign({
        id: user._id, 
        email: user.email, 
        name: user.name 
    }, process.env.JWT_SECRET);
    res.json({ token });
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ 
        id: user._id,
        email: user.email, 
        name: user.name 
    }, process.env.JWT_SECRET);
    res.json({ token });
}
