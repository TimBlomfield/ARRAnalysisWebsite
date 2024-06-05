import LinkButton from '@/components/LinkButton';
import { LinkButton_Theme } from '@/utils/common';
// Styles
import styles from './page.module.scss';


const LandingPage = () => {
  return (
    <div className={styles.temp}>
      {Array.from({ length: 25 }).map((item, idx) =>
        <div className={styles.item} key={idx}>
          <div>Sample item #{idx}</div>
          <LinkButton theme={idx % 2 === 0 ? LinkButton_Theme.Dark : LinkButton_Theme.Light} href="/product">Learn More</LinkButton>
        </div>
      )}
    </div>
  );
};


export default LandingPage;
