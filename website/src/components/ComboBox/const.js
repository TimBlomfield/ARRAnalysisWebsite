const C = {
  emptyArr: [], // Must use this because useEffect will fire perpetually if we did it in the ComboBox argument list (like: options = [])
  getOptLabel: x => x,
  getOpdData: () => null,
};


export default C;
