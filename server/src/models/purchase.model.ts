import mongoose, { Document, Schema } from 'mongoose';

export type PurchaseItem = {
  cardId: mongoose.Types.ObjectId;
  quantity: number;
  timestamp: Date;
};

export interface PurchaseList extends Document {
  userId: mongoose.Types.ObjectId;
  items: PurchaseItem[];
}

const purchaseItemSchema = new Schema<PurchaseItem>({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const purchaseListSchema = new Schema<PurchaseList>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [purchaseItemSchema],
});

const PurchaseList = mongoose.model<PurchaseList>('PurchaseList', purchaseListSchema);

export default PurchaseList;
