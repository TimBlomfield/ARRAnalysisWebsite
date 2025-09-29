import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import Subtopics from '@/components/help-center/Subtopics';
// Styles
import styles from '../common.module.scss';


const HelpCenterPage = () => {
  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Help Center</h1>
        <p>Welcome to our comprehensive help and support documentation.</p>
        <hr />
        <figure className={styles.videoContainer}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/SdYn5xJpA6Y"
            title="ARR Analysis Overview"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        </figure>
        <p className={styles.sub}>Learn how to use the ARR Analysis Excel Add-In effectively and discover its capabilities in this overview video.</p>
        <h2 style={{ marginTop: '50px' }}>Browse Subtopics</h2>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.HelpCenter].children} />
      </article>
    </section>
  );
};


export default HelpCenterPage;
