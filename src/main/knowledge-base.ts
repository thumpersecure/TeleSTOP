export interface OptOutInstructions {
  siteName: string;
  domain: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  requiresEmail: boolean;
  requiresId: boolean;
  steps: string[];
  optOutUrl?: string;
  notes?: string;
}

export interface SiteInfo {
  name: string;
  domain: string;
  description: string;
  dataTypes: string[];
  hasOptOut: boolean;
}

// List of known people search sites
export const knownSites: string[] = [
  'spokeo.com',
  'whitepages.com',
  'beenverified.com',
  'intelius.com',
  'peoplefinder.com',
  'peoplefinders.com',
  'truepeoplesearch.com',
  'fastpeoplesearch.com',
  'thatsThem.com',
  'radaris.com',
  'mylife.com',
  'instantcheckmate.com',
  'ussearch.com',
  'peoplelooker.com',
  'publicrecordsnow.com',
  'addresses.com',
  'anywho.com',
  'zabasearch.com',
  'pipl.com',
  'peekyou.com',
  'familytreenow.com',
  'advancedbackgroundchecks.com',
  'truthfinder.com',
  'clustrmaps.com',
  'cyberbackgroundchecks.com',
  'publicrecords.searchsystems.net',
  'usphonebook.com',
  'nuwber.com',
  'cocofinder.com',
  'socialcatfish.com',
  'idcrawl.com',
  'peoplesearchnow.com',
  'officialusa.com',
  'usidentify.com',
  'checksecrets.com',
  'newenglandfacts.com',
  'neighborswhoareyou.com',
  'centeda.com',
  'cubib.com',
  'verecor.com',
  'vericora.com',
  'searchpeoplefree.com',
  'thatsthem.com',
  'golookup.com',
  'usa-people-search.com',
  'quickpeopletrace.com',
  'calltruth.com',
  'dataveria.com',
  'freepeopledirectory.com',
  'pub360.com',
  'findpeoplefast.net',
  'spyfly.com',
  'publicdatacheck.com',
  'checkpeople.com',
  'locatepeople.org',
  'voterrecords.com',
];

