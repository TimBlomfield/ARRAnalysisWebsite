'use client';

import { useMemo } from 'react';


const Option = ({fn, opt, style, hlt, onClk}) => {
  const memo = useMemo(() => fn(opt, style, hlt, onClk), [hlt === opt.idxFiltered, opt.memo, onClk]);
  return <>{memo}</>;
};


export default Option;
