import cn from 'classnames';
// Components
import Loading from '@/components/Loading';
// Styles
import styles from './styles.module.scss';


const ComponentsPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.title}>&lt;Loading size={'{1}'} text=&quot;Hello&quot; /&gt;</div>
      <section className={styles.loadingGrid}>
        <div className={styles.cell}><Loading /></div>
        <div className={styles.cell}><Loading scale={1.5} /></div>
        <div className={styles.cell}><Loading scale={2} /></div>
        <div className={styles.cell}><Loading text="Loading..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Loading..." /></div>
        <div className={cn(styles.cell, styles.wider)}><Loading text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
        <div className={styles.cell}><Loading scale={2} text="Lorem ipsum dolor sit amet consectetur adipiscing elit..." /></div>
      </section>
    </main>
  );
};


export default ComponentsPage;
