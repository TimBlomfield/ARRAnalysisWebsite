/* eslint-disable @next/next/no-img-element */

// Images
import blankAvatar from '@/../public/BlankAvatar.png';


const Avatar = ({url, className = '', blank = blankAvatar, alt = 'avatar'}) => {
  if (!url) return <img className={className} src={blank} alt={alt} />;

  return <img className={className}
              src={url}
              alt={alt}
              onError={evt => {
                evt.target.onerror = null;
                evt.target.src = blank.src;
              }} />;
};


export default Avatar;
