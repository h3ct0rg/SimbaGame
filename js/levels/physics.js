export function resolveCollisions(entity, platforms, dt) {
  entity.x += entity.vx * dt;
  entity.y += entity.vy * dt;
  entity.grounded = false;

  for (const p of platforms) {
    const left = entity.x - entity.width / 2;
    const right = entity.x + entity.width / 2;
    const top = entity.y;
    const bottom = entity.y + entity.height;

    const overlapX = Math.min(right, p.x + p.w) - Math.max(left, p.x);
    const overlapY = Math.min(bottom, p.y + p.h) - Math.max(top, p.y);
    if (overlapX <= 0 || overlapY <= 0) continue;

    // Resolve along the axis with the smaller penetration: this is what keeps
    // jump arcs that graze a platform's underside/corner from being read as a
    // solid side wall (which happens if X and Y are each fully resolved in
    // their own independent pass regardless of how shallow the overlap is).
    if (overlapX < overlapY) {
      const entityCenterX = entity.x;
      const platformCenterX = p.x + p.w / 2;
      if (entityCenterX < platformCenterX) entity.x = p.x - entity.width / 2;
      else entity.x = p.x + p.w + entity.width / 2;
      entity.vx = 0;
    } else {
      const entityCenterY = entity.y + entity.height / 2;
      const platformCenterY = p.y + p.h / 2;
      if (entityCenterY < platformCenterY) {
        entity.y = p.y - entity.height;
        entity.vy = 0;
        entity.grounded = true;
      } else {
        entity.y = p.y + p.h;
        entity.vy = 0;
      }
    }
  }
}
