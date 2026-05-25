const R = 6371 // Earth radius in km

export function haversine(lat1, lng1, lat2, lng2) {
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function scoreFromDistance(km) {
  if (km < 0.5) return 1000
  if (km < 1)   return 900
  if (km < 2)   return 750
  if (km < 5)   return 500
  if (km < 10)  return 250
  if (km < 20)  return 100
  return 0
}
