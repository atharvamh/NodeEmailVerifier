import nodemailer from "nodemailer";

const sendEmail = async(email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            service : process.env.EMAIL_SERVICE,
            port: 587,
            secure: true,
            auth : {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to: email,
            subject : subject,
            text : text
        })

        console.log("Email sent successfully")
    }

    catch(error) {
        console.log(`Email not sent : ${error}`);
    }
}

export default sendEmail;