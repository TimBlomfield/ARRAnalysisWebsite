
import Image from 'next/image';
// Images
import blankAvatar from '@/../public/BlankAvatar.png';


const Avatar = ({url, className = '', blank = blankAvatar, alt = 'avatar'}) => {
  if (!url) return <Image className={className} src={blank} alt={alt} />;

  return <Image className={className}
                src={url}
                alt={alt}
                onError={evt => {
                  evt.target.onerror = null;
                  evt.target.src = blank;
                }} />;
};


export default Avatar;
