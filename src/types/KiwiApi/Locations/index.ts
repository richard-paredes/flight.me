export type LocationQuery = {
    term: string;
    locale?: string;
    location_types?: string[];
    limit?: number;
    active_only?: boolean;
    sort?: string;
}

export type Location = {
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

export type LocationResult = {
    locations: Location[];
    meta: {
        locale?: string;
        status: string;
    };

}
