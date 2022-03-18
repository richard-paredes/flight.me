import { Container, CosmosClient, Database, DatabaseResponse, PartitionKeyDefinition } from '@azure/cosmos';

import { Configuration, IFlightMeContextConfiguration } from '../config/FlightSubscriptionConfig';
import { IPhoneSubscriptionsContainer, PhoneSubscriptionsContainerImpl } from './PhoneSubscriptionContainer';


export interface IFlightMeContext {
  initialize: () => Promise<void>;
  phoneSubscriptions: () => IPhoneSubscriptionsContainer;
};

/**
 * A wrapper around the CosmosDb datastore. Mimics the DbContext pattern from Entity Framework.
 */
class FlightMeContextImpl implements IFlightMeContext {
  private readonly Client: CosmosClient;
  private readonly Configuration: IFlightMeContextConfiguration;
  private Initialized: boolean;
  private PhoneSubscriptions: IPhoneSubscriptionsContainer;


  constructor(config: IFlightMeContextConfiguration) {
    this.Configuration = config;
    this.Initialized = false;
    this.Client = new CosmosClient(config);
  }

  async initialize(): Promise<void> {
    if (this.Initialized) return;

    const database = await this.createDatabase(this.Configuration.database.id);
    const container = await this.createContainer(database.id, this.Configuration.container.id, this.Configuration.container.partitionKey);
    this.PhoneSubscriptions = new PhoneSubscriptionsContainerImpl(container);
    this.Initialized = true;
  }

  private ensureInitialized() {
    if (!this.Initialized) {
      throw new Error('Context has not been initialized');
    }
  }

  /**
   * Retrieve the data store for PhoneSubscriptions. Similar to DbSet
   * @returns Container that allows querying PhoneSubscriptions
   */
  phoneSubscriptions(): IPhoneSubscriptionsContainer {
    this.ensureInitialized();
    return this.PhoneSubscriptions;
  }

  /**
   * Create the database if it does not exist
   * @param databaseId Name of the CosmosDb database to be created
   * @returns The created Database
   */
  async createDatabase(databaseId: string): Promise<Database> {
    const { database } = await this.Client.databases.createIfNotExists({
      id: databaseId
    });
    return database;
  }

  /**
   * Read the database definition
   * @param databaseId Name of the CosmosDb database
   * @returns DatabaseResponse enabling operations
   */
  async readDatabase(databaseId: string): Promise<DatabaseResponse> {
    return await this.Client
      .database(databaseId)
      .read();
  }

  /**
   * Create the container if it does not exist
   * @param databaseId Name of the CosmosDb database
   * @param containerId Name of the Container to be created
   * @param partitionKey Name of the JSON property to be used as the partition key
   * @returns 
   */
  async createContainer(databaseId: string, containerId: string, partitionKey: string | PartitionKeyDefinition): Promise<Container> {
    const { container } = await this.Client
      .database(databaseId)
      .containers.createIfNotExists(
        { id: containerId, partitionKey }
      );
    return container;
  }

  /**
   * Read the container definition
   * @param databaseId Name of the CosmosDb database
   * @param containerId Name of the container in the database
   * @returns 
   */
  async readContainer(databaseId: string, containerId: string) {
    return await this.Client
      .database(databaseId)
      .container(containerId)
      .read()
  }
}

export const FlightMeContext: IFlightMeContext = new FlightMeContextImpl(Configuration);