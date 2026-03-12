import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/ProductService';
import { AuthRequest } from '../middleware/authMiddleware';

export class ProductController {
  private productService = new ProductService();

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await this.productService.getProductById(Number(req.params.id));
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error: any) {
      next(error);
    }
  };

  createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
      const productData = {
        ...req.body,
        seller_id: req.user.id,
        image_url: imageUrl,
        price: Number(req.body.price)
      };
      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      const product = await this.productService.updateProduct(Number(req.params.id), req.user.id, req.body);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
      await this.productService.deleteProduct(Number(req.params.id), req.user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
