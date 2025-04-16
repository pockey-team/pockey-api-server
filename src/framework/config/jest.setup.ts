jest.mock('@mikro-orm/core', () => ({
  ...jest.requireActual('@mikro-orm/core'),
  Transactional: () => jest.fn(),
}));
