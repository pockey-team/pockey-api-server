import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { WishlistNotFoundException } from 'src/application/common/error/exception/wishlist.exception';
import { AddWishlistCommand } from 'src/application/port/in/wishlist/WishlistUseCase';
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
    @Inject(EntityManager)
    private readonly em: EntityManager,
  ) {}

  async getWishlistById(wishlistId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ id: wishlistId });

    if (!wishlist) {
      throw new WishlistNotFoundException();
    }

    return mapToWishlist(wishlist);
  }

  async getAllByUserId(userId: number): Promise<Wishlist[]> {
    const entities = await this.wishlistRepository.find(
      { userId },
      { orderBy: { createdAt: 'desc' } },
    );
    return entities.map(mapToWishlist);
  }

  async getByUserIdAndReceiverName(userId: number, receiverName: string): Promise<Wishlist[]> {
    const entities = await this.wishlistRepository.find(
      { userId, receiverName },
      { orderBy: { createdAt: 'desc' } },
    );

    return entities.map(mapToWishlist);
  }

  async addWishlist(command: AddWishlistCommand): Promise<void> {
    const entity = this.wishlistRepository.create({
      userId: command.userId,
      productId: command.productId,
      receiverName: command.receiverName,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(entity);
  }

  async removeWishlist(wishlistId: number): Promise<void> {
    const wishlist = await this.wishlistRepository.findOne({ id: wishlistId });
    if (!wishlist) {
      throw new WishlistNotFoundException();
    }

    await this.em.removeAndFlush(wishlist);
  }
}
