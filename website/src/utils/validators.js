import XRegExp from 'xregexp';


const validateUnicodeEmail = value => {
  const re = XRegExp("^[\\p{L}\\p{N}!#$%&'*+\\/=?^_`{|}~-]+(\\.[\\p{L}\\p{N}!#$%&'*+\\/=?^_`{|}~-]+)*@[\\p{L}\\p{N}-]+(\\.[\\p{L}\\p{N}-]+)*(\\.[\\p{L}]{2,})$");
  return re.test(value);
};


export {
  validateUnicodeEmail,
};
