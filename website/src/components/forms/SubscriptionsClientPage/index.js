'use client';

import cn from 'classnames';
import { K_Theme } from '@/utils/common';
// Components
import Drawer from '@/components/Drawer';
import IconButton from '@/components/IconButton';
// Images
import TriangleSvg from '@/../public/DropdownTriangle.svg';
// Styles
import styles from './styles.module.scss';


const SubscriptionsClientPage = ({ subscriptions }) => {
  console.log(subscriptions);
  const SubscriptionHeader = ({ sub, collapsed, expandCollapse }) => (
    <header className={styles.hdr}>
      <IconButton theme={K_Theme.Light}
                  transparent
                  invertBkTheme
                  svg={TriangleSvg}
                  svgScale={1.5}
                  svgClassName={cn(styles.triangle, {[styles.expanded]: !collapsed})}
                  onClick={expandCollapse} />
      <div className={styles.planName}>{sub.kProduct.name + (sub.quantity > 1 ? ` × ${sub.quantity}` : '')}</div>
      <div className={styles.billing}>{sub.plan.interval === 'year' ? 'Billing yearly' : 'Billing monthly'}</div>
      <div className={styles.spacer} />
      {sub.status === 'active' && <div className={styles.activeBar}>Active</div>}
    </header>
  );

  return (
    <div className={styles.main}>
      <div className={styles.title}>Subscriptions [{subscriptions.active.length + subscriptions.ended.length}]</div>
      <div className={styles.licenseList}>
        {subscriptions.active.map(sub => (
          <Drawer header={<SubscriptionHeader sub={sub} />} key={sub.id} initiallyCollapsed={false}>
            <section className={styles.body}>

            </section>
          </Drawer>
        ))}
      </div>
    </div>
  );
};


export default SubscriptionsClientPage;
