export abstract class IGenericRepository<T> {
    abstract index(): Promise<T[] | null>;
    abstract find(id: string): Promise<T | null>;
    abstract create(item: T): Promise<T>;
    abstract update(id: string, item: T): Promise<T>;
    abstract delete(id: string): Promise<void>;
    abstract save(item: T): Promise<T>;
    abstract remove(item: T): Promise<T>;
}