import mongoose, { Schema } from 'mongoose';

import { Book } from '../types/types.model';

const bookSchema = new Schema<Book>({
  title: { type: String, required: true },
  images: {
    image: { type: String, required: true },
    previewImage: { type: String, required: true },
  },
  productInformation: {
    genre: { type: String, default: null },
    stock: { type: String, default: null },
    rating: { type: Number, default: null },
    upc: { type: String, default: null },
    productType: { type: String, default: null },
    priceInfo: {
      price: { type: String, default: null },
      currencySymbol: { type: String, default: null },
    },
    numberOfReviews: { type: String, default: null },
  },
  description: { type: String, default: null },
});

const Book = mongoose.model<Book>('Book', bookSchema);

export default Book;
