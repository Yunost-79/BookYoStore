import { Request, Response } from 'express';

import Book from '../models/book.model';

import { EStatusCodes } from '../types/Enums';

export const getAllBooks = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;

  try {
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      return res.status(EStatusCodes.BAD_REQUEST).json({ message: 'Invalid page number' });
    }

    if (isNaN(pageSize) || pageSize <= 0) {
      return res.status(EStatusCodes.BAD_REQUEST).json({ message: 'Invalid limit value' });
    }

    const skip = (pageNumber - 1) * pageSize;

    const books = await Book.find().skip(skip).limit(pageSize);

    if (!books) {
      return res.status(EStatusCodes.NOT_FOUND).json({ message: 'Book DB is empty' });
    }

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / pageSize);

    return res.status(EStatusCodes.OK).json({
      totalBooks,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      books,
    });
  } catch (e: unknown) {
    const err = e as Error;
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const getBooksById = async (req: Request, res: Response) => {
  const { id: bookId } = req.params;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res
        .status(EStatusCodes.NOT_FOUND)
        .json({ message: `Book with ID: ${bookId} was not found` });
    }
    return res.json(book);
  } catch (e: unknown) {
    const err = e as Error;
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
