import XRegExp from 'xregexp';


const validateUnicodeEmail = value => {
  const re = XRegExp("^[\\p{L}0-9!$'*+\\-_]+(\\.[\\p{L}0-9!$'*+\\-_]+)*@[\\p{L}0-9-]+(\\.[\\p{L}0-9-]+)*(\\.[\\p{L}]{2,})$");
  return re.test(value);
};


export {
  validateUnicodeEmail,
};
