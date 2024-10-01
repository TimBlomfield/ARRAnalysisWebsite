// Components
import SignOutButton from '@/components/SignOutButton';
// Styles
import styles from './styles.module.scss';


const Header = () => {
  return (
    <div className={styles.header}>
      <div>Header</div>
      <SignOutButton />
    </div>
  );
};


export default Header;
