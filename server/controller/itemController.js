import Item from "../models/Item.js";
import { itemSchema } from "../utils/zodSchemas.js";

export const createItem = async (req, res, next) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = new Item({ ...validatedData, userId: req.user.id });
    await item.save();
    return res.status(201).json({ message: "Item created", item });
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.body;

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const items = await Item.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};

export const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(item, validatedData);
    await item.save();

    res.json({ message: "Item updated", item });
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();

    res.json({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};
