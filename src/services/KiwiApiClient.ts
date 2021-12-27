import { LocationQuery, LocationResult } from "../types/KiwiApi/Locations";
import { SearchQuery, SearchResult } from "../types/KiwiApi/Searches";
import { ApiUtilityService, IApiUtilityService } from "./ApiUtilityService";

export interface IKiwiApi {
    readonly locations: {
        query: (query: LocationQuery) => Promise<LocationResult>;
    };
    readonly searches: {
        search: (query: SearchQuery) => Promise<SearchResult>;
    }
}

export class KiwiApi implements IKiwiApi {
    private readonly API_TOKEN: string;
    private readonly ApiUtility: IApiUtilityService;

    constructor(api_base_url: string, access_token: string) {
        this.API_TOKEN = access_token;
        this.ApiUtility = new ApiUtilityService(api_base_url);
    }

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