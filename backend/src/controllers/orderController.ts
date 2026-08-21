import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { orderService, OrderService } from '../services/orderService';
import { sendSuccess, sendCreated } from '../utils/response';

export class OrderController {
  constructor(private service: OrderService = orderService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.service.createOrder(req.user!.userId, req.body);
      sendCreated(res, order, 'Rental booking confirmed successfully');
    } catch (error) {
      next(error);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter = req.query.filter as 'all' | 'active' | 'completed';
      let orders;

      if (req.user?.role === 'admin') {
        orders = await this.service.listAllOrders(filter);
      } else {
        orders = await this.service.listCustomerOrders(req.user!.userId, filter);
      }

      sendSuccess(res, orders, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.service.getOrderById(req.params.id, req.user?.userId, req.user?.role);
      sendSuccess(res, order, 'Order details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, note } = req.body;
      const updated = await this.service.updateOrderStatus(
        req.params.id,
        status,
        note,
        req.user?.userId,
        req.user?.role
      );
      sendSuccess(res, updated, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const orderController = new OrderController();
