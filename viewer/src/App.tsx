import React, { useState, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react/typed";
import { BitmapLayer, GeoJsonLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import {
  PMTLayer,
} from "@maticoapp/deck.gl-pmtiles";
import { Config } from './config';

const {
  filePath, maxZoom, minZoom
} = Config;

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0,
  pitch: 0,
  bearing: 0,
};

export default function App() {
  const [tileContent, setTileContent] = useState({})

  const layers = [
    new TileLayer({
      id: 'TileLayer',
      data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      maxZoom: 19,
      minZoom: 0,
      renderSubLayers: props => {
        const {
          // @ts-ignore
          bbox: { west, south, east, north }
        } = props.tile;

        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      },
      pickable: true,
    }),
    new PMTLayer({
      id: "pmtiles-layer",
      data: filePath,
      onHover: ({ object }) => { setTileContent(object ? object : {}) },
      autoHighlight: true,
      maxZoom,
      minZoom,
      getFillColor: (d) => [255, 120, 120],//incomeScale(d.properties?.["PerCapitaIncome"]),
      stroked: true,
      lineWidthMinPixels: 1,
      pickable: true,
      tileSize: 256,
    })
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      />
      {!!Object.keys(tileContent)
        &&
        <pre style={{ position: 'fixed', top: 0, right: 0, background: 'rgba(255,255,255,0.9)', maxWidth: '300px', padding: '1em' }}>
          {JSON.stringify(tileContent, null, 2)}
        </pre>
      }
    </div>
  );
}
