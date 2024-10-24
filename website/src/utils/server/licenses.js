import 'server-only';
import axios from 'axios';


const getLicenseData = async licenseId => {
  try {
    const { data } = await axios.get(`https://saas.licensespring.com/api/v1/licenses/${licenseId}/`, {
      headers: {
        Authorization: `Api-Key ${process.env.LICENSESPRING_MANAGEMENT_API_KEY}`,
      },
    });

    const { id, status, license_type, product, validity_period } = data;
    return {
      id,
      status,
      type: license_type,
      productName: product?.product_name,
      validUntil: validity_period,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ALPHABET = process.env.K_ALPHABET;

const encodeLicenseId = licenseId => {  // Can use Number or BigInt as input argument
  let bignum = BigInt(licenseId), result = '';

  while (bignum > 0n) {
    result = ALPHABET[Number(bignum % 62n)] + result;
    bignum = bignum / 62n;
  }

  // Pad with '0' to ensure minimum length
  return result.padStart(8, '0');  // Will give ~8 chars for 64-bit number
};

const decodeLicenseId = str => {
  let result = 0;
  for (let char of str) {
    result = result * 62 + ALPHABET.indexOf(char);
  }

  return result;
};

export {
  getLicenseData,
  encodeLicenseId,
  decodeLicenseId,
};