// Comprehensive opt-out instructions database
const optOutDatabase: Record<string, OptOutInstructions> = {
  'spokeo.com': {
    siteName: 'Spokeo',
    domain: 'spokeo.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.spokeo.com/optout',
    steps: [
      'Go to Spokeo.com and search for your name to find your listing',
      'Copy the URL of your profile page',
      'Visit the opt-out page at spokeo.com/optout',
      'Paste your profile URL into the form',
      'Enter your email address',
      'Complete the CAPTCHA verification',
      'Click "Remove This Listing"',
      'Check your email for a confirmation link',
      'Click the confirmation link to complete the removal',
      'Your listing should be removed within 24-48 hours',
    ],
    notes: 'Spokeo may have multiple listings for you. You need to opt out of each one separately.',
  },

  'whitepages.com': {
    siteName: 'Whitepages',
    domain: 'whitepages.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.whitepages.com/suppression-requests',
    steps: [
      'Go to Whitepages.com and search for yourself',
      'Click on your listing to view your full profile',
      'Copy the URL of your profile',
      'Visit whitepages.com/suppression-requests',
      'Paste your profile URL',
      'Enter your phone number for verification',
      'You will receive an automated call with a verification code',
      'Enter the verification code on the website',
      'Confirm the removal request',
      'Removal typically takes 24 hours',
    ],
    notes: 'Whitepages requires phone verification. Make sure you have access to the phone number listed.',
  },

  'beenverified.com': {
    siteName: 'BeenVerified',
    domain: 'beenverified.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.beenverified.com/app/optout/search',
    steps: [
      'Visit beenverified.com/app/optout/search',
      'Enter your first name, last name, and state',
      'Click "Search"',
      'Find your record in the search results',
      'Click on your listing',
      'Click "Proceed with opt-out"',
      'Enter your email address',
      'Complete any verification steps',
      'Check your email for a confirmation link',
      'Click the link to confirm your opt-out request',
    ],
    notes: 'BeenVerified owns multiple sites. Opting out here may also remove you from partner sites.',
  },

  'intelius.com': {
    siteName: 'Intelius',
    domain: 'intelius.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.intelius.com/opt-out',
    steps: [
      'Go to intelius.com and search for your name',
      'Find and click on your listing',
      'Copy the URL of your profile page',
      'Visit intelius.com/opt-out',
      'Enter your name and email address',
      'Paste your profile URL',
      'Complete the opt-out form',
      'Submit the request',
      'Check your email for confirmation',
      'Click the confirmation link',
      'Allow 7-14 days for processing',
    ],
    notes: 'Intelius is owned by the same company as Spokeo. Opting out may help with related sites.',
  },

  'truepeoplesearch.com': {
    siteName: 'TruePeopleSearch',
    domain: 'truepeoplesearch.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.truepeoplesearch.com/removal',
    steps: [
      'Go to TruePeopleSearch.com',
      'Search for yourself by name',
      'Click on your listing to view the full record',
      'Scroll down and click "Remove This Record"',
      'Complete the CAPTCHA verification',
      'Click "Remove Record"',
      'Your information should be removed immediately',
    ],
    notes: 'TruePeopleSearch has one of the easiest opt-out processes. Removal is usually instant.',
  },

  'fastpeoplesearch.com': {
    siteName: 'FastPeopleSearch',
    domain: 'fastpeoplesearch.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.fastpeoplesearch.com/removal',
    steps: [
      'Visit FastPeopleSearch.com',
      'Search for your name',
      'Click on your record',
      'Click "Remove This Record" at the bottom of the page',
      'Complete the CAPTCHA',
      'Confirm the removal',
      'Record is typically removed within minutes',
    ],
    notes: 'FastPeopleSearch is related to TruePeopleSearch. Check both sites.',
  },

  'radaris.com': {
    siteName: 'Radaris',
    domain: 'radaris.com',
    difficulty: 'hard',
    estimatedTime: '15-30 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://radaris.com/control/privacy',
    steps: [
      'Create an account at Radaris.com (required for opt-out)',
      'Log in to your account',
      'Search for your name to find your profile',
      'Go to radaris.com/control/privacy',
      'Click on "Control Information"',
      'Select the records you want to remove',
      'Follow the prompts to request removal',
      'You may need to verify your identity',
      'Submit the removal request',
      'Check your email for confirmation',
      'Allow 24-48 hours for processing',
    ],
    notes: 'Radaris requires account creation. Use a throwaway email if possible.',
  },

  'mylife.com': {
    siteName: 'MyLife',
    domain: 'mylife.com',
    difficulty: 'hard',
    estimatedTime: '20-30 minutes',
    requiresEmail: true,
    requiresId: true,
    optOutUrl: 'https://www.mylife.com/privacy-policy#rights',
    steps: [
      'Go to mylife.com and find your profile',
      'Note your MyLife profile URL',
      'Email privacy@mylife.com with the subject "Opt-Out Request"',
      'Include your full name as it appears on the site',
      'Include your profile URL',
      'Include your current address',
      'Request removal of your information',
      'You may need to provide ID verification',
      'Wait for a response (can take up to 30 days)',
      'Follow any additional instructions provided',
    ],
    notes: 'MyLife is notoriously difficult. Be persistent and follow up if needed.',
  },

  'instantcheckmate.com': {
    siteName: 'Instant Checkmate',
    domain: 'instantcheckmate.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.instantcheckmate.com/opt-out/',
    steps: [
      'Visit instantcheckmate.com/opt-out',
      'Enter your information to search for your record',
      'Select your listing from the results',
      'Click "Remove This Record"',
      'Enter your email address',
      'Complete the CAPTCHA',
      'Submit the opt-out request',
      'Check your email for a confirmation link',
      'Click the link to verify your request',
      'Allow up to 48 hours for removal',
    ],
    notes: 'Instant Checkmate is owned by the same company as TruthFinder.',
  },

  'truthfinder.com': {
    siteName: 'TruthFinder',
    domain: 'truthfinder.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.truthfinder.com/opt-out/',
    steps: [
      'Go to truthfinder.com/opt-out',
      'Search for your record by entering your name and state',
      'Find and select your listing',
      'Click "Remove This Record"',
      'Enter your email address for verification',
      'Complete the CAPTCHA verification',
      'Submit your opt-out request',
      'Check your email and click the confirmation link',
      'Your record should be removed within 48 hours',
    ],
    notes: 'TruthFinder and Instant Checkmate share data. Opt out of both.',
  },

  'peoplefinder.com': {
    siteName: 'PeopleFinder',
    domain: 'peoplefinder.com',
    difficulty: 'medium',
    estimatedTime: '10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.peoplefinder.com/optout',
    steps: [
      'Visit peoplefinder.com and search for your name',
      'Find your listing and copy the URL',
      'Go to peoplefinder.com/optout',
      'Enter your profile URL',
      'Enter your email address',
      'Complete the form with required information',
      'Submit the opt-out request',
      'Check your email for confirmation',
      'Click the verification link',
      'Allow 24-72 hours for processing',
    ],
    notes: 'May require multiple attempts. Check back after a week to verify removal.',
  },

  'familytreenow.com': {
    siteName: 'FamilyTreeNow',
    domain: 'familytreenow.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.familytreenow.com/optout',
    steps: [
      'Visit familytreenow.com/optout',
      'Search for your name',
      'Select your record from the results',
      'Click "Opt Out" next to your record',
      'Confirm that you want to opt out',
      'Complete the CAPTCHA if prompted',
      'Your record should be removed within 24-48 hours',
    ],
    notes: 'FamilyTreeNow has a relatively simple opt-out process.',
  },

  'peekyou.com': {
    siteName: 'PeekYou',
    domain: 'peekyou.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.peekyou.com/about/contact/optout',
    steps: [
      'Go to peekyou.com and search for yourself',
      'Find your profile and note the unique ID in the URL',
      'Visit peekyou.com/about/contact/optout',
      'Enter the unique ID from your profile URL',
      'Complete the CAPTCHA',
      'Click "Submit"',
      'Your profile should be removed within 24-48 hours',
    ],
    notes: 'The unique ID is the string of characters at the end of your profile URL.',
  },

  'nuwber.com': {
    siteName: 'Nuwber',
    domain: 'nuwber.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://nuwber.com/removal/link',
    steps: [
      'Visit nuwber.com and search for your name',
      'Click on your profile',
      'Copy your profile URL',
      'Go to nuwber.com/removal/link',
      'Paste your profile URL',
      'Enter your email address',
      'Complete the CAPTCHA',
      'Submit the removal request',
      'Check your email and click the confirmation link',
      'Allow 24-72 hours for removal',
    ],
    notes: 'Nuwber may have multiple profiles for you. Submit removal for each.',
  },

  'usphonebook.com': {
    siteName: 'USPhonebook',
    domain: 'usphonebook.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.usphonebook.com/opt-out',
    steps: [
      'Go to usphonebook.com/opt-out',
      'Search for your phone number or name',
      'Find your listing in the results',
      'Click "Opt-Out" next to your listing',
      'Complete the CAPTCHA',
      'Confirm the removal',
      'Your listing should be removed immediately',
    ],
    notes: 'USPhonebook removal is usually instant. Verify by searching again.',
  },

  'cocofinder.com': {
    siteName: 'CocoFinder',
    domain: 'cocofinder.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://cocofinder.com/remove-my-info',
    steps: [
      'Visit cocofinder.com and search for yourself',
      'Find and click on your profile',
      'Copy the profile URL',
      'Go to cocofinder.com/remove-my-info',
      'Fill out the opt-out form',
      'Paste your profile URL',
      'Enter your email address',
      'Submit the request',
      'Check your email for verification',
      'Click the verification link',
    ],
    notes: 'CocoFinder usually processes requests within 48 hours.',
  },

  'idcrawl.com': {
    siteName: 'IDCrawl',
    domain: 'idcrawl.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://www.idcrawl.com/opt-out',
    steps: [
      'Search for yourself at idcrawl.com',
      'Find your profile and copy the URL',
      'Visit idcrawl.com/opt-out',
      'Paste your profile URL',
      'Complete the CAPTCHA',
      'Submit the removal request',
      'Removal is typically processed within 24 hours',
    ],
    notes: 'IDCrawl aggregates data from social media and public records.',
  },

  'socialcatfish.com': {
    siteName: 'Social Catfish',
    domain: 'socialcatfish.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://socialcatfish.com/opt-out/',
    steps: [
      'Go to socialcatfish.com/opt-out',
      'Enter your information to find your record',
      'Select your record from the results',
      'Click to opt out',
      'Provide your email address',
      'Fill out any additional required information',
      'Submit the opt-out request',
      'Check your email for confirmation',
      'Complete any verification steps',
    ],
    notes: 'Social Catfish is primarily used for romance scam detection but still has personal data.',
  },

  'zabasearch.com': {
    siteName: 'ZabaSearch',
    domain: 'zabasearch.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: true,
    optOutUrl: 'https://www.zabasearch.com/block_records/',
    steps: [
      'Visit zabasearch.com/block_records',
      'Search for your record',
      'Select your record from the results',
      'Click "Block Record"',
      'You will need to fax a written request with ID',
      'Include a copy of your driver\'s license or state ID',
      'Include the URL of the record you want removed',
      'Fax to the number provided on their website',
      'Allow 4-6 weeks for processing',
    ],
    notes: 'ZabaSearch has a more difficult process requiring faxed ID. Consider if it\'s worth it.',
  },

  'thatsthem.com': {
    siteName: 'ThatsThem',
    domain: 'thatsthem.com',
    difficulty: 'easy',
    estimatedTime: '5 minutes',
    requiresEmail: false,
    requiresId: false,
    optOutUrl: 'https://thatsthem.com/optout',
    steps: [
      'Go to thatsthem.com and search for your name',
      'Find your record and click on it',
      'Copy the URL of your profile',
      'Visit thatsthem.com/optout',
      'Paste your profile URL',
      'Complete the CAPTCHA',
      'Click "Opt-Out"',
      'Your record should be removed within 24-48 hours',
    ],
    notes: 'ThatsThem has a simple opt-out process.',
  },

  'voterrecords.com': {
    siteName: 'Voter Records',
    domain: 'voterrecords.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://voterrecords.com/contact',
    steps: [
      'Find your record on voterrecords.com',
      'Copy the URL of your record',
      'Go to voterrecords.com/contact',
      'Fill out the contact form requesting removal',
      'Include your full name and the record URL',
      'Explain that you want to opt out',
      'Submit the form',
      'Wait for a response via email',
      'Follow any additional instructions',
    ],
    notes: 'Voter records are public in most states. Removal may be limited.',
  },

  'advancedbackgroundchecks.com': {
    siteName: 'Advanced Background Checks',
    domain: 'advancedbackgroundchecks.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.advancedbackgroundchecks.com/removal',
    steps: [
      'Visit advancedbackgroundchecks.com',
      'Search for your name',
      'Find and click on your listing',
      'Copy the profile URL',
      'Go to advancedbackgroundchecks.com/removal',
      'Paste your profile URL',
      'Enter your email address',
      'Complete the form',
      'Submit the removal request',
      'Check email for confirmation link',
      'Click the link to confirm removal',
    ],
    notes: 'Related to other people search sites. Check for duplicate listings.',
  },

  'clustrmaps.com': {
    siteName: 'ClustrMaps',
    domain: 'clustrmaps.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://clustrmaps.com/bl/opt-out',
    steps: [
      'Find your profile on clustrmaps.com',
      'Copy your profile URL',
      'Visit clustrmaps.com/bl/opt-out',
      'Enter your profile URL',
      'Enter your email address',
      'Fill out the required information',
      'Submit the opt-out request',
      'Check your email for confirmation',
      'Complete any verification steps',
      'Allow 48-72 hours for processing',
    ],
    notes: 'ClustrMaps focuses on location data and addresses.',
  },

  'peoplelooker.com': {
    siteName: 'PeopleLooker',
    domain: 'peoplelooker.com',
    difficulty: 'medium',
    estimatedTime: '10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.peoplelooker.com/f/optout/search',
    steps: [
      'Go to peoplelooker.com/f/optout/search',
      'Search for your name and state',
      'Find your record in the results',
      'Click on your record',
      'Click "Opt Out"',
      'Enter your email address',
      'Complete the CAPTCHA',
      'Submit the request',
      'Check your email for the confirmation link',
      'Click the link to complete the opt-out',
    ],
    notes: 'PeopleLooker is owned by BeenVerified. Opt out of both.',
  },

  'ussearch.com': {
    siteName: 'US Search',
    domain: 'ussearch.com',
    difficulty: 'medium',
    estimatedTime: '15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.ussearch.com/opt-out/submit/',
    steps: [
      'Visit ussearch.com/opt-out/submit',
      'Enter your first name, last name, and state',
      'Search for your record',
      'Select your record from the results',
      'Fill out the opt-out form completely',
      'Enter your email address',
      'Submit the request',
      'Check your email for verification',
      'Click the confirmation link',
      'Allow up to 72 hours for removal',
    ],
    notes: 'US Search is related to Intelius. Consider opting out of both.',
  },

  'anywho.com': {
    siteName: 'AnyWho',
    domain: 'anywho.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.anywho.com/help/privacy',
    steps: [
      'Find your listing on anywho.com',
      'Note your name as it appears and your location',
      'Visit anywho.com/help/privacy',
      'Look for the opt-out or removal information',
      'Follow the instructions to submit a removal request',
      'You may need to email them directly',
      'Include your name, address, and the listing URL',
      'Request removal of your information',
      'Wait for confirmation',
    ],
    notes: 'AnyWho is owned by Yellowpages. Their process may change.',
  },

  'addresses.com': {
    siteName: 'Addresses.com',
    domain: 'addresses.com',
    difficulty: 'medium',
    estimatedTime: '10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.addresses.com/optout',
    steps: [
      'Search for yourself at addresses.com',
      'Find your listing',
      'Copy the URL of your profile',
      'Go to addresses.com/optout (or their contact page)',
      'Submit a removal request with your profile URL',
      'Enter your email address',
      'Complete any verification steps',
      'Submit the request',
      'Wait for email confirmation',
    ],
    notes: 'Part of the Whitepages network. May require similar verification.',
  },

  'publicrecordsnow.com': {
    siteName: 'PublicRecordsNow',
    domain: 'publicrecordsnow.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.publicrecordsnow.com/optout',
    steps: [
      'Search for your name at publicrecordsnow.com',
      'Find your record',
      'Copy the record URL',
      'Visit their opt-out page',
      'Enter your information and record URL',
      'Provide your email address',
      'Submit the opt-out request',
      'Check email for confirmation',
      'Complete any additional verification',
    ],
    notes: 'May be related to other people search services.',
  },

  'checkpeople.com': {
    siteName: 'CheckPeople',
    domain: 'checkpeople.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.checkpeople.com/opt-out',
    steps: [
      'Visit checkpeople.com/opt-out',
      'Search for your record using your name',
      'Select your record from the results',
      'Click "Opt Out"',
      'Enter your email address',
      'Complete the CAPTCHA',
      'Submit the request',
      'Check your email for the confirmation link',
      'Click the link to confirm removal',
    ],
    notes: 'CheckPeople usually processes requests within 48 hours.',
  },

  'spyfly.com': {
    siteName: 'SpyFly',
    domain: 'spyfly.com',
    difficulty: 'medium',
    estimatedTime: '10-15 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://www.spyfly.com/help#optout',
    steps: [
      'Visit spyfly.com and search for your record',
      'Find your listing',
      'Go to spyfly.com/help',
      'Look for the opt-out section',
      'Follow the instructions to submit a removal request',
      'Include your name and any relevant profile URLs',
      'Provide your email for confirmation',
      'Submit the request',
      'Wait for email confirmation and follow instructions',
    ],
    notes: 'SpyFly is a background check service. Process may vary.',
  },

  'golookup.com': {
    siteName: 'GoLookup',
    domain: 'golookup.com',
    difficulty: 'easy',
    estimatedTime: '5-10 minutes',
    requiresEmail: true,
    requiresId: false,
    optOutUrl: 'https://golookup.com/support/optout',
    steps: [
      'Search for yourself at golookup.com',
      'Find and click on your profile',
      'Copy the profile URL',
      'Go to golookup.com/support/optout',
      'Enter your profile URL',
      'Enter your email address',
      'Submit the removal request',
      'Check your email for confirmation',
      'Click the confirmation link',
    ],
    notes: 'GoLookup aggregates public records.',
  },
};

