const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SMTP_CLIENT_API_KEY);

module.exports = function ({ emailTo, emailBody, emailSubject } = {}) {

    if (!emailTo) {
        return { success: false, message: 'Senders email required' }
    }

    const msg = {
        to: emailTo,
        from: process.env.APP_OFFICIAL_EMAIL, // Use the email address or domain you verified above
        subject: emailSubject,
        html: emailBody,
    };

    sgMail
        .send(msg)
        .then(
            () => {
                return { success: true }
            },
            (error) => {

                return { success: false, message: error }

                // if (error.response) {
                //     console.error(error.response.body)
                // }

            });

}   