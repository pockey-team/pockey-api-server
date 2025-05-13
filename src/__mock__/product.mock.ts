import { Product } from '../domain/product';

export const productMockData: Readonly<Product> = {
  id: 1,
  name: 'Kodak 코닥 일회용 플래시 카메라 / 펀 세이버 39 / Fun Saver',
  url: 'https://smartstore.naver.com/coredak/products/4785024689',
  imageUrl:
    'https://shop-phinf.pstatic.net/20230309_236/1678356887222OXhnk_JPEG/79492775933138141_1309223572.jpg?type=m510',
  category: '여행용품',
  brand: 'Kodak',
  price: 20000,
  priceRange: '2만원대',
  ageRange: '10-40대',
  situation: ['여행 중에 만난 절경 앞에서', '친구들과의 공유하는 즐거운 밤'],
  intention: ['순간을 사진으로 남기기', '즉석에서 즐거움을 공유하기'],
  friendshipLevel: ['친구', '연인', '동료'],
  targetGender: '성별 무관',
  tags: ['여행', '특별한 날 기념', '즉흥적인 모임'],
  nextPickProductIds: [2, 3, 4],
};
