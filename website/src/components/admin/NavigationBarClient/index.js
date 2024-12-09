'use client';

import { usePathname } from 'next/navigation';
import cn from 'classnames';
// Components
import Link from 'next/link';
// Images
import LogoSvg from '@/../public/logo-blue.svg';
// Styles
import styles from './styles.module.scss';


const LinkPaths = {
  Dashboard: '/admin/dashboard',
  Profile: '/admin/profile',
  Subscriptions: '/admin/subscriptions',
  CustomerLicenses: '/admin/licenses',
  UserLicenses: '/admin/user-licenses',
  Downloads: '/admin/downloads',
  Purchase: '/admin/purchase',
};


const NavigationBarClient = ({ isCustomer, isUser }) => {
  const pathname = usePathname();

  return (
    <div className={styles.navbar}>
      <Link className={styles.logoLink} href={LinkPaths.Dashboard}>
        <LogoSvg className={styles.logo} />
      </Link>
      <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.Dashboard)})}
            prefetch={false}
            href={LinkPaths.Dashboard}>
        Dashboard
      </Link>
      <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.Profile)})}
            prefetch={false}
            href={LinkPaths.Profile}>
        Profile
      </Link>
      {isCustomer &&
        <>
          <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.Subscriptions)})}
                prefetch={false}
                href={LinkPaths.Subscriptions}>
            Subscriptions
          </Link>
          <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.CustomerLicenses)})}
                prefetch={false}
                href={LinkPaths.CustomerLicenses}>
            Customer Licenses
          </Link>
        </>
      }
      {isUser &&
        <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.UserLicenses)})}
              prefetch={false}
              href={LinkPaths.UserLicenses}>
          User Licenses
        </Link>
      }
      <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.Downloads)})}
            prefetch={false}
            href={LinkPaths.Downloads}>
        Downloads
      </Link>
      <Link className={cn(styles.pageLink, {[styles.active]: pathname.startsWith(LinkPaths.Purchase)})}
            prefetch={false}
            href={LinkPaths.Purchase}>
        Purchase
      </Link>
    </div>
  );
};


export default NavigationBarClient;
