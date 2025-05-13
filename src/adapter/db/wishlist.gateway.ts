import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateWishlistCommand } from 'src/application/port/in/wishlist/WishlistUseCase';
import { WishlistDbCommandPort } from 'src/application/port/out/WishlistDbCommandPort';
import { WishlistDbQueryPort } from 'src/application/port/out/WishlistDbQueryPort';
import { Wishlist } from 'src/domain/wishlist';

import { WishlistDbEntity } from './wishlist.entity';
import { mapToWishlist } from './wishlist.mapper';

@Injectable()
export class WishlistGateway implements WishlistDbCommandPort, WishlistDbQueryPort {
  constructor(
    @InjectRepository(WishlistDbEntity)
    private readonly wishlistRepository: EntityRepository<WishlistDbEntity>,
    private readonly em: EntityManager,
  ) {}

  async createWishlist(command: CreateWishlistCommand): Promise<void> {
    const entity = this.wishlistRepository.create({
      userId: command.userId,
      productId: command.productId,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(entity);
  }

  async remove(wishlistId: number): Promise<void> {
    await this.wishlistRepository.nativeDelete({ id: wishlistId });
  }

  async getWishlistByUserId(userId: number): Promise<Wishlist[]> {
    const entities: WishlistDbEntity[] = await this.wishlistRepository.find(
      { userId },
      { orderBy: { createdAt: 'desc' } },
    );
    return entities.map(mapToWishlist);
  }
}
