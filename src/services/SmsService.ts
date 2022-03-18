import Twilio, { Twilio as TwilioClient } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { Configuration, ISmsServiceConfiguration } from '../config/SmsServiceConfiguration';

export interface ISmsService {
    sendMessage: (phone: string, message: string) => Promise<MessageInstance>;
}

/**
 * Service used to send a SMS to a user's phone number
 */
class AppSmsService implements ISmsService {
    private readonly Client: TwilioClient;
    private readonly PhoneNumber: string;

    constructor(config: ISmsServiceConfiguration) {
        this.Client = Twilio(config.accountSid, config.authToken);
        this.PhoneNumber = config.phoneNumber;
    }

    /**
     * Sends a SMS to the phone number
     * @param phone Phone number used to notify the user
     * @param message Message to send the user
     * @returns MessageInstance containing metadata about the SMS sent
     */
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