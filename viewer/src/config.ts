export const Config = {
    filePath: "/blocks1.pmtiles", // relative to public folder
    minZoom: 6,
    maxZoom: 15,
    // supported schemes all except categorical- https://github.com/d3/d3-scale-chromatic/blob/main/README.md
    // use color scheme name like "turbo" or "blues" or "RdBu". Not case sensitive :) 
    colorScale: "turbo",
    colorDomain: [0, 30],
    property: "k_complexity"
}