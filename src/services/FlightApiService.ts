import { Configuration, IFlightApiServiceConfiguration } from "../config/FlightApiServiceConfiguration";
import { LocationQuery, LocationResult } from "../types/KiwiApi/Locations";
import { SearchQuery, SearchResult } from "../types/KiwiApi/Searches";
import { ApiUtilityService, IApiUtilityService } from "./ApiUtilityService";

export interface IFlightApiService {
    readonly locations: {
        query: (query: LocationQuery) => Promise<LocationResult>;
    };
    readonly searches: {
        search: (query: SearchQuery) => Promise<SearchResult>;
    }
}

/**
 * Service used to interact with the Kiwi flights API
 */
class FlightApiServiceImpl implements IFlightApiService {
    private readonly API_TOKEN: string;
    private readonly ApiUtility: IApiUtilityService;

    /**
     * 
     * @param config 
     */
    constructor(config: IFlightApiServiceConfiguration) {
        this.ApiUtility = new ApiUtilityService(config.base_url);
        this.API_TOKEN = config.secret;
    }

    /**
     * Property used for fetching different origins and destinations
     * to create a flight route
     */
    readonly locations = {
        query: async (query: LocationQuery): Promise<LocationResult> => {
            const request = this.ApiUtility.buildGetRequest('/locations/query', query, { 'apikey': this.API_TOKEN });
            const response = await fetch(request);

            if (response.status !== 200) {
                const error = await response.json();
                console.error(error);
                return {
                    locations: [],
                    meta: {
                        status: ' fail'
                    }
                };
            }

            return await response.json();
        }
    }

    /**
     * Property used for leveraging the search endpoint to return different
     * flights for a given route
     */
    readonly searches = {
        search: async (query: SearchQuery): Promise<SearchResult> => {
            const request = this.ApiUtility.buildGetRequest('/search', query, { 'apikey': this.API_TOKEN });
            const response = await fetch(request);

            if (response.status !== 200) {
                const error = await response.json();
                console.error(error);
                return {
                    data: []
                };
            }

            return await response.json() as SearchResult;
        }
    }
}

export const FlightApi: IFlightApiService = new FlightApiServiceImpl(Configuration);