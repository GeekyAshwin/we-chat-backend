import express, { response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "./database/Models/User.js";
import { Message } from "./database/Models/Message.js";
import { Server } from "socket.io";
import cors from "cors";
import { OAuthToken } from "./database/Models/OAuthToken.js";
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

const app = express();
const secretKey = 'your_secret_key';

app.use(express.urlencoded({ extended: true }));
app.user
app.use(cors({
  origin: 'https://chatwiner.netlify.app',
}));
app.use(cors({origin: '*'}));
app.use(express.json());
app.options('*', function (req,res) { res.sendStatus(200); });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://chatwiner.netlify.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://chatwiner.netlify.app');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });
// create new server
const server = new Server({
  cors: { origin: 'https://chatwiner.netlify.app' }
});
// Add headers before the routes are defined
server.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://chatwiner.netlify.app');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// Signup route
app.post("/auth/signup", (req, res) => {
  console.log(1);
  verify(req.body.credential).then((data) => {
    if (data instanceof User) {
      res.redirect();
    }
  }).catch((error) => {
    console.log(error);
  })
});

// api to list all the users
app.get('/users', (req, res) => {
  const token = req.headers.authorization;
  getUserByToken(token).then((user_id) => {
    console.log(user_id);
    User.findAll({
      where: {
        id: {
          [Op.not]: user_id
        }     
      }   
    }).then((data) => {
      res.send({
        data: data
      });
    });
  });
  
});

// api to list all the message between two users
app.get('/users/:id/messages', (req, res) => {
  Message.findAll({
    where: {
      sender_id: 1,   //auth user id
      receiver_id: req.params.id
    }
  }).then((data) => {
    res.send({
      data: data
    });
  })
});

// api to register user using email and password
app.post('/register', cors(), (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  let user = User.build({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  user.save();
  if (user) {
    res.send({
      data: user,
      status: 200
    });
  } else {
    res.send({
      data: user,
      status: 422
    });
  }
});

// api to login user using email and password
app.post('/login', (req, res) => {
  login(req.body.email , req.body.password).then((token) => {
    if (token) {
      res.send({
        token: token,
        status: 200,
        message: 'login success',
      });
    } else {
      res.send({
        data: data,
        status: 422,
        message: 'invalid credentials',
      });
    }
  })
  
});

// login method
async function login(email, password) {
  let user = await User.findOne({
    where: {
      email: email,
      password: password,
    }
  });
  const token = jwt.sign({id: user.id}, secretKey);

  const oAuthToken = OAuthToken.build({
    user_id: user.id,
    token: token,        
  });
  oAuthToken.save();
  return oAuthToken.token;
}

server.on('connection', (socket) => {
  socket.on('message', (data) => {
    socket.broadcast.emit('received', {
      data: data,
      message: 'Message sent from server.'
    })
  })
})

app.post('/message', (req, res) => {
  let userMessage = req.body.message;
  addMessage(userMessage).then((data) => {
    
    res.send({ message: 'Messase sent' });
  })
});

async function addMessage(userMessage) {
  let data = {
    sender_id: 1,
    receiver_id: 1,
    message: userMessage,
  }
  let message = Message.build(data);
  if (message.save() instanceof Message) {
    return true;
  } else {
    return false;
  }
}

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

async function getUserByToken(token) {
  const oAuthToken = await OAuthToken.findOne({
    where: {
      token: token
    }
  });
  return oAuthToken.dataValues.user_id;
}

server.listen(3000);

app.listen(4000, (req, res) => {
  console.log("app is running");
});