// Generic instructions for unknown sites
const genericOptOutInstructions: OptOutInstructions = {
  siteName: 'Unknown Site',
  domain: 'unknown',
  difficulty: 'medium',
  estimatedTime: '10-20 minutes',
  requiresEmail: true,
  requiresId: false,
  steps: [
    'Look for a "Privacy Policy" or "Terms of Service" link at the bottom of the website',
    'Search for "opt out", "removal", or "do not sell" options in the privacy policy',
    'Look for a "Contact Us" or "Help" page',
    'Search Google for "[site name] opt out" or "[site name] remove my information"',
    'If available, use their online opt-out form',
    'If no form exists, send an email to their privacy or support email address',
    'In your email, include: your full name, the URL of your profile, and a clear request to remove your data',
    'Reference CCPA (California Consumer Privacy Act) or GDPR rights if applicable',
    'Keep records of all communications',
    'Follow up after 7-14 days if you don\'t receive a response',
  ],
  notes: 'This site is not in our database. These are general instructions that should work for most people-search sites. Be persistent and document all communications.',
};

export function getOptOutInstructions(domain: string): OptOutInstructions {
  const normalizedDomain = domain.toLowerCase().replace('www.', '');

  // Check for exact match
  if (optOutDatabase[normalizedDomain]) {
    return optOutDatabase[normalizedDomain];
  }

  // Check for partial match
  for (const [key, value] of Object.entries(optOutDatabase)) {
    if (normalizedDomain.includes(key) || key.includes(normalizedDomain)) {
      return value;
    }
  }

  // Return generic instructions with the domain info
  return {
    ...genericOptOutInstructions,
    siteName: normalizedDomain,
    domain: normalizedDomain,
  };
}

