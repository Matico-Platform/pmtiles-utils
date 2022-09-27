import { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react/typed";
import {
  PMTLayer,
} from "@maticoapp/deck.gl-pmtiles";
import { Config } from './config';
import { ConfigSpec, generateColorFunc, BgTileLayer, INITIAL_VIEW_STATE } from './utils';
import { ColorRange } from "./ColorRange";

const {
  filePath, maxZoom, minZoom, colorScale, property, colorDomain
} = Config as ConfigSpec;


export default function App() {
  const [pathInner, setPathInner] = useState(filePath);
  const [tileContent, setTileContent] = useState({})
  const colorFunction = generateColorFunc(colorScale, colorDomain, property);

  const layers = [
    BgTileLayer,
    new PMTLayer({
      id: "pmtiles-layer",
      data: filePath,
      onHover: ({ object }) => { setTileContent(object ? object : {}) },
      autoHighlight: true,
      maxZoom,
      minZoom,
      //@ts-ignore
      getFillColor: colorFunction,
      stroked: !colorScale,
      lineWidthMinPixels: 1,
      pickable: true,
      tileSize: 256,
      updateTriggers: {
        getFillColor: [colorScale, JSON.stringify(colorDomain), property],
        stroked: colorScale,
        minZoom: minZoom,
        maxZoom: maxZoom,
      }

    })
  ];

  useEffect(() => {
    if (pathInner !== filePath) {
      setPathInner(filePath);
      alert(`New filepath (${filePath}) - refreshing...`)
      window.location.reload()
    }
  }, [filePath])

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
      {(!!colorScale && !!property && !!colorDomain) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, background: 'rgba(255,255,255,0.9)', padding: '1em' }}>
          <h1 style={{ margin: '0 0 .5em 0', padding: 0 }}>{property}</h1>
          <ColorRange colorFunction={colorFunction} colorDomain={colorDomain} property={property} />
        </div>
      )}
    </div>
  );
}
