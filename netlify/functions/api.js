// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from "express";
import serverless from "serverless-http";
import express, { response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "./database/Models/User.js";
import { Message } from "./database/Models/Message.js";
import { Server } from "socket.io";
import cors from "cors";
import { OAuthToken } from "./database/Models/OAuthToken.js";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

const api = express();

const router = Router();


router.get("/hello", (req, res) => res.send("Hello World!"));

// Signup route
router.post("/auth/signup", (req, res) => {
    verify(req.body.credential).then((data) => {
      if (data instanceof User) {
        res.redirect();
      }
    }).catch((error) => {
      console.log(error);
    })
  });

  async function verify(token) {
    console.log(token)
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '160025112705-092rhre4c3vch7jd1bj0h3fqcs68q67q.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
    });
    const data = ticket.getPayload();
    const user = User.build({
      name: data.name,
      email: data.email,
      password: '',
      picture: data.picture,
      google_id: data.sub,
    });
    user.save();
    createOAuthToken(data.email, token);  
    return user;
  }

  function createOAuthToken(email, token) {
    const oAuthToken = OAuthToken.build({
      email: email,
      token: token,
    });  
    oAuthToken.save();
  }
api.use("/api/", router);

export const handler = serverless(api);
