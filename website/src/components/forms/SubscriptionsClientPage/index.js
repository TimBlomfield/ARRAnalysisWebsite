'use client';

import { Fragment, useState } from 'react';
import cn from 'classnames';
import { DateTime } from 'luxon';
import { K_Theme } from '@/utils/common';
import { capitalizeFirstLetter } from '@/utils/func';
// Components
import CancelSubscriptionDialog from '@/components/dialogs/CancelSubscriptionDialog';
import Drawer from '@/components/Drawer';
import IconButton from '@/components/IconButton';
import PushButton from '@/components/PushButton';
// Images
import TriangleSvg from '@/../public/DropdownTriangle.svg';
import RecurringSvg from '@/../public/Recurring.svg';
// Styles
import styles from './styles.module.scss';


const SubscriptionsClientPage = ({ subscriptions }) => {

  const [isOpen_CancelSubscriptionDialog, setIsOpen_CancelSubscriptionDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  const InvoiceStatus = ({ status }) => (
    <div className={cn(styles.cell, styles.f12, styles.fntPrim)}>
      <div className={cn(styles.status, {
        [styles.paid]: status === 'paid',
        [styles.open]: status === 'open',
        [styles.draft]: status !== 'paid' && status !== 'open',
      })}>{capitalizeFirstLetter(status)}</div>
    </div>
  );

  const fnUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className={styles.main}>
      <div className={styles.title}>Subscriptions [{subscriptions.active.length + subscriptions.ended.length}]</div>
      <div className={styles.licenseList}>
        {subscriptions.active.map(sub => (
          <Drawer header={<SubscriptionHeader sub={sub} />} key={sub.id} initiallyCollapsed={false}>
            <section className={styles.body}>
              <PushButton theme={K_Theme.Danger}
                          extraClass={styles.btnCancel}
                          onClick={() => setIsOpen_CancelSubscriptionDialog(true)}>
                Cancel Subscription
              </PushButton>
              <div className={styles.txtDetails}>Subscription details</div>
              <div className={styles.hr} />
              <div className={styles.detailsGrid}>
                <div className={styles.cell}>Started</div>
                <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.start_date).toFormat('MMM d yyyy')}</div>
                <div className={styles.cell}>Created</div>
                <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.created).toFormat('MMM d yyyy, h:mm a')}</div>
                <div className={styles.cell}>Current period</div>
                <div className={cn(styles.cell, styles.dk)}><span className={styles.u}>{DateTime.fromSeconds(sub.current_period_start).toFormat('MMM d yyyy')}</span>&nbsp;&nbsp;to&nbsp;&nbsp;<span className={styles.u}>{DateTime.fromSeconds(sub.current_period_end).toFormat('MMM d yyyy')}</span></div>
              </div>
              {sub.kUpcoming != null &&
                <>
                  <div className={cn(styles.txtDetails, styles.mt50)}>Upcoming invoice</div>
                  <div className={styles.hr} />
                  <div className={styles.invoiceGrid}>
                    <div className={cn(styles.headerCell, styles.first)}>Description</div>
                    <div className={styles.headerCell}>Qty</div>
                    <div className={styles.headerCell}>Unit price</div>
                    <div className={styles.headerCell}>Amount</div>
                    <div className={styles.fullUnderline} />
                    {sub.kUpcoming.lines.map(line => (
                      <Fragment key={line.id}>
                        <div className={cn(styles.lineCell, styles.first, styles.underline, styles.stretch)}>
                          {DateTime.fromSeconds(line.period.start).toFormat('MMM, d yyyy')} - {DateTime.fromSeconds(line.period.end).toFormat('MMM, d yyyy')}
                        </div>
                        <div className={styles.fullUnderline} />
                        <div className={cn(styles.lineCell, styles.first, styles.underline)}>
                          {sub.kProduct.name}
                        </div>
                        <div className={styles.lineCell}>{line.quantity}</div>
                        <div className={styles.lineCell}>{fnUSD.format(line.unit_amount_excluding_tax / 100)}</div>
                        <div className={styles.lineCell}>{fnUSD.format(line.amount / 100)}</div>
                        <div className={styles.fullUnderline} />
                      </Fragment>
                    ))}
                    <div className={cn(styles.lineCell, styles.start2, styles.prim)}>Subtotal</div>
                    <div className={cn(styles.lineCell, styles.prim)}>{fnUSD.format(sub.kUpcoming.subtotal / 100)}</div>
                    <div className={cn(styles.lineCell, styles.start2, styles.prim)}>Total excluding tax</div>
                    <div className={cn(styles.lineCell, styles.prim)}>{fnUSD.format(sub.kUpcoming.total_excluding_tax / 100)}</div>
                    <div className={cn(styles.lineCell, styles.start2, styles.prim)}>Tax</div>
                    <div className={cn(styles.lineCell, styles.prim)}>-</div>
                    <div className={cn(styles.lineCell, styles.start2, styles.prim)}>Total</div>
                    <div className={cn(styles.lineCell, styles.prim)}>{fnUSD.format(sub.kUpcoming.total / 100)}</div>
                    <div className={styles.fullUnderline} />
                    <div className={cn(styles.lineCell, styles.start2, styles.prim)}>Amount due</div>
                    <div className={cn(styles.lineCell, styles.prim)}>{fnUSD.format(sub.kUpcoming.amount_due / 100)}</div>
                  </div>
                  <div className={styles.hr} />
                </>
              }
              {sub.kInvoices != null &&
                <>
                  <div className={cn(styles.txtDetails, styles.mt50)}>Invoices</div>
                  <div className={styles.hr} />
                  <div className={styles.invoiceListGrid}>
                    <div className={cn(styles.cell, styles.first, styles.fntPrim, styles.f12)}>Amount</div>
                    <div></div>
                    <div></div>
                    <div className={cn(styles.cell, styles.fntPrim, styles.f12)}>Frequency</div>
                    <div className={cn(styles.cell, styles.fntPrim, styles.f12)}>Invoice number</div>
                    <div className={cn(styles.cell, styles.fntPrim, styles.f12)}>Customer email</div>
                    <div className={cn(styles.cell, styles.fntPrim, styles.f12)}>Due</div>
                    <div className={cn(styles.cell, styles.fntPrim, styles.f12)}>Created</div>
                    <div className={styles.fullUnderline} />
                    {sub.kInvoices.map(invoice => (
                      <Fragment key={invoice.id}>
                        <div className={cn(styles.cell, styles.fntPrim, styles.first)}>{fnUSD.format(invoice.amount_paid / 100)}</div>
                        <div className={cn(styles.cell, styles.fntSec)}>{invoice.currency.toUpperCase()}</div>
                        <InvoiceStatus status={invoice.status} />
                        <div className={cn(styles.cell, styles.fntSec, styles.fh)}><RecurringSvg className={styles.recur}/>{sub.plan.interval === 'month' ? 'Monthly' : 'Yearly'}</div>
                        <div className={cn(styles.cell, styles.fntSec)}>{invoice.number}</div>
                        <div className={cn(styles.cell, styles.fntSec)}>{invoice.customer_email}</div>
                        <div className={cn(styles.cell, styles.fntSec)}>—</div>
                        <div className={cn(styles.cell, styles.fntSec)}>{DateTime.fromSeconds(invoice.created).toFormat('MMM d yyyy, h:mm a')}</div>
                        <div className={styles.fullUnderline} />
                      </Fragment>
                    ))}
                  </div>
                </>
              }
            </section>
          </Drawer>
        ))}
        </div>
      <CancelSubscriptionDialog isOpen={isOpen_CancelSubscriptionDialog}
                                notifyClosed={() => setIsOpen_CancelSubscriptionDialog(false)}
                                subscription={1}
                                passSuccessMessage={msg => setSuccessMessage(msg)} />
    </div>
  );
};


export default SubscriptionsClientPage;
