function addRBAC (features) {
  return {
    type: 'ADD_RBAC',
    payload: features
  }
}
function addNavFeatures (features) {
  return {
    type: 'ADD_NAVFEATURES',
    payload: features
  }
}

export default { addRBAC, addNavFeatures }