export function getSiteInfo(domain: string): SiteInfo | null {
  const normalizedDomain = domain.toLowerCase().replace('www.', '');
  const instructions = optOutDatabase[normalizedDomain];

  if (instructions) {
    return {
      name: instructions.siteName,
      domain: instructions.domain,
      description: `People search and background check service that aggregates personal information from public records.`,
      dataTypes: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Associates'],
      hasOptOut: true,
    };
  }

  // Check if it's a known people search site
  const isKnown = knownSites.some(site =>
    normalizedDomain.includes(site.toLowerCase()) ||
    site.toLowerCase().includes(normalizedDomain)
  );

  if (isKnown) {
    return {
      name: normalizedDomain,
      domain: normalizedDomain,
      description: 'People search service (in database but detailed info not available)',
      dataTypes: ['Personal Information'],
      hasOptOut: true,
    };
  }

  return null;
}

// AI Assistant response generator
export function generateAIResponse(domain: string, userQuestion?: string): string {
  const instructions = getOptOutInstructions(domain);

  let response = `## Opt-Out Guide for ${instructions.siteName}\n\n`;

  response += `**Difficulty:** ${instructions.difficulty.charAt(0).toUpperCase() + instructions.difficulty.slice(1)}\n`;
  response += `**Estimated Time:** ${instructions.estimatedTime}\n`;
  response += `**Email Required:** ${instructions.requiresEmail ? 'Yes' : 'No'}\n`;
  response += `**ID Required:** ${instructions.requiresId ? 'Yes' : 'No'}\n\n`;

  if (instructions.optOutUrl) {
    response += `**Direct Opt-Out Link:** ${instructions.optOutUrl}\n\n`;
  }

  response += `### Step-by-Step Instructions\n\n`;
  instructions.steps.forEach((step, index) => {
    response += `${index + 1}. ${step}\n`;
  });

  if (instructions.notes) {
    response += `\n### Important Notes\n\n${instructions.notes}\n`;
  }

  response += `\n### Tips for Success\n\n`;
  response += `- Take screenshots before and after for your records\n`;
  response += `- Use a dedicated email for opt-out requests to track responses\n`;
  response += `- Set a calendar reminder to check back in 1-2 weeks\n`;
  response += `- If the standard process doesn't work, try emailing their privacy team directly\n`;
  response += `- For California residents: Reference your CCPA rights for faster processing\n`;

  return response;
}
