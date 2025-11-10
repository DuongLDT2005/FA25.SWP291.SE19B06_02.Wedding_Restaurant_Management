// Helper utilities to convert Sequelize instances to plain DTOs
export function toDTO(instance) {
  if (!instance) return null;
  if (typeof instance.get === 'function') return instance.get({ plain: true });
  // already plain
  return instance;
}

export function toDTOs(list) {
  if (!list) return [];
  if (!Array.isArray(list)) return [toDTO(list)];
  return list.map(i => toDTO(i));
}

export default { toDTO, toDTOs };
