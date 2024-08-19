import { Request, Response } from 'express';

import PurchaseList, { PurchaseItem } from '../models/purchase.model';

import { EStatusCodes } from '../types/Enums';

type AddToPurchaseListRequest = {
  items: Omit<PurchaseItem, 'timestamp'>[];
};

type PurchaseRequest = Request<{}, {}, AddToPurchaseListRequest>;

export const addToPurchaseList = async (req: PurchaseRequest, res: Response) => {
  const items: Omit<PurchaseItem, 'timestamp'>[] = req.body.items;
  const userId = req.user._id;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(EStatusCodes.BAD_REQUEST).json({ message: 'Items array is required' });
  }

  try {
    let purchaseList = await PurchaseList.findOne({ userId });

    if (!purchaseList) {
      purchaseList = new PurchaseList({ userId, items: [] });
    }

    const newItemsWithTimestamp = items.map((item) => ({
      ...item,
      timestamp: new Date(),
    }));

    newItemsWithTimestamp.forEach((newItem) => {
      const existingItemIndex = purchaseList.items.findIndex(
        (p) =>
          p.cardId.toString() === newItem.cardId.toString() &&
          p.timestamp.getTime() === newItem.timestamp.getTime()
      );

      if (existingItemIndex !== -1) {
        const existingItem = purchaseList.items[existingItemIndex];
        existingItem.quantity += newItem.quantity;
      } else {
        purchaseList.items.push(newItem);
      }
    });
    await purchaseList.save();

    return res.status(EStatusCodes.OK).json({ message: 'Purchase list updated successfully' });
  } catch (e) {
    const err = e as Error;
    return res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const getPurchaseHistory = async (req: Request, res: Response) => {
  const userId = req.user._id;

  try {
    const purchaseList = await PurchaseList.findOne({ userId });

    if (!purchaseList) {
      return res.status(EStatusCodes.NOT_FOUND).json({ message: 'No purchase history found' });
    }

    return res.status(EStatusCodes.OK).json(purchaseList);
  } catch (e) {
    const err = e as Error;
    return res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};

export const deleteFromPurchaseHistory = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const purchaseList = await PurchaseList.findOne({ userId });

    if (!purchaseList) {
      return res.status(EStatusCodes.NOT_FOUND).json({ message: 'No purchase history found' });
    }

    const itemIndex = purchaseList.items.findIndex((item) => item.cardId.toString() === itemId);

    if (itemIndex === -1) {
      return res
        .status(EStatusCodes.NOT_FOUND)
        .json({ message: 'Item not found in purchase history' });
    }

    purchaseList.items.splice(itemIndex, 1);
    await purchaseList.save();

    return res.status(EStatusCodes.OK).json({ message: 'Item removed from purchase history' });
  } catch (e) {
    const err = e as Error;
    return res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
