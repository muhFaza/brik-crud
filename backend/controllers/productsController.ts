import { Response } from "express";
import Product from "../models/Product";
import {
  AuthenticatedRequest,
  CreateProductData,
  UpdateProductData,
} from "../types";
import { Op } from "sequelize";

export const getAllProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { search } = req.query;

    const whereCondition: any = {};
    
    if (search && typeof search === 'string') {
      whereCondition.name = {
        [Op.iLike]: `%${search}%`
      };
    }
    const products = await Product.findAll({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      q,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const whereConditions: any = {};

    if (q && typeof q === "string") {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }

    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        whereConditions.price[Op.gte] = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        whereConditions.price[Op.lte] = Number(maxPrice);
      }
    }

    if (inStock !== undefined) {
      if (inStock === "true") {
        whereConditions.stock = { [Op.gt]: 0 };
      } else if (inStock === "false") {
        whereConditions.stock = { [Op.eq]: 0 };
      }
    }

    if (isActive !== undefined) {
      whereConditions.isActive = isActive === "true";
    }


    const validSortFields = [
      "name",
      "price",
      "stock",
      "createdAt",
      "updatedAt",
    ];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";
    const sortDirection =
      (sortOrder as string).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const products = await Product.findAndCountAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
    });


    res.json({
      products,
      filters: {
        query: q || null,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        inStock: inStock || null,
        isActive: isActive || null,
      },
      sorting: {
        sortBy: sortField,
        sortOrder: sortDirection,
      },
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const productData: CreateProductData = req.body;

    const product = await Product.create({
      ...productData,
      isActive: productData.isActive ?? true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateProductData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.update(updateData);
    await product.reload();

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await product.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
