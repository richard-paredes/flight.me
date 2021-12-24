import { ApiUtilityService, IApiUtilityService } from "./ApiUtilityService";

type LocationQuery = {
    term: string;
    locale?: string;
    location_types?: string[];
    limit?: number;
    active_only?: boolean;
    sort?: string;
}
type Location = {
    id: string;
    int_id: string;
    active: boolean;
    code?: string;
    name: string;
    slug?: string;
    alternative_names: string[];
    rank: number;
    timezone: string;
    city: {
        id: string;
        name: string;
        code?: string;
        slug: string;
        subdivision?: string;
        autonomous_territory?: string;
        country?: {
            id: string;
            name: string;
            slug: string;
            code: string;
        };
        region?: {
            id: string;
            name: string;
            slug: string;
        };
        continent?: {
            id: string;
            name: string;
            slug: string;
            code: string;
        };
    };
    subdivision?: {
        id: string;
        name: string;
        slug: string;
        code: string;
    };
    autonomous_territory?: string;
    country?: {
        id: string;
        name: string;
        slug: string;
        code: string;
    };
    region?: {
        id: string;
        name: string;
        slug: string;
    };
    continent?: {
        id: string;
        name: string;
        slug: string;
        code: string;
    };
    location: {
        lon: string;
        lat: string;
    };
    alternative_departure_points: string[];
    type: string;
};

type LocationResult = {
    locations: Location[];
    meta: {
        locale?: string;
        status: string;
    };

}

export interface IKiwiApi {
    locations: {
        query: (query: LocationQuery) => Promise<LocationResult>;
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
        query: async (query: LocationQuery): Promise<LocationResult> => {
            const request = this.ApiUtility.buildGetRequest('/locations/query', query, { 'apikey': this.API_TOKEN });

            const response = await fetch(request);

            if (response.status !== 200) return {
                locations: [],
                meta: {
                    status: ' fail'
                }
            };

            return await response.json();
        }
    }
}