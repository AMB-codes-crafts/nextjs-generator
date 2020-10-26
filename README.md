# nextjs-generator

I created this because I got tired of creating the same files over and over again. I want to focus more on Next.js concepts and less on setting up projects.

## Command line options

| Option                | Required | Description                                                                                                                                                               |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| n (name)              | Yes      | Name of the project directory.                                                                                                                                            |
| fN (forNetlify)       | No       | Adds "export" script in package.json and a "netlify.toml" file.                                                                                                           |
| wF (withFirebase)     | No       | Adds environment variables in .env, "lib/firebase.js", and installs "firebase".                                                                                           |
| wFA (withFontAwesome) | No       | Adds code to load "fas" icons in "pages/\_app.js" and installs "@fortawesome/fontawesome-svg-core", "@fortawesome/free-solid-svg-icons", "@fortawesome/react-fontawesome" |

## Usage

nextjs-generator -n my-app --fN --wF --wFA
