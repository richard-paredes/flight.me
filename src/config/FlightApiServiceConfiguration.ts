export interface IFlightApiServiceConfiguration {
    base_url: string;
    secret: string;
}

export const Configuration: IFlightApiServiceConfiguration = {
    base_url: process.env.FLIGHT_API_CONNECTION,
    secret: process.env.FLIGHT_API_SECRET
};