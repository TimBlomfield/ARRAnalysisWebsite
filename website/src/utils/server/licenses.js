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


export {
  getLicenseData,
};
