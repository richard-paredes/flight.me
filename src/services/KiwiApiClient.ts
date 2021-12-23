import { ApiUtilityService, IApiUtilityService } from "./ApiUtilityService";

type LocationQuery = {
    term: string;
    locale?: string;
    location_types?: string[];
    limit?: number;
    active_only: boolean;
    sort: string;
}

interface IKiwiApi {
    locations: {
        query: (query: LocationQuery) => Promise<any>;
    };
}

export class KiwiApi implements IKiwiApi {
    private readonly API_TOKEN: string;
    private readonly ApiUtility: IApiUtilityService;

    constructor(api_base_url, access_token) {
        this.API_TOKEN = access_token;
        this.ApiUtility = new ApiUtilityService(api_base_url);
    }

    locations = {
        query: async (query: LocationQuery) => {
            const request = this.ApiUtility.buildGetRequest('/locations/query', query, { 'apitoken': this.API_TOKEN });
            const response = await fetch(request);
            return await response.json();
        }
    }
}