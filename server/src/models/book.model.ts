import mongoose, { Schema } from 'mongoose';

import { Book } from '../types/types.model';

const bookSchema = new Schema<Book>({
  title: { type: String, required: true },
  images: {
    mini_images: [{ type: String }],
    medium_images: [{ type: String }],
    big_images: [{ type: String }],
  },
  bookDetails: {
    article: { type: String, default: null },
    author: { type: String, default: null },
    series: { type: String, default: null },
    language: { type: String, default: null },
    imprintDate: { type: String, default: null },
    bookCover: { type: String, default: null },
    pages: { type: String, default: null },
    format: { type: String, default: null },
    translator: { type: String, default: null },
    ISBN: { type: String, default: null },
    manufacturer: { type: String, default: null },
    barcode: { type: String, default: null },
  },
  bookPrice: {
    price: { type: String, default: null },
    salePrice: { type: String, default: null },
    priceCurrency: { type: String, default: null },
  },
  description: [{ type: String, default: null }],
});

const Book = mongoose.model<Book>('Book', bookSchema);

export default Book;
