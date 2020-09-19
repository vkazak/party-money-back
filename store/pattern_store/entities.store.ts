import axios from '../../api_middleware/api_client';
import { action, observable } from 'mobx';
import { AsyncDataStore } from './async_data.store';
import { AsyncSaveStore } from './async_save.store';

type Entity = {
    _id: string;
}

export class EntitiesStore<T extends Entity> extends AsyncDataStore {
    @observable protected entities: Array<T> = [];

    constructor() {
        super();
    }

    @action.bound
    protected setEntities(entities: Array<T>) {
        this.entities = entities;
    }

    @action.bound
    protected appendEntites(entities: Array<T>) {
        this.entities.push(...entities)
    }

    @action.bound
    protected addEntity(entity: T, addToStart: boolean = false) {
        if (addToStart)
            this.entities.unshift(entity);
        else
            this.entities.push(entity);
    }

    getById(entityId: string): T {
        const entity = this.entities.find(entity => entity._id === entityId);
        if (entity === undefined) {
            throw new Error('entityId not found in getByIdFn');
        } else {
            return entity;
        }
    }
    
    protected async fetchEntitiesFromServer(url: string, EntityClass) {
        const response = await axios.get(url);
        const dbEntities = response.data;
        const entities = dbEntities.map(dbEntity => new EntityClass(dbEntity));
        return entities;
    }

    protected async createEntity(
        url: string, 
        data: object, 
        addToStart: boolean = false,
        EntityClass, 
        asyncSaveStore: AsyncSaveStore
    ) {
        try {
            asyncSaveStore.setSaveStatusPending();
            const response = await axios.post(url, data);
            const dbEntity = response.data;
            const entity = new EntityClass(dbEntity);
            this.addEntity(entity, addToStart);
            asyncSaveStore.setSaveStatusSuccess();
        } catch(err) {
            asyncSaveStore.setSaveStatusError(err);
        }
    }
}