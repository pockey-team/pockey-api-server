export class Wishlist {
  id: number;
  userId: number;
  productId: number;
  receiverName: string;
  createdAt: Date;
}

export class WishlistItem {
  wishlistId: number;
  product: {
    id: number;
    name: string | null;
    price: number | null;
    imageUrl: string | null;
  };

  deleted: boolean;
}

export class WishlistGroups {
  receiverName: string;
  count: number;
  imageUrls: string[];
}

export class WishlistGroupedByReceiver {
  receiverName: string;
  items: WishlistItem[];
}
