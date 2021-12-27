import { Configuration, IUrlShortenerConfiguration } from "../config/UrlShortenerConfiguration";
import { BitlyClient } from 'bitly';

export interface IUrlShortenerService {
    shorten: (url: string) => Promise<string>;
}

class UrlShortenerServiceImpl implements IUrlShortenerService {
    private readonly Client: BitlyClient;

    constructor(config: IUrlShortenerConfiguration) {
        this.Client = new BitlyClient(config.secret)
    }

    async shorten(url: string): Promise<string> {
        const { link } = await this.Client.shorten(url);
        return link;
    }
}

export const UrlShortenerService: IUrlShortenerService = new UrlShortenerServiceImpl(Configuration);