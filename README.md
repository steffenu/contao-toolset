# Contao Toolset - Tasks Made Easy!


<p align="center">
<img width="50" src="https://img.shields.io/badge/GULP-%23CF4647.svg?style=for-the-badge&logo=gulp&logoColor=white"> <img width="50" src="https://img.shields.io/badge/contao-F37440?style=for-the-badge"> 
</p>

This Contao Toolset uses the following development environment: [Steffen's Dev-Env](https://gitlab.lupcom.de/dev-env/steffen)

---

The Contao Toolset is designed to automate:

1. The complete initial setup of a new project with a preset database.
2. The setup of a demo domains ftp server.
3. Filewatcher tasks, including automatic template creation, quality-of-life scripts, and some OpenAI Featues.

By automating routine, repetitive tasks and speeding up the build process, Gulp can save a lot of time. It may also prevent developers from feeling burnt out and make them more satisfied with their jobs.

## Installation

Follow these steps to install the Contao Toolset:

### Step 1: Clone the Git Repository

Run the following command in your project directory to clone the Contao Toolset. This will create a "ts" folder in your project:

```
git clone git@gitlab.lupcom.de:dev-env/entwicklungsumgebung-steffen/contao-toolset.git ts
```

### Step 2: Copy the Necessary Files and Folders

Copy the following files and folders from the "ts" folder to your project directory:

- `contao-toolset` (folder)
- `gulpfile`
- `package.json`

### Step 3: Install the Toolset Dependencies

Run the following command to install the necessary dependencies:

```
npm install
```

### Step 4: Update `.gitignore`

Add the following lines to your `.gitignore` file:

```
# Contao Toolset
contao-toolset
node_modules
gulpfile.js
package.json
package-lock.json
```

## Usage

You can use the following commands to work with the Contao Toolset:

- `gulp` or `npm start`: Start the project setup and automatically perform actions when files change.
- `npm run settings` - Configure the Filewatcher
- `npm run project`: Create a new project.
- `npm run demo_domain`: Create a demo domain and Gitlab project.
- `npm run templates_create`: Generate content elements and backend modules.
- `npm run import_db`: Import a live database to the development environment.
- `npm run export_db`: Export a development database to the live environment.
- `npm run files`: Download files via SFTP.

## Additional Tag Features :

You can add the following tags / comments to a file 
which will create additional actions on save. (openai api key required )

- `//COMMENT` - generates description for the next function below the tag 
- `//README` - Generates Readme for the given file (currently supported filetypes = js)
- `/* ##ASK - your question here */` - This tag will be replaced with the answer from openai


## Composer Features :

> execute  composer install , composer update inside docker container to automatically use the correct php version.

Recommended to install gulp globally :
```
sudo npm install --global gulp-cli
```

- `gulp install`
- `gulp update`

or alternatively use without gulp global:

- `npm run install`
- `npm run update`

## Disabled Features

Some features are currently only active if you are using my development environment (Steffen). These features include:

- Automatic initial setup of Nginx and SSL certificates.
- DCA - automatic composer install on DCA changes.
- DCA - automatic migration of DCA changes.
- Gulp install and update commands to run composer install or update in the correct container.
- Composer - check platform requirements (PHP Version, Extensions).

The tool will ask you and, upon confirmation, clone my dev-env environment into your `www` folder if it doesn't already exist. You can check out my environment [here](https://gitlab.lupcom.de/dev-env/steffen).

## Settings

Configure Filewatcher Settings and enable Features. ( Most Featues are off by default)

Please run `npm start`` once to generate a config file which is required before running :

```
npm run settings
```

- `Livereload - Browsersync` - Livereload for html,css,js on url localhost:3000
- `Livereload - Puppeteer` - Livereload for html,css,js on original url name.loc
- `Puppeteer - Extras` - Evaluations / Navigation / Injections for Pages
- `Prettier - HTML` - Format on save
- `Prettier - SCSS` - Format on save
- `Prettier - JS` - Format on save
- `Linting` - Linting on save (console infos)
- `Fileaheaders - Datum und Autor` - ...
- `Fileaheaders - Status anzeigen` - hinting  standarts
- `Kompilieren - SCSS` - compile scss on save (using compile mode)
- `Kompilieren - TS` - compile ts on save
- `Kompilieren Modus Lupcom` - compiles from scss to css folder (alternative mode available. off = ivo - compile from nested scss folder to css folder)
- `Contao - Clear Cache` - clears contao page, image , script cache on save (as alternative to debug mode)
- `DCA - composer install` - executes composer install on save (in dca folder) 
- `DCA - migrate` - executes migrate  on save (in dca folder) 