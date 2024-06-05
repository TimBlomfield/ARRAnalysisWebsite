import cn from 'classnames';
// Styles
import styles from './styles.module.scss';


const MenuButton = ({ idMB = '', bOpened = false, bLight = false, onClick }) => (
  <>
    <button id={idMB} className={cn(styles.button, {[styles.down]: bOpened, [styles.light]: bLight})} onClick={onClick}>
      <div className={styles.container}>
        <div className={cn(styles.bar, styles.bar1)} />
        <div className={cn(styles.bar, styles.bar2)} />
        <div className={cn(styles.bar, styles.bar3)} />
      </div>
    </button>
  </>
);


export default MenuButton;
