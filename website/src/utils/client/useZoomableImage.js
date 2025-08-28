// Node modules
import { useEffect, useState } from 'react';


const useZoomableImage = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = image != null ? 'hidden' : '';
    document.body.style.paddingRight = image != null ? '18px' : '';

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [image]);

  return [image, setImage];
};


export default useZoomableImage;
