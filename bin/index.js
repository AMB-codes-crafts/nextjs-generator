#!/usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const yargs = require('yargs');

const options = yargs.usage('Usage: -n <name>').options({
  n: {
    alias: 'name',
    describe: 'Project name',
    type: 'string',
    demandOption: true,
  },
  fN: {
    alias: 'forNetlify',
    describe: 'True if hosting on Netlify.',
    type: 'boolean',
    demandOption: false,
  },
  wF: {
    alias: 'withFirebase',
    describe: 'True if using Firebase services.',
    type: 'boolean',
    demandOption: false,
  },
  wFA: {
    alias: 'withFontAwesome',
    describe: 'True if using FontAwesome.',
    type: 'boolean',
    demandOption: false,
  },
}).argv;

const dir = `./${options.name}`;

const createProjectDirectory = () => {
  if (fs.existsSync(dir)) {
    throw new Error('Directory with that name already exists.');
  } else {
    fs.mkdirSync(dir);
    console.log(`Project directory "${dir}" created.`);
  }
};

const createPackageDotJSON = () => {
  console.log('Creating package.json');
  fs.writeFileSync(
    `${dir}/package.json`,
    JSON.stringify(
      {
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          export: options.forNetlify ? 'next export' : undefined,
        },
      },
      null,
      2
    )
  );
};

const createNetlifyDotTOML = () => {
  if (!options.forNetlify) {
    return;
  }

  console.log('Creating netlify.toml');
  fs.writeFileSync(
    `${dir}/netlify.toml`,
    `[build]
  command = "npm run build && npm run export"
  publish = "out"
`
  );
};

const setUpStylesheetsDirectory = () => {
  console.log('Setting up stylesheets directory');
  const stylesheetsDir = `${dir}/stylesheets`;
  fs.mkdirSync(stylesheetsDir);

  console.log('  Creating stylesheets/global.scss');
  fs.writeFileSync(
    `${stylesheetsDir}/global.scss`,
    `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}
`
  );
};

const setUpPagesDirectory = () => {
  console.log('Setting up pages directory');
  const pagesDir = `${dir}/pages`;
  fs.mkdirSync(pagesDir);

  let appJSContents = '';
  console.log('  Creating pages/_app.js');
  if (options.withFontAwesome) {
    appJSContents = `import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

`;
  }

  appJSContents += "import '../stylesheets/global.scss';\n";

  if (options.withFontAwesome) {
    appJSContents += '\nlibrary.add(fas);\n';
  }

  appJSContents += `\nexport default function MyApp({  Component, pageProps }) {
  return <Component {...pageProps} />;
}
`;

  fs.writeFileSync(`${pagesDir}/_app.js`, appJSContents);

  console.log('  Creating pages/index.js');
  fs.writeFileSync(
    `${pagesDir}/index.js`,
    `const HomePage = () => <h1>Hello, HomePage!</h1>;

export default HomePage;
`
  );
};

const setUpLibDirectory = () => {
  console.log('Setting up lib directory');
  const libDir = `${dir}/lib`;
  fs.mkdirSync(libDir);

  console.log('  Creating lib/api.js');
  fs.writeFileSync(`${libDir}/api.js`, '// Do your api operations here\n');

  if (options.withFirebase) {
    console.log('  Creating lib/firebase.js');
    fs.writeFileSync(
      `${libDir}/firebase.js`,
      `import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    })
  }
}
`
    );
  }
};

const installPackages = () => {
  const packages = ['next', 'react', 'react-dom', 'sass'];
  if (options.withFirebase) {
    packages.push('firebase');
  }

  if (options.withFontAwesome) {
    packages.push('@fortawesome/fontawesome-svg-core');
    packages.push('@fortawesome/free-solid-svg-icons');
    packages.push('@fortawesome/react-fontawesome');
  }

  const packagesAsCommaList = packages.join(', ');
  const packagesAsSpaceList = packages.join(' ');
  console.log(`Installing packages: ${packagesAsCommaList}`);
  exec(`npm install ${packagesAsSpaceList}`, { cwd: dir }, () => {
    console.log('Finished! 🎉');
  });
};

const createDotENV = () => {
  if (options.withFirebase) {
    console.log('Creating .env');
    fs.writeFileSync(
      `${dir}/.env`,
      `NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
`
    );
  }
};

createProjectDirectory();
createPackageDotJSON();
createDotENV();
createNetlifyDotTOML();
setUpStylesheetsDirectory();
setUpPagesDirectory();
setUpLibDirectory();
installPackages();