const HelpPageIndex = {
  HelpCenter: 'HelpCenter',
  PurchasingSubscriptions: 'PurchasingSubscriptions',
  AdminSection: 'AdminSection',
  CustomerRole: 'CustomerRole',
  AssignLicenseSelf: 'AssignLicenseSelf',
  AssignLicenseOther: 'AssignLicenseOther',
  ManageLicenseUsers: 'ManageLicenseUsers',
  ManageSubscriptions: 'ManageSubscriptions',
  UserRole: 'UserRole',
  ClaimLicense: 'ClaimLicense',
  Installer: 'Installer',
  Profile: 'Profile',
  PurchaseMore: 'PurchaseMore',
  ExcelAddin: 'ExcelAddin',
  AddInActivation: 'AddInActivation',
  Usage: 'Usage',
};


const _helpPages = {
  url: 'help-center',
  title: 'Help Center',
  index: HelpPageIndex.HelpCenter,
  children: [
    {
      url: 'purchasing-subscriptions',
      title: 'Purchasing Subscriptions',
      sublink_desc: 'Learn how to purchase subscriptions and become a customer.',
      index: HelpPageIndex.PurchasingSubscriptions,
    },
    {
      url: 'admin-section',
      title: 'Admin Section',
      sublink_desc: 'Administrative tools for managing users, licenses, subscriptions, and organizational settings.',
      index: HelpPageIndex.AdminSection,
      children: [
        {
          url: 'customer',
          title: 'Customer Role',
          sublink_desc: 'Learn how to assign licenses, and manage subscriptions.',
          index: HelpPageIndex.CustomerRole,
          children: [
            {
              url: 'assign-license-self',
              title: 'Assigning a License to yourself',
              sublink_desc: 'Learn how to assign a license to your own account.',
              index: HelpPageIndex.AssignLicenseSelf,
            },
            {
              url: 'assign-license-other',
              title: 'Assigning a License to someone else',
              sublink_desc: 'Step-by-step instructions for giving licenses to other users in your organization.',
              index: HelpPageIndex.AssignLicenseOther,
            },
            {
              url: 'manage-license-users',
              title: 'Managing License Users',
              sublink_desc: 'Learn how to manage user invitations, and unassign users from licenses.',
              index: HelpPageIndex.ManageLicenseUsers,
            },
            {
              url: 'subscriptions',
              title: 'Managing Subscriptions',
              sublink_desc: 'Find out how to view or cancel your subscriptions.',
              index: HelpPageIndex.ManageSubscriptions,
            },
          ],
        },
        {
          url: 'user',
          title: 'User Role',
          sublink_desc: 'Learn how to register as a user and claim your license.',
          index: HelpPageIndex.UserRole,
          children: [
            {
              url: 'claim-license',
              title: 'Claiming a License',
              sublink_desc: 'Learn how to claim licenses available for your use.',
              index: HelpPageIndex.ClaimLicense,
            },
          ],
        },
        {
          url: 'installer',
          title: 'Downloading and running the Installer',
          sublink_desc: 'Get the latest installer and installation instructions.',
          index: HelpPageIndex.Installer,
        },
        {
          url: 'profile',
          title: 'Profile Section',
          sublink_desc: 'Configure your personal profile and change your password.',
          index: HelpPageIndex.Profile,
        },
        {
          url: 'purchase-more',
          title: 'Purchasing Additional Subscriptions',
          sublink_desc: 'How to expand your subscription plan and add more licenses.',
          index: HelpPageIndex.PurchaseMore,
        },
      ],
    },
    {
      url: 'excel-addin',
      title: 'ARR Analysis Excel Add‑in', // Note: Using Unicode NON-BREAKING HYPHEN (U+2011)
      sublink_desc: 'Activation and usage guides for our ARR Analysis Excel Add‑in.',
      index: HelpPageIndex.ExcelAddin,
      children: [
        {
          url: 'activation',
          title: 'Activating the ARR Analysis Excel Add‑in',
          sublink_desc: 'Learn how to activate and start using the ARR Analysis Excel Add‑in.',
          index: HelpPageIndex.AddInActivation,
        },
        {
          url: 'usage',
          title: 'Using the ARR Analysis Excel Add‑in',
          sublink_desc: 'Discover the main features and workflows of the ARR Analysis Excel Add‑in.',
          index: HelpPageIndex.Usage,
        },
      ],
    },
  ],
};


const transform = (page, prev = '', indexer = {}) => {
  const newPage = { ...page };
  newPage.full = prev + '/' + page.url;

  indexer[newPage.index] = newPage;
  delete newPage.index;

  if (page.children != null) {
    newPage.children = page.children.map(child => transform(child, newPage.full, indexer));
  }

  if (page.index === HelpPageIndex.HelpCenter)
    newPage.indexer = indexer;

  return newPage;
};


export const helpPages = transform(_helpPages);
export { HelpPageIndex };
