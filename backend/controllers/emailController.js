const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`
    }
})

async function sendEmail(req, res) {
    const { destinatary, subject, content, link, start, end, product, product_link } = req.body
    //console.log(destinatary)
    try {
        const sendOption = {
            from: 'correo@prueba.com',
            to: destinatary.join(','),
            subject: subject,
            text: content + "\n\nProducto evaluado " + product + ", enlace: " + product_link +
                "\nDisponible desde el " + start.substring(0, 10) + " " + start.substring(11, 16) +
                " hasta el " + end.substring(0, 10) + " " + end.substring(11, 16) +
                "\n\nAccesible mediante el siguiente enlace " + process.env.DIRECTION + link
        }

        const info = await transporter.sendMail(sendOption)
        //console.log('Correo enviado:', info.messageId)

        res.status(200).json({ message: 'Correo enviado correctamente' })
    } catch (error) {
        //console.error('Error al enviar el correo:', error)
        res.status(500).json({ error: 'Error al enviar el correo' })
    }
}

module.exports = {
    sendEmail
}