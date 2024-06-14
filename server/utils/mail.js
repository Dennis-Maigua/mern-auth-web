const nodeMailer = require('nodemailer');

exports.mailTransport = async (req, res, emailData) => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.APP_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    return transporter
        .sendMail(emailData)
        .then(info => {
            const { email } = req.body;

            console.log(`Email sent: ${info.response}`);
            return res.json({
                message: `An email link has been sent to ${email} for more instructions.`
            });
        })
        .catch(err => {
            console.log(`Email not sent: ${err}`);
            return res.status(500).json({
                error: 'Problem sending email! Please try again.'
            });
        });
};