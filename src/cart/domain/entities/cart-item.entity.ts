export class CartItem {
    private _id: number | null;
    private _cartId: number | null;
    private _itemId?: number | null;
    private _packageId?: number | null;
    private _quantity: number;
  
    private constructor(props: {
      id?: number | null;
      cartId?: number | null;
      itemId?: number | null;
      packageId?: number | null;
      quantity?: number;
    }) {
      this._id = props.id ?? null;
      this._cartId = props.cartId ?? null;
      this._itemId = props.itemId ?? null;
      this._packageId = props.packageId ?? null;
      this._quantity = props.quantity ?? 1;
      this.validateInvariant();
    }
  
    static create(props: {
      id?: number | null;
      cartId?: number | null;
      itemId?: number | null;
      packageId?: number | null;
      quantity?: number;
    }) {
      return new CartItem(props);
    }
  
    // getters
    get id(): number | null { return this._id; }
    get cartId(): number | null { return this._cartId; }
    get itemId(): number | null | undefined { return this._itemId; }
    get packageId(): number | null | undefined { return this._packageId; }
    get quantity(): number { return this._quantity; }
  
    // business methods
    increaseQuantity(by: number = 1) {
      if (by <= 0) throw new Error('Increase must be positive');
      this._quantity += by;
    }
  
    setQuantity(q: number) {
      if (q <= 0) throw new Error('Quantity must be > 0');
      this._quantity = q;
    }
  
    equalsProduct(other: CartItem) {
      // two items are same product if they share itemId or packageId (and not both)
      if (this._itemId && other.itemId) return this._itemId === other.itemId;
      if (this._packageId && other.packageId) return this._packageId === other.packageId;
      return false;
    }
  
    private validateInvariant() {
      // either itemId or packageId must be set (not both null)
      if ((this._itemId === null || this._itemId === undefined) &&
          (this._packageId === null || this._packageId === undefined)) {
        throw new Error('CartItem must reference either itemId or packageId');
      }
      if (this._itemId !== null && this._packageId !== null &&
          this._itemId !== undefined && this._packageId !== undefined) {
        // allow but usually not both; prefer one. Enforce one-only:
        throw new Error('CartItem cannot reference both itemId and packageId');
      }
      if (this._quantity <= 0) throw new Error('Quantity must be > 0');
    }
  }
  