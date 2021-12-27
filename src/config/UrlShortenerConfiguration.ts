export interface IUrlShortenerConfiguration {
    base_url: string;
    secret: string;
    group: string;
}

export const Configuration: IUrlShortenerConfiguration = {
    base_url: process.env.URL_SHORTENER_CONNECTION,
    secret: process.env.URL_SHORTENER_SECRET,
    group: process.env.URL_SHORTENER_GROUP
};