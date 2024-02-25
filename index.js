import express, { response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "./database/Models/User.js";
const app = express();

app.use(express.urlencoded({ extended: true }));

// Signup route
app.post("/auth/signup", (req, res) => {
  verify(req.body.credential).then((data) => {
    if (data instanceof User) {
        res.send({
            token: req.body.credential
        });
    }
  }).catch((error) => {
    console.log(error);
  })
});

async function verify(token) {
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
    return user.save();
  }

app.listen(4000, () => {
  console.log("app is running");
});
