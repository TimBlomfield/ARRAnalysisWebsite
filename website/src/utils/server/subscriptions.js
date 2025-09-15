import 'server-only';


const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};


const getFriendlySubscriptionId = subscriptionId => {
  // Validate input
  if (!subscriptionId || !subscriptionId.startsWith('sub_'))
    throw new Error('Invalid Stripe subscription ID');

  // Generate hash and convert to 5-digit number (10000–99999)
  const hash = simpleHash(subscriptionId);
  const numericId = (hash % 90000) + 10000; // Maps to 10000–99999
  const base36Id = numericId.toString(36).toUpperCase().padStart(5, '0');

  // Return formatted friendly ID
  return `SUB-${base36Id}`;
};


export { getFriendlySubscriptionId };
