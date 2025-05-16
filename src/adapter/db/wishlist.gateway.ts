import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { AddWishlistCommand } from 'src/application/port/in/wishlist/WishlistUseCase';
import { WishlistDbCommandPort } from 'src/application/port/out/WishlistDbCommandPort';
import { WishlistDbQueryPort } from 'src/application/port/out/WishlistDbQueryPort';
import { WishlistGroupedByReceiver, WishlistItem } from 'src/domain/wishlist';

import { ProductDbEntity } from './product.entity';
import { WishlistDbEntity } from './wishlist.entity';
import { mapToWishlist } from './wishlist.mapper';

@Injectable()
export class WishlistGateway implements WishlistDbCommandPort, WishlistDbQueryPort {
  constructor(
    @InjectRepository(WishlistDbEntity)
    private readonly wishlistRepository: EntityRepository<WishlistDbEntity>,
    @InjectRepository(ProductDbEntity)
    private readonly productRepository: EntityRepository<ProductDbEntity>,
    @Inject(EntityManager)
    private readonly em: EntityManager,
  ) {}

  async addToWishlist(command: AddWishlistCommand): Promise<void> {
    const entity = this.wishlistRepository.create({
      userId: command.userId,
      productId: command.productId,
      receiverName: command.receiverName,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(entity);
  }

  async removeWishlist(wishlistId: number): Promise<void> {
    await this.wishlistRepository.nativeDelete({ id: wishlistId });
  }

  async getGroupedByReceiver(userId: number): Promise<WishlistGroupedByReceiver[]> {
    const entities: WishlistDbEntity[] = await this.wishlistRepository.find(
      { userId },
      { orderBy: { createdAt: 'desc' } },
    );
    const wishlists = entities.map(mapToWishlist);

    const productIds = wishlists.map(w => w.productId);

    const products = await this.productRepository.find({
      id: { $in: productIds },
      deletedAt: null,
    });

    const productMap = new Map<number, ProductDbEntity>(products.map(p => [p.id, p]));

    const grouped = new Map<string, WishlistItem[]>();

    for (const item of wishlists) {
      const product = productMap.get(item.productId);

      const dto: WishlistItem = {
        wishlistId: item.id,
        productId: item.productId,
        name: product ? product.name : null,
        imageUrl: product ? product.imageUrl : null,
        deleted: !product,
        createdAt: item.createdAt,
      };

      if (!grouped.has(item.receiverName)) {
        grouped.set(item.receiverName, []);
      }
      grouped.get(item.receiverName)!.push(dto);
    }
    return Array.from(grouped.entries()).map(([receiverName, items]) => ({
      receiverName,
      items,
    }));
  }
}
