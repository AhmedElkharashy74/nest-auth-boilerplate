import { CartItem } from './cart-item.entity';

export class Cart {
  private _id: number | null;
  private _userId?: string | null;
  private _guestToken?: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _items: CartItem[];

  private constructor(props: {
    id?: number | null;
    userId?: string | null;
    guestToken?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    items?: CartItem[];
  }) {
    this._id = props.id ?? null;
    this._userId = props.userId ?? null;
    this._guestToken = props.guestToken ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._items = props.items ?? [];
  }

  static create(props: {
    id?: number | null;
    userId?: string | null;
    guestToken?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    items?: CartItem[];
  }) {
    return new Cart(props);
  }

  // getters
  get id(): number | null { return this._id; }
  get userId(): string | null | undefined { return this._userId; }
  get guestToken(): string | null | undefined { return this._guestToken; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get items(): CartItem[] { return [...this._items]; }

  // business methods
  addOrIncrementItem(item: CartItem) {
    // item must be either itemId or packageId — assumed validated upstream/domain service
    const existing = this._items.find(i => i.equalsProduct(item));
    if (existing) {
      existing.increaseQuantity(item.quantity);
    } else {
      this._items.push(item);
    }
    this.touch();
  }

  updateItemQuantity(cartItemId: number, quantity: number) {
    if (quantity <= 0) throw new Error('Quantity must be > 0');
    const it = this._items.find(i => i.id === cartItemId);
    if (!it) throw new Error('CartItem not found');
    it.setQuantity(quantity);
    this.touch();
  }

  removeItem(cartItemId: number) {
    const idx = this._items.findIndex(i => i.id === cartItemId);
    if (idx === -1) throw new Error('CartItem not found');
    this._items.splice(idx, 1);
    this.touch();
  }

  clear() {
    this._items = [];
    this.touch();
  }

  mergeFrom(other: Cart) {
    // merge items from other (used e.g. guest -> user)
    for (const item of other.items) {
      this.addOrIncrementItem(item);
    }
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
