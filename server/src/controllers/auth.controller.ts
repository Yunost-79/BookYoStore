import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/user.model';
import generateTokenAndSetCookie from '../token/generateTokenAndSetCookie';
import { EStatusCodes } from '../types/Enums';

type TypedRequestBody<T> = Request<{}, {}, T>;

interface RequestBody {
  email: string;
  username: string;
  password: string;
  rePassword: string;
  profileAvatar: string;
}

//Sign Up controller

export const signup = async (req: TypedRequestBody<RequestBody>, res: Response) => {
  try {
    const { email, username, password, rePassword } = req.body;
    if (password !== rePassword) {
      return res.status(EStatusCodes.BAD_REQUEST).json({ error: "Passwords don't match" });
    }

    const currentUser = await User.findOne({ username });

    if (currentUser) {
      return res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Username already exists' });
    }
    const currentEmail = await User.findOne({ email });

    if (currentEmail) {
      return res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const avatarColor = 'random';
    const avatarSize = 128;

    const profileAvatar = `https://ui-avatars.com/api/?name=${username}&background=${avatarColor}&size=${avatarSize}`;

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      profileAvatar,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(EStatusCodes.CREATED).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profileAvatar: newUser.profileAvatar,
      });
    } else {
      res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Invalid user data' });
    }
  } catch (e) {
    const err = e as Error;

    console.log('Error in signup controller', err.message);
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

//Login controller

export const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail);

    let currentUser;

    if (isEmail) {
      currentUser = await User.findOne({ email: usernameOrEmail });

      if (!currentUser) {
        return res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Invalid email' });
      }
    } else {
      currentUser = await User.findOne({ username: usernameOrEmail });

      if (!currentUser) {
        return res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Invalid username' });
      }
    }

    const isCorrectPassword = await bcrypt.compare(password, currentUser.password || '');
    
     if (!isCorrectPassword) {
       return res.status(EStatusCodes.BAD_REQUEST).json({ error: 'Invalid password' });
     }

    generateTokenAndSetCookie(currentUser._id, res);

    res.status(EStatusCodes.OK).json({
      _id: currentUser._id,
      username: currentUser.username,
      email: currentUser.email,
      profileAvatar: currentUser.profileAvatar,
    });
  } catch (e) {
    const err = e as Error;

    console.log('Error in login controller', err.message);
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

//Logout controller

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(EStatusCodes.OK).json({ message: 'Logged out successfully' });
  } catch (e) {
    const err = e as Error;

    console.log('Error in logout controller', err.message);
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
