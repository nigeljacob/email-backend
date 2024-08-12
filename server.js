import express from 'express';
import nodemailer from 'nodemailer';
import serverless from 'serverless-http';
import cor from 'cors';
import { USERNAME, PASSWORD } from './config';

const app = express();

// Transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: USERNAME,
      pass: PASSWORD,
    },
  });

app.use(express.json());
app.use(cor())
app.use(express.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Email Backend!' });
});

app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    console.log("request")
  
    const mailOptions = {
      from: USERNAME,
      to: to,
      subject: subject, 
      text: text,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Email sent: ' + info.response);
    });
  });
  

app.listen(3000, () => {console.log("Server listeneing on port 3000")});

export const handler = serverless(app);
