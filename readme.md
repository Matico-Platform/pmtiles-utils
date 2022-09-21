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
From the repo root, in your terminal:
```
python convert
# Follow prompts...
```
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