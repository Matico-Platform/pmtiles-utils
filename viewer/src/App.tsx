import { useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import {
  PMTLayer,
} from "@maticoapp/deck.gl-pmtiles";
import { Config } from './config';
import { ConfigSpec, generateColorFunc, BgTileLayer, INITIAL_VIEW_STATE } from './utils';

const {
  filePath, maxZoom, minZoom, colorScale, property, colorDomain
} = Config as ConfigSpec;


export default function App() {
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
        stroked: colorScale
      }

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
      {(!!colorScale && !!property && !!colorDomain) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, background: 'rgba(255,255,255,0.9)', padding: '1em' }}>
            <ColorRange colorFunction={colorFunction} colorDomain={colorDomain} property={property} />
        </div>
      )}
    </div>
  );
}

const ColorRange: React.FC<{ colorFunction: (f: any) => number[], colorDomain: [number, number], property: string }> = ({ colorFunction, colorDomain, property }) => {
  const rangeIncrement = (colorDomain[1] - colorDomain[0]) / 9;
  const range = [colorDomain[0], ...(Array.from({ length: 9 }, (_, i) => colorDomain[0] + i * rangeIncrement))];
  return (
    
    <div style={{
      display:'flex',
      flexDirection:'column'
    }}>
      <h1>{property}</h1>
      <div style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
      }}>
        {range.map((r, i) => (
          <div key={i} style={{
            width: '10px',
            height: '10px',
            background: `rgb(${colorFunction({properties: {[property]: r}}).join(',')})`
          }}></div>
        ))}
        </div>
      <div style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
      }}>
        {range.map((r, i) => (
            (i === 0 || i % 2 === 0) ? <p key={i}>{formatNumber(r)}</p> : null
          ))
        }
        </div>
      </div>
  )

}
function formatNumber(number: number): string{
  const val = +number;
  if (isNaN(val)) return `${number}`;
  return new Intl.NumberFormat(undefined, {
      notation: "compact",
      maximumFractionDigits: 4,
      maximumSignificantDigits: 2,
      compactDisplay: "short"
  }).format(val);
}