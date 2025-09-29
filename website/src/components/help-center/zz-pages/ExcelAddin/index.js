import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import Subtopics from '@/components/help-center/Subtopics';
// Styles
import styles from '../common.module.scss';


const ExcelAddinPage = () => {
  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>ARR Analysis Excel Add-in</h1>
        <p>The <strong>ARR Analysis Excel Add-in</strong> extends Microsoft Excel with tools for analyzing Annual Recurring Revenue (ARR) data directly inside your spreadsheets.</p>
        <p>With this add-in, you can quickly connect to your ARR data, perform calculations, and generate insights — all without leaving Excel.</p>
        <hr />
        <h2>Before You Begin</h2>
        <p>Make sure you’ve already:</p>
        <ol>
          <li>
            <div>Installed the ARR Analysis Excel Add-in using the instructions on the <strong>Downloading and Running the Installer</strong> page.</div>
            <Subtopics topics={[helpPages.indexer[HelpPageIndex.Installer]]} />
          </li>
          <li>
            <div>Obtained a license by either:</div>
            <ul>
              <li>Purchasing a subscription yourself and assigning one of its licenses to your account.</li>
              <li>Being invited by your organization to use one of their purchased licenses.</li>
            </ul>
          </li>
        </ol>
        <hr />
        <h2>Getting Started</h2>
        <p>The following pages will guide you through installation, activation, and usage:</p>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.ExcelAddin].children} />
      </article>
    </section>
  );
};


export default ExcelAddinPage;
