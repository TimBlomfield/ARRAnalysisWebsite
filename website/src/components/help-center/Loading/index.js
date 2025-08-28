// Components
import LoadingSSR from '@/components/LoadingSSR';
// Styles
import styles from './styles.module.scss';


const Loading = () => (
  <section className={styles.loading}>
    <LoadingSSR scale={1.5} />
  </section>
);


export default Loading;
