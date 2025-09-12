const _helpPages = {
  url: 'help-center',
  title: 'Help Center',
  children: [
    {
      url: 'purchasing-subscriptions',
      title: 'Purchasing Subscriptions',
      sublink_desc: 'Learn how to purchase subscriptions and become a customer.',
    },
    {
      url: 'admin-section',
      title: 'Admin Section',
      sublink_desc: 'Administrative tools for managing users, licenses, subscriptions, and organizational settings.',
      children: [
        {
          url: 'customer',
          title: 'Customer Role',
          sublink_desc: 'Learn how to assign licenses, and manage subscriptions.',
          children: [
            {
              url: 'assign-license-self',
              title: 'Assigning a License to yourself',
            },
            {
              url: 'assign-license-other',
              title: 'Assigning a License to someone else',
            },
            {
              url: 'subscriptions',
              title: 'Managing Subscriptions',
            },
          ],
        },
        {
          url: 'user',
          title: 'User Role',
          sublink_desc: 'Learn how to activate assigned licenses.',
          children: [
            {
              url: 'activation',
              title: 'Activating a License',
            },
          ],
        },
        {
          url: 'installer',
          title: 'Download and run the Installer',
          sublink_desc: 'Get the latest installer and installation instructions.',
        },
        {
          url: 'profile',
          title: 'Profile Section',
          sublink_desc: 'Configure your personal profile and change your password.',
        },
        {
          url: 'purchase-more',
          title: 'Purchasing Additional Subscriptions',
          sublink_desc: 'How to expand your subscription plan and add more licenses.',
        },
      ],
    },
    {
      url: 'excel-addin',
      title: 'ARR Analysis Excel Add‑in', // Note: Using Unicode NON-BREAKING HYPHEN (U+2011)
      sublink_desc: 'Installation, activation, and usage guides for our ARR Analysis Excel Add‑in.',
      children: [
        {
          url: 'activation',
          title: 'Activating the ARR Analysis Excel Add‑in',
        },
        {
          url: 'usage',
          title: 'Using the ARR Analysis Excel Add‑in',
        },
      ],
    },
  ],
};


const transform = (page, prev = '') => {
  const newPage = { ...page };
  newPage.full = prev + '/' + page.url;
  if (page.children != null) {
    newPage.children = page.children.map(child => transform(child, newPage.full));
  }
  return newPage;
};


export const helpPages = transform(_helpPages);
