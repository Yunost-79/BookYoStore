import { Document } from 'mongoose';

type Images = {
  mini_images: string[];
  medium_images: string[];
  big_images: string[];
};

type BookDetails = {
  article: string | null;
  author: string | null;
  series: string | null;
  language: string | null;
  imprintDate: string | null;
  bookCover: string | null;
  pages: string | null;
  format: string | null;
  translator: string | null;
  ISBN: string | null;
  manufacturer: string | null;
  barcode: string | null;
};

type BookPrice = {
  price: string | null;
  salePrice: string | null;
  priceCurrency: string | null;
};

export interface Book extends Document {
  title: string;
  images: Images;
  bookDetails: BookDetails;
  bookPrice: BookPrice;
  description: (string | null)[];
}
