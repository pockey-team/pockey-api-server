export class Wishlist {
  id: number;
  userId: number;
  productId: number;
  receiverName: string;
  createdAt: Date;
}

export class WishlistItem {
  wishlistId: number;
  productId: number;
  name: string | null;
  imageUrl: string | null;
  deleted: boolean;
  createdAt: Date;
}

export class WishlistGroupedByReceiver {
  receiverName: string;
  items: WishlistItem[];
}
