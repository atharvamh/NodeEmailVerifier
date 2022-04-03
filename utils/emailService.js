import nodemailer from "nodemailer";

const sendEmail = async(email, subject, text, html = null) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587, 
            auth : {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to: email,
            subject : subject,
            text : text,
            html : html
        })

        console.log('Email sent successfully')
    }

    catch(error) {
        return error;
    }
}

export default sendEmail;