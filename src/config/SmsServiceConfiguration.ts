export interface ISmsServiceConfiguration {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
}

export const Configuration: ISmsServiceConfiguration = {
    accountSid: process.env.SMS_CONNECTION,
    authToken: process.env.SMS_SECRET,
    phoneNumber: process.env.SMS_PHONE_NUMBER
}