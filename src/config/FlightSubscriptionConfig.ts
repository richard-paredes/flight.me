export interface IFlightMeContextConfiguration {
    endpoint: string;
    key: string;
    database: {
        id: string;
    };
    container: {
        id: string;
        partitionKey: string;
    };
}

export const Configuration: IFlightMeContextConfiguration = {
    endpoint: process.env.FLIGHT_PRICE_TRACKING_CONNECTION,
    key: process.env.FLIGHT_PRICE_TRACKING_SECRET,
    database: {
        id: 'FlightPriceTracking'
    },
    container: {
        id: 'PhoneSubscriptions',
        partitionKey: '/phonenumber'
    }
};
