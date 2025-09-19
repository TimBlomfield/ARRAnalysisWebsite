'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgDownloadsPage from '@/../public/help-center/Downloads-Page.png';
import imgInstallerStart from '@/../public/help-center/Installer-Wizard-First-Step.png';
import imgInstallerFinish from '@/../public/help-center/Installer-Wizard-Last-Step.png';
import imgExcel from '@/../public/help-center/Excel-After-Install.png';
// Styles
import styles from '../common.module.scss';


const InstallerPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Downloading and Running the Installer</h1>
        <p>Whether you’re a <strong>Customer</strong> or a <strong>User</strong>, you can download the <strong>ARR Analysis Excel Add-in</strong> installer for any product you have access to. There are three versions of the installer — one for each product.</p>
        <hr />
        <h2>Step 1: Access the Downloads Page</h2>
        <p>To download the installer, open the <strong>Downloads</strong> page in the Admin Section:</p>
        <Image className={styles.clickableImage}
               style={{ width: '80%' }}
               src={imgDownloadsPage}
               alt="Downloads Page"
               priority
               onClick={() => setImage({ img: imgDownloadsPage, alt: 'Downloads Page' })} />
        <ul>
          <li><strong>Customers:</strong> You can download the installer for any product for which you’ve purchased a subscription (i.e., you own a license).</li>
          <li><strong>Users:</strong> You can download the installer for any product for which you’ve been assigned a license (i.e., you’ve claimed a license).</li>
        </ul>
        <p>If you don’t own or haven’t claimed a license for a product, the download option for that product will be unavailable for you.</p>
        <hr />
        <h2>Step 2: Run the Installer</h2>
        <p>After downloading the correct installer (an <strong>.EXE</strong> file), run it to start the setup wizard. Follow the on-screen steps to complete the installation.</p>
        <p>If you’re <strong>updating to a newer version</strong> of the add-in, the process is the same — simply run the new installer and follow the steps.</p>
        <Image className={styles.clickableImage}
               style={{ width: '60%' }}
               src={imgInstallerStart}
               alt="Installer Wizard First Step"
               onClick={() => setImage({ img: imgInstallerStart, alt: 'Installer Wizard First Step' })} />
        <Image className={styles.clickableImage}
               style={{ width: '60%' }}
               src={imgInstallerFinish}
               alt="Installer Wizard Last Step"
               onClick={() => setImage({ img: imgInstallerFinish, alt: 'Installer Wizard Last Step' })} />
        <hr />
        <h2>Step 3: Verify the Installation</h2>
        <p>Once installation is complete, open Excel. You should see the <strong>ARR Analysis</strong> tab in the Excel ribbon bar:</p>
        <Image className={styles.clickableImage}
               style={{ width: '90%' }}
               src={imgExcel}
               alt="Excel"
               onClick={() => setImage({ img: imgExcel, alt: 'Excel' })} />
        <hr />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <h2>Related Topics</h2>
        <Subtopics topics={helpPages.indexer[HelpPageIndex.ExcelAddin].children} />
      </article>
    </section>
  );
};


export default InstallerPage;
