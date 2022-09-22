# PMTiles Utils

Some helpful utils :)

## Convert
### Install
From the repo root, in your terminal:
```
pip install -r convert/requirements.txt
```
External requirements:
- [Tippecanoe > v2.1.x](https://github.com/felt/tippecanoe)
- [ogr2ogr (gdal) > v3.1.x](https://gdal.org/download.html)
### Run
After install python dependencies and making sure you have Tippecanoe and Gdal (ogr2ogr) available in your CLI environment, you can run `python convert` from the repo root in your terminal:
![Prompt based](/docs/img/interactive_cli.png)
Alternatively, you can pass the arguments as flags directly in one line. Run `python convert --help` for more info.
![Flag based](/docs/img/flags.png)

### Config
Change config in `tiles_config.yaml` or create a new version and pass that in to the CLI.

## Viewer
### Install
From the repo root, in your terminal:
```
cd viewer && npm install
# or yarn install
```
External requirements:
- [node.js](https://nodejs.org/en/)
### Run
From the repo root, in your terminal:
```
cd viewer && npm run dev
# or yarn dev
```
### Config and Files
1. Copy your PMTiles file to `viewer/public`
2. Change the path in `viewer/src/config.ts`