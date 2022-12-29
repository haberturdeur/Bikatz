import { UUID } from "./trivial";

interface Entry {
    id: UUID | undefined
    instanceID: UUID | undefined | null
}

abstract class Manager<V extends Entry> {
    readonly instanceID: UUID | undefined | null

    constructor(instanceID: UUID | null) {
        this.instanceID = instanceID
    }

    abstract create(value: V): V
    abstract get(key: UUID): V | undefined
    abstract update(key: UUID, value: V): V | undefined
    abstract delete(key: UUID): V | undefined
    abstract filter(predicate: (value: V, key: UUID) => boolean): Map<UUID, V>
}

// reading db
class DBManager<V extends Entry> extends Manager<V> {
    constructor(instanceID: UUID | null) {
        super(instanceID)
    }
    create(value: V): V {
        let id = Math.random().toString() // You would get this from the db anyway
        while (this.get(id)) {
            id = Math.random().toString()
        }
        /*
            insert into database
        */
        value.id = id
        value.instanceID = this.instanceID
        return value
    }

    get(key: UUID): V | undefined {
        return undefined
    }

    update(key: UUID, value: V): V | undefined {
        return undefined
    }

    delete(key: UUID): V | undefined {
        return undefined
    }

    filter(predicate: (value: V, key: UUID) => boolean): Map<UUID, V> {
        return new Map<UUID, V>()
    }

}

class CachedManager<V extends Entry> extends DBManager<V> {
    cache: Map<UUID, V>

    constructor(instanceID: UUID | null) {
        super(instanceID)
        this.cache = new Map<UUID, V>()
    }

    protected updateCache(data: Map<UUID, V>) {
        data.forEach((value, key) => this.cache.set(key, value))
    }

    create(value: V): V {
        const out = super.create(value)
        this.cache.set(out.id!, value)
        return out
    }

    get(key: UUID): V | undefined {
        let ret = this.cache.get(key)
        if (ret)
            return ret
        return super.get(key)
    }

    update(key: UUID, value: V): V | undefined {
        if (!this.cache.has(key) && !super.update(key, value))
            return undefined
        this.cache.set(key, value)
        return value
    }

    delete(key: UUID): V | undefined {
        this.cache.delete(key)
        return super.delete(key)
    }

    filter(predicate: (value: V, key: UUID) => boolean, fetch: boolean = false): Map<UUID, V> {
        if (fetch) {
            const out = super.filter(predicate)
            this.updateCache(out)
            return out
        }

        const out = new Map<UUID, V>()
        this.cache.forEach((v, k) => {
            if (predicate(v, k))
                out.set(k, v)
        })
        return out
    }

}

export { CachedManager as Manager, Entry }