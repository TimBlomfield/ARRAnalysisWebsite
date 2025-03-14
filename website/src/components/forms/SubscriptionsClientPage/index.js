'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import { toast } from 'react-toastify';
import axios from 'axios';
import { K_Theme } from '@/utils/common';
import { capitalizeFirstLetter } from '@/utils/func';
// Components
import CancelSubscriptionDialog from '@/components/dialogs/CancelSubscriptionDialog';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog';
import Drawer from '@/components/Drawer';
import IconButton from '@/components/IconButton';
import Loading from '@/components/Loading';
import PushButton from '@/components/PushButton';
// Images
import TriangleSvg from '@/../public/DropdownTriangle.svg';
import RecurringSvg from '@/../public/Recurring.svg';
import ClockSvg from '@/../public/Clock.svg';
import QuestionSvg from '@/../public/question.svg';
// Styles
import styles from './styles.module.scss';


const SubscriptionsClientPage = ({ subscriptions }) => {
  const refPrevSub = useRef(subscriptions);
  const router = useRouter();

  const [isOpen_CancelSubscriptionDialog, setIsOpen_CancelSubscriptionDialog] = useState(null);
  const [isOpen_RevokeSubscriptionDialog, setIsOpen_RevokeSubscriptionDialog] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen_CancelSubscriptionDialog == null && successMessage !== '') {
      toast.success(successMessage);
      setSuccessMessage('');
      router.refresh();
      setLoading(true);
    }
  }, [isOpen_CancelSubscriptionDialog, successMessage]);

  useEffect(() => {
    if (loading && refPrevSub.current !== subscriptions) {
      setLoading(false);
      refPrevSub.current = subscriptions;
    }
  }, [loading, subscriptions]);

  const onRevokeCancellation = useCallback(subscriptionId => {
    setLoading(true);
    setIsOpen_RevokeSubscriptionDialog(null);

    try {
      axios.post('/api/stripe/revoke-cancellation-on-subscription', { subscriptionId })
        .then(res => {
          router.refresh();
          toast.success(res.data.message);
        })
        .catch(err => {
          setLoading(false);
          toast.error(err.response?.data?.message ?? 'Could not cancel subscription!');
        });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const SubscriptionHeader = ({ sub, disabled, collapsed, expandCollapse }) => (
    <header className={styles.hdr}>
      <IconButton theme={K_Theme.Light}
                  transparent
                  invertBkTheme
                  disabled={disabled}
                  svg={TriangleSvg}
                  svgScale={1.5}
                  svgClassName={cn(styles.triangle, {[styles.expanded]: !collapsed})}
                  onClick={expandCollapse} />
      <div className={styles.planName}>{sub.kProduct.name + (sub.quantity > 1 ? ` × ${sub.quantity}` : '')}</div>
      <div className={styles.billing}>{sub.plan.interval === 'year' ? 'Billing yearly' : 'Billing monthly'}</div>
      <div className={styles.spacer} />
      {sub.status === 'active' && <div className={styles.activeBar}>Active</div>}
      {sub.kCancel.cancel_at != null &&
        <div className={styles.cancelBar}>
          <span>Cancels {DateTime.fromSeconds(sub.kCancel.cancel_at).toFormat('MMM d yyyy')}</span>
          <ClockSvg className={styles.clock} />
        </div>
      }
      {sub.status === 'canceled' && <div className={cn(styles.cancelBar, styles.dk)}>Canceled</div>}
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
      {loading &&
        <div className={styles.overlay}>
          <Loading theme={K_Theme.Dark} scale={2} />
        </div>
      }
      <div className={styles.title}>Subscriptions [{subscriptions.length}]</div>
      <div className={styles.subscriptionList}>
        {subscriptions.map(sub => (
          <Drawer header={<SubscriptionHeader sub={sub} disabled={loading} />} key={sub.id} initiallyCollapsed={false}>
            <section className={styles.body}>
              {(sub.status === 'active' && sub.kCancel.cancel_at == null) &&
                <PushButton theme={K_Theme.Danger}
                            disabled={loading}
                            extraClass={styles.btnCancel}
                            onClick={() => { setIsOpen_CancelSubscriptionDialog(sub); }}>
                  Cancel Subscription
                </PushButton>
              }
              {sub.kCancel.cancel_at != null &&
                <PushButton theme={K_Theme.Light}
                            disabled={loading}
                            invertBkTheme
                            extraClass={styles.btnCancel}
                            onClick={() => { setIsOpen_RevokeSubscriptionDialog(sub); }}>
                  Revoke Cancellation
                </PushButton>
              }
              <div className={styles.txtDetails}>Subscription details</div>
              <div className={styles.hr} />
              <div className={styles.detailsGrid}>
                {sub.status === 'active' &&
                  <>
                    <div className={styles.cell}>Started</div>
                    <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.start_date).toFormat('MMM d yyyy')}</div>
                  </>
                }
                <div className={styles.cell}>Created</div>
                <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.created).toFormat('MMM d yyyy, h:mm a')}</div>
                {sub.ended_at != null &&
                  <>
                    <div className={styles.cell}>Ended at</div>
                    <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.ended_at).toFormat('MMM d yyyy, h:mm a')}</div>
                  </>
                }
                {sub.status === 'active' &&
                  <>
                    <div className={styles.cell}>Current period</div>
                    <div className={cn(styles.cell, styles.dk)}><span className={styles.u}>{DateTime.fromSeconds(sub.current_period_start).toFormat('MMM d yyyy')}</span>&nbsp;&nbsp;to&nbsp;&nbsp;<span className={styles.u}>{DateTime.fromSeconds(sub.current_period_end).toFormat('MMM d yyyy')}</span></div>
                  </>
                }
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
              {sub.kCancel.cancel_at != null &&
                <>
                  <div className={cn(styles.txtDetails, styles.mt50)}>Cancellation Details</div>
                  <div className={styles.hr} />
                  <div className={styles.detailsGrid}>
                    <div className={styles.cell}>Scheduled to cancel on</div>
                    <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(sub.kCancel.cancel_at).toFormat('MMM d yyyy, h:mm a')}</div>
                  </div>
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
                        <div className={cn(styles.cell, styles.fntSec, styles.fh)}><RecurringSvg className={styles.recur} />{sub.plan.interval === 'month' ? 'Monthly' : 'Yearly'}</div>
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
      <CancelSubscriptionDialog isOpen={isOpen_CancelSubscriptionDialog != null}
                                notifyClosed={() => setIsOpen_CancelSubscriptionDialog(null)}
                                subscription={isOpen_CancelSubscriptionDialog}
                                passSuccessMessage={msg => setSuccessMessage(msg)} />
      <ConfirmationDialog isOpen={isOpen_RevokeSubscriptionDialog != null}
                          notifyClosed={() => setIsOpen_RevokeSubscriptionDialog(null)}
                          titleText="Revoke Cancellation?"
                          button1Text="Revoke"
                          onConfirm={() => onRevokeCancellation(isOpen_RevokeSubscriptionDialog.id)}>
        <div className={styles.dlg}>
          <QuestionSvg className={styles.img} />
          <div className={styles.second}>
            {isOpen_RevokeSubscriptionDialog != null &&
              <>
                <div className={styles.product}>{isOpen_RevokeSubscriptionDialog.kProduct.name}</div>
                <div className={styles.billing}>(billing {isOpen_RevokeSubscriptionDialog.plan.interval === 'year' ? 'yearly' : 'monthly'})</div>
                <div className={styles.detailsGrid}>
                  <div className={styles.cell}>Started</div>
                  <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(isOpen_RevokeSubscriptionDialog.start_date).toFormat('MMM d yyyy')}</div>
                  <div className={styles.cell}>Created</div>
                  <div className={cn(styles.cell, styles.dk)}>{DateTime.fromSeconds(isOpen_RevokeSubscriptionDialog.created).toFormat('MMM d yyyy, h:mm a')}</div>
                  <div className={styles.cell}>Current period</div>
                  <div className={cn(styles.cell, styles.dk)}><span className={styles.u}>{DateTime.fromSeconds(isOpen_RevokeSubscriptionDialog.current_period_start).toFormat('MMM d yyyy')}</span>&nbsp;&nbsp;to&nbsp;&nbsp;<span className={styles.u}>{DateTime.fromSeconds(isOpen_RevokeSubscriptionDialog.current_period_end).toFormat('MMM d yyyy')}</span></div>
                  <div className={cn(styles.cell, styles.r)}>Scheduled to cancel on</div>
                  <div className={cn(styles.cell, styles.r)}>{DateTime.fromSeconds(isOpen_RevokeSubscriptionDialog.kCancel.cancel_at).toFormat('MMM d yyyy, h:mm a')}</div>
                </div>
              </>
            }
          </div>
        </div>
      </ConfirmationDialog>
    </div>
  );
};


export default SubscriptionsClientPage;
