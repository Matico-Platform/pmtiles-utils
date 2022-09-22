import click
import os
from utils import check_compatibility
from geo_file_utils import run_tippecanoe, convert_to_fgb, convert_mbtiles_to_pmtiles

@click.command()
@click.option("--input", prompt="Input file", default="input.gpkg", help="Path to any Ogr2ogr compatible geodata, relative to this folder.")
@click.option("--output", prompt="Output file", default="output.pmtiles", help="Output path for PMtiles file, relative to this folder.")
@click.option("--config", prompt="Yaml Config", default="tiles_config.yaml", help="Tippecanoe options in a Yaml format, path relative to this folder.")
@click.option("--retain", prompt="Keep temporary files", default=False, help="Keep temporary fgb and mbtiles data?")
def cli_convert(input, output, config, retain):
    """A program to help convert from any gdal supported geospatial data format to PMTiles."""
    click.secho('🔄 Starting File Conversion 🔄', bg="blue")
    # CLI VALIDATION
    is_valid = check_compatibility()
    if is_valid != True:
        click.secho('Tool validation failed, please see above errors.', bg='red', bold=True)
        return
    else:
        click.secho('Your Tippecanoe and Ogr2ogr install are compatible!', fg='green')

    # FGB CONVERSION
    fgb_success = convert_to_fgb(input) 
    if fgb_success != True:
        click.secho('Conversion failed, please see above errors.', bg='red', bold=True)
        return
    else:
        click.secho('Flat geobuf converted.', fg='green')

    # TIPPECANOE
    config_dict = run_tippecanoe('./_converted.fgb', config, './_converted.mbtiles')
    
    # PMTILES
    convert_mbtiles_to_pmtiles('./_converted.mbtiles', output, config_dict)

    #CLEANUP
    if not retain:
        click.echo('Recycling old files...',)
        os.remove('_converted.fgb')
        os.remove('_converted.mbtiles')
    click.secho('🔄 Conversion Complete! 🔄', bg="green")
    
  

if __name__ == '__main__':
    cli_convert()