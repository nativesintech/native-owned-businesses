export const parseToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const googleToGeoJSON = ({ location }) => ({ type: 'Point', coordinates: [location.lng, location.lat] })
