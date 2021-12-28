import { Container, ItemResponse, PartitionKeyDefinition, SqlQuerySpec } from "@azure/cosmos";
import { CosmosEntity } from "../types/CosmosEntity";
import { PhoneSubscription } from "../types/FlightPriceTracking/PhoneSubscription";

export interface IPhoneSubscriptionsContainer {
    create: (phoneSubscription: PhoneSubscription) => Promise<ItemResponse<PhoneSubscription>>;
    replace: (phoneSubscription: CosmosEntity<PhoneSubscription>) => Promise<ItemResponse<PhoneSubscription>>;
    delete: (phoneSubscription: CosmosEntity<PhoneSubscription>) => Promise<ItemResponse<PhoneSubscription>>;
    query: (query: string | SqlQuerySpec) => Promise<CosmosEntity<PhoneSubscription>[]>;
    getByPhoneNumber: (phoneNumber: string) => Promise<CosmosEntity<PhoneSubscription> | null>;
    getAll: () => Promise<CosmosEntity<PhoneSubscription>[]>;
}

export class PhoneSubscriptionsContainerImpl implements IPhoneSubscriptionsContainer {
    private readonly Container: Container;

    constructor(client: Container) {
        this.Container = client;
    }

    /**
     * Create item if it does not exist
     */
    async create(phoneSubscription: PhoneSubscription): Promise<ItemResponse<PhoneSubscription>> {
        const response = await this.Container
            .items
            .upsert<PhoneSubscription>(phoneSubscription)
        return response;
    }

    async getAll(): Promise<CosmosEntity<PhoneSubscription>[]> {
        const queryResult = await this.query({
            query: `
                SELECT * FROM 
                PhoneSubscriptions ps 
            `
        });
        if (!queryResult) return [];
        return queryResult;
    }

    async getByPhoneNumber(phoneNumber: string): Promise<CosmosEntity<PhoneSubscription> | null> {
        const queryResult = await this.query({
            query: `
                SELECT * FROM 
                PhoneSubscriptions ps 
                WHERE ps.phoneNumber = @phone
            `,
            parameters: [{ name: '@phone', value: phoneNumber }]
        });
        if (!queryResult || queryResult.length === 0) {
            return null;
        }
        return queryResult[0];
    }

    /**
     * Query the container using SQL
     */
    async query(query: string | SqlQuerySpec): Promise<CosmosEntity<PhoneSubscription>[]> {
        const { resources: results } = await this.Container
            .items
            .query<CosmosEntity<PhoneSubscription>>(query)
            .fetchAll();
        return results;
    }

    /**
     * Replace the item by ID.
     */
    async replace(phoneSubscription: CosmosEntity<PhoneSubscription>): Promise<ItemResponse<PhoneSubscription>> {
        console.log('Replacing', phoneSubscription.id, 'using partition of ', phoneSubscription.phoneNumber);
        const response = await this.Container
            .item(phoneSubscription.id, phoneSubscription.phoneNumber)
            .replace(phoneSubscription);
        return response;
    }

    /**
     * Delete the item by ID.
     */
    async delete(phoneSubscription: CosmosEntity<PhoneSubscription>): Promise<ItemResponse<CosmosEntity<PhoneSubscription>>> {
        const response = await this.Container
            .item(phoneSubscription.id, phoneSubscription.phoneNumber)
            .delete<CosmosEntity<PhoneSubscription>>();
        return response;
    }

}