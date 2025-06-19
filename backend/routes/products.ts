import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController';
import { authenticateToken } from '../middleware/auth';
import { validateProduct, validateUpdateProduct } from '../middleware/validation';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', validateProduct, createProduct);
router.patch('/:id', validateUpdateProduct, updateProduct);
router.delete('/:id', deleteProduct);

export default router;