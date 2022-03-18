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

/**
 * Used to interact with the CosmosDB store that holds
 * the users' phone numbers & any flights they're subscribed to
 */
export class PhoneSubscriptionsContainerImpl implements IPhoneSubscriptionsContainer {
    private readonly Container: Container;

    constructor(client: Container) {
        this.Container = client;
    }

    /**
     * Creates a new PhoneSubscription item in the data store if 
     * it does not exist already
     */
    async create(phoneSubscription: PhoneSubscription): Promise<ItemResponse<PhoneSubscription>> {
        const response = await this.Container
            .items
            .upsert<PhoneSubscription>(phoneSubscription)
        return response;
    }

    /**
     * Retrieves all the 
     * @returns List of PhoneSubscription objects
     */
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

    /**
     * Retrieves a PhoneSubscription object for the given phone number
     * @param phoneNumber The phone number of the PhoneSubscription being queried
     * @returns PhoneSubscription or null if does not exist
     */
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
     * Query the CosmosDB container using the provided SQL
     * @param query Raw SQL string
     * @returns List of PhoneSubscription objects
     */
    async query(query: string | SqlQuerySpec): Promise<CosmosEntity<PhoneSubscription>[]> {
        const { resources: results } = await this.Container
            .items
            .query<CosmosEntity<PhoneSubscription>>(query)
            .fetchAll();
        return results;
    }

    /**
     * Replace the PhoneSubscription
     * @param phoneSubscription PhoneSubscription to be modified
     * @returns The replaced PhoneSubscription 
     */
    async replace(phoneSubscription: CosmosEntity<PhoneSubscription>): Promise<ItemResponse<PhoneSubscription>> {
        console.log('Replacing', phoneSubscription.id, 'using partition of ', phoneSubscription.phoneNumber);
        const response = await this.Container
            .item(phoneSubscription.id, phoneSubscription.phoneNumber)
            .replace(phoneSubscription);
        return response;
    }

    /**
     * Hard deletes a PhoneSubscription
     * @param phoneSubscription PhoneSubscription to be deleted
     * @returns The deleted PhoneSubscription
     */
    async delete(phoneSubscription: CosmosEntity<PhoneSubscription>): Promise<ItemResponse<CosmosEntity<PhoneSubscription>>> {
        const response = await this.Container
            .item(phoneSubscription.id, phoneSubscription.phoneNumber)
            .delete<CosmosEntity<PhoneSubscription>>();
        return response;
    }

}