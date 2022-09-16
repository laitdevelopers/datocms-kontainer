# Kontainer plugin for DatoCMS

## What is this repository for?

This repo contains the source code for the Kontainer DatoCMS plugin.

## How do I get set up?

Run ```npm install``` or ```npm clean-install``` to get all the required packages.

When node modules have been installed run  ```npm run start```, this will run the plugin in your browser on <http://localhost:3000>

In your DatoCMS application, go to Settings -> Plugins and add a new plugin, choose *Create new plugin*.
In the popup, write *Kontainer plugin* or something that makes more sense to you,
and set the url to <http://localhost:3000>

Now the presentation *Kontainer Assets* is available on the *JSON* field type.

## Publishing

Run ```npm run build``` to prepare the build files.

Ensure that any new required files are added to package.json files array.
README.md, LICENSE.md, and package.json are always included.  
```{ "files" : [ "build", "kontainer-logo.png"] }```

To validate what files are deployed use ```npx npm-packlist```.

Run ```npm version {major|minor|patch}``` to increment the package version, and tag the git repository.

Run ```npm publish``` when you're ready to deploy.

Npm might give a 404 error, this is likely because you're not logged in, and not because the package doesn't exist.  
Fix it by running ```npm login```, and follow the prompts.

## Contribution guidelines

We are using Git flow as a branching and release model.
