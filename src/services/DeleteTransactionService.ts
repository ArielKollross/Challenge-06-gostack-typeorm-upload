import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transascitonsRepository = getRepository(Transaction);

    const deleteId = await transascitonsRepository.findOne(id);

    if (!deleteId) {
      throw new AppError('error to delet transaction');
    }

    await transascitonsRepository.delete(id);
  }
}

export default DeleteTransactionService;
