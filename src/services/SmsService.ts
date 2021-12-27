import Twilio, { Twilio as TwilioClient } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { Configuration, ISmsServiceConfiguration } from '../config/SmsServiceConfiguration';

export interface ISmsService {
    sendMessage: (phone: string, message: string) => Promise<MessageInstance>;
}

class AppSmsService implements ISmsService {
    private readonly Client: TwilioClient;
    private readonly PhoneNumber: string;

    constructor(config: ISmsServiceConfiguration) {
        this.Client = Twilio(config.accountSid, config.authToken);
        this.PhoneNumber = config.phoneNumber;
    }

    async sendMessage(phone: string, message: string): Promise<MessageInstance> {
        const result = await this.Client.messages.create({
            from: this.PhoneNumber,
            to: phone,
            body: message
        });
        return result;
    };
}

export const SmsService: ISmsService = new AppSmsService(Configuration);