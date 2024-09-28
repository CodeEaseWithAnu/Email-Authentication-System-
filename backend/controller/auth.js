import User from '../model/User.js'

import crypto from 'crypto'

import {sendOtp} from '../utils/sendMail.js'
import { log } from 'console';

export const register = async (req,res)=>{
        const {email,password} = req.body;

        try{

            const existUser = await User.findOne({email})
            if(existUser){
                return   res.status(400).json({message:'User already exist'})
            }
            const newUser = new User({email,password})
            await newUser.save();
            return res.status(201).json({message:'User registered successfilly'})

        }catch(err){
            return res.status(500).json({message:'Server error'})
        }
}

export const generateOpt = async (req,res)=>{

    const {email} = req.body;
try{
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({message:'User not found'});
    }

    const otp= crypto.randomInt(100000,999999).toString();
    user.otp = otp;console.log(otp);
    
    user.optExpires = Date.now() + 10*60*1000;
    await user.save();

    await sendOtp(email,otp);
    return res.status(200).json({message:'OTP sent to email'});
}catch(err){
    return res.status(500).json({message:'Server error'})
}
}

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      console.log(`${email} === ${otp}`);
  
      const user = await User.findOne({ email });console.log(`${user}`);
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      console.log(user.otp);
  
      if (user.otp !== otp || user.optExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Clear OTP after verification
      user.otp = null;
      user.optExpires = null;
      await user.save();
  
      return res.status(200).json({ message: 'OTP verified, logged in successfully' });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  