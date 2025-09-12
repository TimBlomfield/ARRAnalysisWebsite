import Link from 'next/link';
// Styles
import styles from './styles.module.scss';


const Subtopics = ({ topics }) => {
  return (
    <div className={styles.subtopics}>
      {topics.map(topic => (
        <Link key={topic.full} href={topic.full} className={styles.navLink}>
          <div className={styles.title}>{topic.title}</div>
          <div className={styles.desc}>{topic.sublink_desc}</div>
        </Link>
      ))}
    </div>
  );
};


export default Subtopics;
