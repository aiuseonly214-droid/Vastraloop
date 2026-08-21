export interface IBaseRepository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(predicate?: (item: T) => boolean): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(predicate?: (item: T) => boolean): Promise<number>;
}

export class InMemoryRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected items: Map<string, T> = new Map();

  constructor(initialData: T[] = []) {
    for (const item of initialData) {
      this.items.set(item.id, { ...item });
    }
  }

  async findById(id: string): Promise<T | null> {
    const item = this.items.get(id);
    return item ? { ...item } : null;
  }

  async findAll(predicate?: (item: T) => boolean): Promise<T[]> {
    const all = Array.from(this.items.values());
    if (!predicate) return all.map((item) => ({ ...item }));
    return all.filter(predicate).map((item) => ({ ...item }));
  }

  async create(item: T): Promise<T> {
    const cloned = { ...item };
    this.items.set(item.id, cloned);
    return { ...cloned };
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const existing = this.items.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.items.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async count(predicate?: (item: T) => boolean): Promise<number> {
    if (!predicate) return this.items.size;
    return (await this.findAll(predicate)).length;
  }
}
