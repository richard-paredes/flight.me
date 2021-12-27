import { Container, CosmosClient, Database, DatabaseResponse, PartitionKeyDefinition } from '@azure/cosmos';

import { Configuration, IFlightMeContextConfiguration } from '../config/FlightSubscriptionConfig';
import { IPhoneSubscriptionsContainer, PhoneSubscriptionsContainer } from './PhoneSubscriptionContainer';


export interface IFlightMeContext {
  initialize: () => Promise<void>;
  phoneSubscriptions: () => IPhoneSubscriptionsContainer;
};


class FlightMeContext implements IFlightMeContext {
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
    this.PhoneSubscriptions = new PhoneSubscriptionsContainer(container, this.Configuration.container.partitionKey);
    this.Initialized = true;
  }

  private ensureInitialized() {
    if (!this.Initialized) {
      throw new Error('Context has not been initialized');
    }
  }

  phoneSubscriptions(): IPhoneSubscriptionsContainer {
    this.ensureInitialized();
    return this.PhoneSubscriptions;
  }

  /**
   * Create the database if it does not exist
   */
  async createDatabase(databaseId: string): Promise<Database> {
    const { database } = await this.Client.databases.createIfNotExists({
      id: databaseId
    });
    return database;
  }

  /**
   * Read the database definition
   */
  async readDatabase(databaseId: string): Promise<DatabaseResponse> {
    return await this.Client
      .database(databaseId)
      .read();
  }

  /**
   * Create the container if it does not exist
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
   */
  async readContainer(databaseId: string, containerId: string) {
    return await this.Client
      .database(databaseId)
      .container(containerId)
      .read()
  }
}

export const AppContext: IFlightMeContext = new FlightMeContext(Configuration);