'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { K_Theme } from '@/utils/common';
// Components
import TabSwitch from '@/components/TabSwitch';


const PageSelector = ({ theme = K_Theme.Dark, tabs }) => {
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  const selectFn = useCallback(opt => {
    setSelected(opt);
    router.push(tabs[opt].url);
  }, [tabs]);
  const getLabelFn = useCallback(opt => opt.name, []);

  return <TabSwitch theme={theme} options={tabs} getOptionLabel={getLabelFn} selected={selected} onSelect={selectFn} />;
};


export default PageSelector;
