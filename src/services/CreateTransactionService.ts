import { getCustomRepository, getRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (value > total && type === 'outcome') {
      throw new AppError('Insuficient balance');
    }

    let findExitsCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!findExitsCategory) {
      findExitsCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(findExitsCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: findExitsCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
