require('dotenv').config();

module.exports = {
    port                : process.env.PORT,
    mongodb_url         : process.env.MONGODB_URL,
    ip_pubblic          : process.env.IPPUBLIC_URL,
    rabbitmq_url        : process.env.RABBITMQ_URL,
    email_user          : process.env.EMAIL_USER,
    email_pass          : process.env.EMAIL_PASS,
    email_receiver      : process.env.EMAIL_RECEIVER,
    hardware_variation  : process.env.HARDWARE_VARIATION,
};