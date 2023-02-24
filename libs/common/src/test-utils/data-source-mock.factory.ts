import { DataSource } from 'typeorm';
import { MockType } from './mock-type';

export type DataSourceManager = Partial<{
  save: jest.Mock<any, any>;
  update: jest.Mock<any, any>;
}>;

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({
    createQueryRunner: jest.fn().mockImplementation(() => createQueryRunner()),
  }),
);

export const createQueryRunner = () => {
  return {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),

    manager: {
      save: jest.fn(),
      update: jest.fn(),
    },
  };
};
