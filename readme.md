# PMTiles Utils

Some helpful utils :)

## Convert

### Install Convert

From the repo root, in your terminal:

``` bash
pip install -r convert/requirements.txt
```

External requirements:

- [Tippecanoe > v2.1.x](https://github.com/felt/tippecanoe)
- [ogr2ogr (gdal) > v3.1.x](https://gdal.org/download.html)

### Run Convert

After install python dependencies and making sure you have Tippecanoe and Gdal (ogr2ogr) available in your CLI environment, you can run `python convert` from the repo root in your terminal:
![Prompt based](/docs/img/interactive_cli.png)
Alternatively, you can pass the arguments as flags directly in one line. Run `python convert --help` for more info.
![Flag based](/docs/img/flags.png)

### Config

Change config in `tiles_config.yaml` or create a new version and pass that in to the CLI.

## Viewer

### Install Viewer

From the repo root, in your terminal:

``` bash
cd viewer && npm install
# or yarn install
```

External requirements:

- [node.js](https://nodejs.org/en/)

### Run Viewer

From the repo root, in your terminal:

``` bash
cd viewer && npm run dev
# or yarn dev
```

### Config and Files

1. Copy your PMTiles file to `viewer/public`
2. Change the path in `viewer/src/config.ts`
    - In Config, you can set the following options:
        - filePath: the path to your file from the `public` folder (e.g. "/output.pmtiles")
        - minZoom: the lowest available zoom level (most zoomed out)
        - maxzoom: the max available zoom level (most zoomed in) - if this is greater than your tileset's available data, the map will keep looking for data, and may result in a blank map
        - colorScale: named color scheme from [d3's color scales](https://github.com/d3/d3-scale-chromatic/blob/main/README.md) like "turbo" or "blues" or "RdBu"
        - colorDomain: a min and max value for the range of colors (e.g. [0, 5000])
        - property: data property to access to color (e.g. "population")
    - You can change any config values except `filePath` and the changes will be reflected in your browser immediately. `filePath` changes will automatically reload your window.
