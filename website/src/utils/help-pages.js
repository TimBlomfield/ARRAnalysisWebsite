const _helpPages = {
  url: 'help-center',
  title: 'Help Center',
  children: [
    {
      url: 'purchasing-subscriptions',
      title: 'Purchasing Subscriptions',
    },
    {
      url: 'admin-section',
      title: 'Admin Section',
      children: [
        {
          url: 'customer',
          title: 'Customer Role',
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
        },
        {
          url: 'profile',
          title: 'Profile Section',
        },
        {
          url: 'purchase-more',
          title: 'Purchasing Additional Subscriptions',
        },
      ],
    },
    {
      url: 'excel-addin',
      title: 'ARR Analysis Excel Add‑in', // Note: Using Unicode NON-BREAKING HYPHEN (U+2011)
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
