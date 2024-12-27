
const initST = () => {
  const _st = { time: [], deg: [] };
  let next;

  for (let i = 1; i < 60; ++i) {
    _st.time.push({
      value: i,
      text: i === 1 ? '1 minute' : `${i} minutes`,
    });
  }
  _st.time[0].offset = 0;
  next = _st.time.length;
  for (let i = 1; i < 48; ++i) {
    _st.time.push({
      value: i,
      text: i === 1 ? '1 hour' : `${i} hours`,
    });
  }
  _st.time[next].offset = 50;
  next = _st.time.length;
  for (let i = 2; i < 6; ++i) {
    _st.time.push({
      value: i,
      text: i === 1 ? '1 day' : `${i} days`,
    });
  }
  _st.time[next].offset = 80;
  _st.time[_st.time.length - 1].offset = 100;

  for (let i = -100; i <= 100; ++i) {
    _st.deg.push({
      value: i,
      text: `${i} °C`,
    });
  }
  _st.deg[0].offset = 0;
  _st.deg[100].offset = 30;
  _st.deg[_st.deg.length - 1].offset = 100;

  return _st;
};


export {
  initST,
};
