const http = require("http");
const nodemailer = require("nodemailer");
require('dotenv').config();

const message =`
        <h1 style="color:blue">Hello this is a text mail heading!</h1><br>
        <p>Hello this is a text mail paragraph</p>
        <button><a href='/www.google.com'>Go To Google</a></button>
    `
console.log(message)
const server = http.createServer((request, response) => {
    const auth = nodemailer.createTransport({
        service: "gmail",
        secure : true,
        port : 465,
        auth: {
            user: process.env.USER_EMAILL,
            pass: process.env.APP_PASSWORD
        }
    });

    const receiver = {
        from : "babayaga@gmail.com",
        to : "nobimi1008@nomrista.com",
        subject : "Node Js Mail Testing!",
        html : message
    };

    auth.sendMail(receiver, (error, emailResponse) => {
        if(error)
        throw error;
        console.log("success!");
        response.end();
    });
    
});

server.listen(3000, () => console.log("Severing Listening...."));