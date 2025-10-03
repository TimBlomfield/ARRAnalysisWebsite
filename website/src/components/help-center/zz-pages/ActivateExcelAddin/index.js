'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgAddInInstalled from  '@/../public/help-center/Addin-Installed.png';
import imgActivationDialog from '@/../public/help-center/Activation-Dialog.png';
import imgAssignedLicenseT3 from '@/../public/help-center/Assigned-License-Tier3.png';
import imgActivatedMsgBox from '@/../public/help-center/Activated-MsgBox.png';
import imgLicenseInfo from '@/../public/help-center/LicenseInfo-Dialog.png';
import imgInputActive from '@/../public/help-center/Upload-Active.png';
// Styles
import styles from '../common.module.scss';


const ActivateExcelAddinPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Activating the ARR Analysis Excel Add-in</h1>
        <p>After installing the ARR Analysis Excel Add-in, you should see a new <strong>ARR Analysis</strong> tab in the Excel ribbon:</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgAddInInstalled}
               alt="Installed Add-in"
               priority
               onClick={() => setImage({ img: imgAddInInstalled, alt: 'Installed Add-in' })} />
        <p>At this point, the add-in is <strong>not activated</strong>. All buttons to the left of the <strong className={styles.more}>License</strong> button will be disabled, and the <strong className={styles.more}>License</strong> button itself will display the <em>Inactive</em> icon.</p>
        <p>To activate the add-in, follow these steps:</p>
        <hr />
        <h2>Step 1: Open the Activation Dialog</h2>
        <p>Click the <strong className={styles.more}>License</strong> button in the ARR Analysis ribbon section. This opens the <strong>Activate ARR Analysis</strong> dialog.</p>
        <p>Here, you need to enter:</p>
        <ul>
          <li>Your <strong>email</strong></li>
          <li>The <strong>password for the license</strong> assigned to you</li>
        </ul>
        <p className={styles.note}><strong className={styles.more}>Note:</strong> The license password may be different from your Admin Console password unless you decide to make them the same.</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgActivationDialog}
               alt="Activation Dialog"
               onClick={() => setImage({ img: imgActivationDialog, alt: 'Activation Dialog' })} />
        <hr />
        <h2>Step 2: Set or Copy Your License Password</h2>
        <p>In the Admin Console, you can view the license details. Initially, each license comes with an auto-generated password.</p>
        <ul>
          <li>You can click <strong className={styles.more}>Copy Initial Password</strong> to copy and use it directly.</li>
          <li><strong>Recommended:</strong> Click <strong className={styles.more}>Change Password</strong> and set your own secure password instead.</li>
        </ul>
        <p>You can even set it to match your Admin Console password, provided it meets the license manager’s password complexity requirements.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgAssignedLicenseT3}
               alt="Assigned License"
               onClick={() => setImage({ img: imgAssignedLicenseT3, alt: 'Assigned License' })} />
        <hr />
        <h2>Step 3: Activate the Add-in</h2>
        <p>After entering your credentials in the <strong>Activate ARR Analysis</strong> dialog, click <strong className={styles.more}>Activate</strong>.</p>
        <p>If everything is correct, you will see a <strong>License Activated</strong> confirmation message.</p>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgActivatedMsgBox}
               alt="License Activated"
               onClick={() => setImage({ img: imgActivatedMsgBox, alt: 'License Activated' })} />
        <hr />
        <h2>Step 4: Verify Activation</h2>
        <p>After activation:</p>
        <ul>
          <li>The <strong className={styles.more}>License</strong> button will now show the <em>Active</em> icon.</li>
          <li>Clicking it will open the <strong>License Info</strong> dialog.</li>
          <li>The first group of buttons in the ribbon will become enabled.</li>
        </ul>
        <Image className={styles.clickableImage}
               style={{ width: 'min(750px, 100%)' }}
               src={imgLicenseInfo}
               alt="License Info"
               onClick={() => setImage({ img: imgLicenseInfo, alt: 'License Info' })} />
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgInputActive}
               alt="Input: Active"
               onClick={() => setImage({ img: imgInputActive, alt: 'Input: Active' })} />
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
        <hr />
        <h2>Next Steps</h2>
        <p>Now that your ARR Analysis Excel Add-in is activated, you can start using it:</p>
        <Subtopics topics={[helpPages.indexer[HelpPageIndex.Usage]]} />
      </article>
    </section>
  );
};


export default ActivateExcelAddinPage;
