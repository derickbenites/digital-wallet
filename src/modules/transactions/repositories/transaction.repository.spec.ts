import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from '../dto/req/create-transaction.dto';
import { TransactionsService } from '../services/transactions.service';
import { mock } from 'jest-mock-extended';
import { TransactionEntity } from '../entities/transaction.entity';
import { TypeTransaction } from 'src/common/constants/type-transaction.constant';

describe('TransactionsRepository', () => {
  let repository: TransactionRepository;
  let service: TransactionsService;

  beforeEach(async () => {
    service = mock<TransactionsService>({});
    repository = mock<TransactionRepository>({});
  });

  test('TransactionRepository - findAllTransaction', async () => {
    const pageOptionsDto = new PageOptionsDto();
    const dataSource = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    };
    const paginateRaw = jest.fn();
    // const repository = new TransactionRepository(dataSource as any);
    // repository.dataSource = dataSource as any;
    jest
      .spyOn(repository.manager, 'createQueryBuilder')
      .mockReturnValue(dataSource);
    jest.spyOn(repository.manager, 'from').mockReturnValue(dataSource as any);
    jest.spyOn(repository.manager, 'select').mockReturnValue(dataSource as any);
    jest.spyOn(paginateRaw, 'mockReturnValue').mockReturnValue('result');
    jest.spyOn(repository, 'findAllTransaction').mockResolvedValue('result');
    const result = await repository.findAllTransaction(pageOptionsDto);
    expect(result).toBe('result');
    expect(repository.manager.createQueryBuilder).toHaveBeenCalled();
    expect(repository.manager.from).toHaveBeenCalled();
    expect(repository.manager.select).toHaveBeenCalled();
    expect(paginateRaw).toHaveBeenCalled();
  });

  test('TransactionRepository - createTransaction', async () => {
    const createTransactionDto = new CreateTransactionDto();
    createTransactionDto.userId = 'userId';
    const entityManager = {
      create: jest.fn().mockReturnValue('transaction'),
      save: jest.fn().mockReturnValue('result'),
    };
    const repository = new TransactionRepository({} as any);
    jest.spyOn(entityManager, 'create').mockReturnValue('transaction');
    jest.spyOn(entityManager, 'save').mockResolvedValue('result');
    const result = await repository.createTransaction(
      createTransactionDto,
      entityManager as any,
    );
    expect(result).toBe('result');
    expect(entityManager.create).toHaveBeenCalledWith(TransactionEntity, {
      ...createTransactionDto,
      createdBy: createTransactionDto.userId,
    });
    expect(entityManager.save).toHaveBeenCalledWith(
      TransactionEntity,
      'transaction',
    );
  });

  test('TransactionRepository - getWalletExtract', async () => {
    const pageOptionsDto = new PageOptionsDto();
    const manager = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
    };
    const paginateRaw = jest.fn();
    jest
      .spyOn(repository.manager, 'createQueryBuilder')
      .mockReturnValue(manager as any);
    jest.spyOn(repository.manager, 'from').mockReturnValue(manager);
    jest.spyOn(repository.manager, 'select').mockReturnValue(manager as any);
    jest.spyOn(repository.manager, 'where').mockReturnValue(manager as any);
    jest.spyOn(repository.manager, 'andWhere').mockReturnValue(manager as any);
    jest.spyOn(paginateRaw, 'mockReturnValue').mockReturnValue('result');
    jest.spyOn(repository, 'getWalletExtract').mockResolvedValue('result');
    const result = await repository.getWalletExtract(
      'userId',
      TypeTransaction.DEPOSIT,
      pageOptionsDto,
    );
    expect(result).toBe('result');
    expect(repository.dataSource.createQueryBuilder).toHaveBeenCalled();
    expect(repository.dataSource.from).toHaveBeenCalled();
    expect(repository.dataSource.select).toHaveBeenCalled();
    expect(repository.dataSource.where).toHaveBeenCalledWith(
      'user_id = :userId',
      { userId: 'userId' },
    );
    expect(repository.dataSource.andWhere).toHaveBeenCalledWith(
      'action = :type',
      { type: TypeTransaction.DEPOSIT },
    );
    expect(paginateRaw).toHaveBeenCalled();
  });
});
