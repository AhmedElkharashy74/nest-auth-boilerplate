export class Item {
    constructor(
      public id: number,
      public name: string,
      public description: string | null,
      public price: number,
      public createdAt: Date,
      public updatedAt: Date,
    ) {}
  
    static create(createProps: {
      name: string;
      description?: string;
      price: number;
    }): Item {
      const now = new Date();
      return new Item(
        0, // ID will be assigned by database
        createProps.name,
        createProps.description || null,
        createProps.price,
        now,
        now,
      );
    }
  
    update(updateProps: {
      name?: string;
      description?: string | null;
      price?: number;
    }): void {
      if (updateProps.name !== undefined) this.name = updateProps.name;
      if (updateProps.description !== undefined) this.description = updateProps.description;
      if (updateProps.price !== undefined) this.price = updateProps.price;
      this.updatedAt = new Date();
    }
  }