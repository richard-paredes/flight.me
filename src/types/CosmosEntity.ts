export type CosmosEntity<T extends {}> = T & {
    id: string;
    _rid: string;
    _self: string;
    _etag: string;
    _attachments: string;
    _ts: number;
};
