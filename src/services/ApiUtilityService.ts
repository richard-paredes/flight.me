import { URL } from 'url';

export interface IApiUtilityService {
    parameterize: (query: Query) => string;
    buildGetRequest: (endpoint: string, query: Query, headers?: HeadersInit) => Request;
    buildPostRequest: (endpoint: string, query: Query, headers?: HeadersInit) => Request;
}

type Query = {
    [key: string]: number | number[] | string | string[] | boolean | boolean[];
}

/**
 * Common helper utilities used for creating different API request types
 */
export class ApiUtilityService implements IApiUtilityService {
    private readonly API_BASE_URL: string;

    constructor(api_base_url: string) {
        this.API_BASE_URL = api_base_url;
    }

    readonly parameterize = (query: Query): string => {
        return Object.entries(query)
            .reduce((params, entry) => {
                const [key, value] = entry;
                if (Array.isArray(value)) {
                    value.forEach((val) => params.append(key, val));
                } else {
                    params.append(key, encodeURIComponent(value));
                }
                return params;
            }, new URLSearchParams())
            .toString();
    };

    readonly buildGetRequest = (endpoint: string, query: Query, headers?: HeadersInit): Request => {
        const url = new URL(endpoint, this.API_BASE_URL);
        url.search = this.parameterize(query);

        const request = new Request(url.toString(), { headers });

        return request;
    };

    readonly buildPostRequest = (endpoint: string, body: Query, headers?: HeadersInit): Request => {
        const url = new URL(endpoint, this.API_BASE_URL);
        
        const request = new Request(url.toString(), { headers, body: JSON.stringify(body) });

        return request;
    }
}

