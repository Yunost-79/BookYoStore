import { Document } from 'mongoose';

type Images = {
  image: string;
  previewImage: string;
};

type PriceInfo = {
  price: string | null;
  currencySymbol: string | null;
};

type ProductInformation = {
  genre: string | null;
  stock: string | null;
  rating: number | null;
  upc: string | null;
  productType: string | null;
  priceInfo: PriceInfo;
  numberOfReviews: string | null;
};

export interface Book extends Document {
  title: string;
  images: Images;
  productInformation: ProductInformation;
  description: string | null;
}
