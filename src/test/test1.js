function isSameQuadrant(cood, objA, objB) {
  var coodX = cood.x;
  var coodY = cood.y;
  var xoA = objA.x,
    yoA = objA.y,
    xoB = objB.x,
    yoB = objB.y;

  if (xoA - coodX > 0 && xoB - coodX > 0) {
    if (
      (yoA - coodY > 0 && yoB - coodY > 0) ||
      (yoA - coodY < 0 && yoB - coodY < 0)
    ) {
      return true;
    }
    return false;
  } else if (xoA - coodX < 0 && xoB - coodX < 0) {
    if (
      (yoA - coodY > 0 && yoB - coodY > 0) ||
      (yoA - coodY < 0 && yoB - coodY < 0)
    ) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}
