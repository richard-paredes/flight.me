import { Container, ItemResponse, PartitionKeyDefinition, SqlQuerySpec } from "@azure/cosmos";
import { PhoneSubscription } from "../types/FlightPriceTracking/PhoneSubscription";

export interface IPhoneSubscriptionsContainer {
    create: (phoneSubscription: PhoneSubscription) => Promise<ItemResponse<PhoneSubscription>>;
    replace: (phoneSubscription: PhoneSubscription) => Promise<ItemResponse<PhoneSubscription>>;
    delete: (phoneSubscriptionId: string) => Promise<ItemResponse<PhoneSubscription>>;
    query: (query: string | SqlQuerySpec) => Promise<PhoneSubscription[]>;
    getByPhoneNumber: (phoneNumber: string) => Promise<PhoneSubscription | null>;
}

export class PhoneSubscriptionsContainer implements IPhoneSubscriptionsContainer {
    private readonly PartitionKey: string | PartitionKeyDefinition;
    private readonly Client: Container;
    constructor(client: Container, partitionKey: string | PartitionKeyDefinition) {
        this.Client = client;
        this.PartitionKey = partitionKey;
    }

    /**
     * Create item if it does not exist
     */
    async create(phoneSubscription: PhoneSubscription): Promise<ItemResponse<PhoneSubscription>> {
        const response = await this.Client
            .items
            .upsert<PhoneSubscription>(phoneSubscription)
        return response;
    }

    async getByPhoneNumber(phoneNumber: string): Promise<PhoneSubscription | null> {
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
    async query(query: string | SqlQuerySpec): Promise<PhoneSubscription[]> {
        const { resources: results } = await this.Client
            .items
            .query<PhoneSubscription>(query)
            .fetchAll();
        return results;
    }

    /**
     * Replace the item by ID.
     */
    async replace(phoneSubscription: PhoneSubscription): Promise<ItemResponse<PhoneSubscription>> {
        const response = await this.Client
            .item(phoneSubscription.phoneNumber, this.PartitionKey)
            .replace(phoneSubscription);
        return response;
    }

    /**
     * Delete the item by ID.
     */
    async delete(phoneSubscriptionId: string): Promise<ItemResponse<PhoneSubscription>> {
        const response = await this.Client
            .item(phoneSubscriptionId, this.PartitionKey)
            .delete<PhoneSubscription>();
        return response;
    }

}