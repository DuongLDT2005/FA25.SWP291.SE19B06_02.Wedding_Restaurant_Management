import DishCategoryService from '../services/DishCategoryService.js';

class DishCategoryController {
  static async create(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const payload = req.body;
      const created = await DishCategoryService.createForPartner(actorUserId, payload);
      res.status(201).json(created);
    } catch (err) {
      console.error('DishCategory create error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const id = req.params.id;
      const patch = req.body;
      const updated = await DishCategoryService.updateForPartner(actorUserId, id, patch);
      res.json(updated);
    } catch (err) {
      console.error('DishCategory update error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const id = req.params.id;
      const ok = await DishCategoryService.deleteForPartner(actorUserId, id);
      if (!ok) return res.status(404).json({ error: 'Not found or not authorized' });
      res.json({ success: true });
    } catch (err) {
      console.error('DishCategory delete error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async listByRestaurant(req, res) {
    try {
      const restaurantID = req.params.restaurantId;
      const rows = await DishCategoryService.listByRestaurant(restaurantID);
      res.json(rows);
    } catch (err) {
      console.error('DishCategory list error', err);
      res.status(400).json({ error: err.message });
    }
  }
}

export default DishCategoryController;
