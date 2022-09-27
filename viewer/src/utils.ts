import { BitmapLayer } from "@deck.gl/layers/typed";
import { TileLayer } from "@deck.gl/geo-layers/typed";
import * as d3 from "d3";

export const colorSchemeMapping = {
  brbg: d3.interpolateBrBG,
  prgn: d3.interpolatePRGn,
  piyg: d3.interpolatePiYG,
  puor: d3.interpolatePuOr,
  rdbu: d3.interpolateRdBu,
  rdgy: d3.interpolateRdGy,
  rdylbu: d3.interpolateRdYlBu,
  rdylgn: d3.interpolateRdYlGn,
  spectral: d3.interpolateSpectral,
  blues: d3.interpolateBlues,
  greens: d3.interpolateGreens,
  greys: d3.interpolateGreys,
  oranges: d3.interpolateOranges,
  purples: d3.interpolatePurples,
  reds: d3.interpolateReds,
  turbo: d3.interpolateTurbo,
  viridis: d3.interpolateViridis,
  inferno: d3.interpolateInferno,
  magma: d3.interpolateMagma,
  plasma: d3.interpolatePlasma,
  cividis: d3.interpolateCividis,
  warm: d3.interpolateWarm,
  cool: d3.interpolateCool,
  cubehelixDefault: d3.interpolateCubehelixDefault,
  rainbow: d3.interpolateRainbow,
  sinebow: d3.interpolateSinebow,
  bugn: d3.interpolateBuGn,
  bupu: d3.interpolateBuPu,
  gnbu: d3.interpolateGnBu,
  orrd: d3.interpolateOrRd,
  pubugn: d3.interpolatePuBuGn,
  pubu: d3.interpolatePuBu,
  purd: d3.interpolatePuRd,
  rdpu: d3.interpolateRdPu,
  ylgnbu: d3.interpolateYlGnBu,
  ylgn: d3.interpolateYlGn,
  ylorbr: d3.interpolateYlOrBr,
  ylorrd: d3.interpolateYlOrRd,
};

export interface ConfigSpec {
  filePath: string;
  minZoom: number;
  maxZoom: number;
  colorScale?: keyof typeof colorSchemeMapping;
  property?: string;
  colorDomain?: [number, number];
}

export const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0,
  pitch: 0,
  bearing: 0,
};

const defaultColorFunc = (_f: any) => [120, 120, 120];
export const generateColorFunc = (
  colorScale?: keyof typeof colorSchemeMapping,
  colorDomain?: [number, number],
  property?: string
) => {
  if (!colorScale || !colorDomain || !property) return defaultColorFunc;

  const colorFunc =
    colorSchemeMapping[
      colorScale.toLocaleLowerCase() as keyof typeof colorSchemeMapping
    ];
  if (!colorFunc) return defaultColorFunc;

  const colorScaleFunc = d3.scaleSequential(colorFunc).domain(colorDomain);
  const convertColor = (d: any) => {
    // @ts-ignore
    return colorScaleFunc(d)
      .slice(4, -1)
      .split(",")
      .map((v: string) => parseInt(v));
  };
  const accessor = (d: any) => d.properties[property];

  return (f: any) => convertColor(accessor(f));
};

export const BgTileLayer = new TileLayer({
  id: "TileLayer",
  data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  maxZoom: 19,
  minZoom: 0,
  renderSubLayers: (props) => {
    const {
      // @ts-ignore
      bbox: { west, south, east, north },
    } = props.tile;

    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    });
  },
  pickable: true,
});
