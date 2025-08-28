'use client';

import cn from 'classnames';
import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
// Images
import imgTemp from '@/../public/temp_v3.jpg';
import imgQuart from '@/../public/Quarterly_Cohort-graph.jpg';
// Styles
import styles from './styles.module.scss';


const HelpCenterPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <div className={styles.main}>
      <div>Help Center Page</div>
      <Image className={cn(styles.clickableImage, styles.size)}
             src={imgTemp}
             alt="Waterfall"
             priority
             onClick={() => setImage(imgTemp)} />
      <Image className={cn(styles.clickableImage, styles.size)}
             src={imgQuart}
             alt="Quarterly"
             onClick={() => setImage(imgQuart)} />
      <ImageViewer image={image} alt="Alternative" notifyClosed={() => setImage(null)} />
    </div>
  );
};


export default HelpCenterPage;
