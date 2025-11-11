import MenuService from '../services/MenuService.js';

class MenuController {
  static async create(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const payload = req.body;
      const created = await MenuService.createMenuForPartner(actorUserId, payload);
      res.status(201).json(created);
    } catch (err) {
      console.error('Menu create error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const menuID = req.params.id;
      const patch = req.body;
      const updated = await MenuService.updateMenuForPartner(actorUserId, menuID, patch);
      res.json(updated);
    } catch (err) {
      console.error('Menu update error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const actorUserId = req.user?.userId;
      const menuID = req.params.id;
      const ok = await MenuService.deleteMenuForPartner(actorUserId, menuID);
      if (!ok) return res.status(404).json({ error: 'Not found or not authorized' });
      res.json({ success: true });
    } catch (err) {
      console.error('Menu delete error', err);
      res.status(400).json({ error: err.message });
    }
  }

  static async listByRestaurant(req, res) {
    try {
      const restaurantID = req.params.restaurantId;
      const rows = await MenuService.listByRestaurant(restaurantID);
      res.json(rows);
    } catch (err) {
      console.error('Menu list error', err);
      res.status(400).json({ error: err.message });
    }
  }
}

export default MenuController;
