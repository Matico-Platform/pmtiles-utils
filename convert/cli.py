import click
import os
from utils import check_compatibility
from geo_file_utils import run_tippecanoe, convert_to_fgb, convert_mbtiles_to_pmtiles

@click.command()
@click.option("--input", prompt="Input file", default="input.gpkg", help="Path to any Ogr2ogr compatible geodata, relative to this folder.")
@click.option("--output", prompt="Output file", default="output.pmtiles", help="Output path for PMtiles file, relative to this folder.")
@click.option("--config", prompt="Yaml Config", default="tiles_config.yaml", help="Tippecanoe options in a Yaml format, path relative to this folder.")
@click.option("--retain", prompt="Keep temporary files", default=False, help="Keep temporary fgb and mbtiles data? Helpful if running multiple variations.")
@click.option("--force", prompt="Force Overwrite", default=True, help="Replace old MBtiles and PMtiles files? Helpful if running multiple variations.")
def cli_convert(input, output, config, retain, force):
    """A program to help convert from any gdal supported geospatial data format to PMTiles."""

    input_type = input.split('.')[-1]
    output_name = output.split('/')[-1].split('\\')[-1].split('.')[0]

    if force:
        click.echo('Recycling old files...')
        try:
            os.remove(f'{output_name}.pmtiles')
        except:
            pass
        try:
            os.remove(f'{output_name}.mbtiles')
        except:
            pass

    click.secho('🔄 Starting File Conversion 🔄', bg="blue")
    # CLI VALIDATION
    is_valid = check_compatibility()
    if is_valid != True:
        click.secho('Tool validation failed, please see above errors.', bg='red', bold=True)
        return
    else:
        click.secho('Your Tippecanoe and Ogr2ogr install are compatible!', fg='green')

    # FGB CONVERSION
    if input_type == 'fgb':
        click.secho('Input file is already an FGB, no conversion needed.', fg='green')
        fgb_filename = input
        fgb_success = True
    else:
        click.secho('Converting input file to FGB format...')
        fgb_success = convert_to_fgb(input, output_name) 
        if fgb_success != True:
            click.secho('Conversion failed, please see above errors.', bg='red', bold=True)
            return
        else:
            click.secho('Flat geobuf converted.', fg='green')
            fgb_filename = f'./{output_name}.fgb'

    # TIPPECANOE
    config_dict = run_tippecanoe(fgb_filename, config, f'./{output_name}.mbtiles')
    
    # PMTILES
    convert_mbtiles_to_pmtiles(f'./{output_name}.mbtiles', output, config_dict)

    #CLEANUP
    if not retain:
        click.echo('Recycling old files...',)
        os.remove(f'{output_name}.fgb')
        os.remove(f'{output_name}.mbtiles')
    click.secho('🔄 Conversion Complete! 🔄', bg="green")
    
  

if __name__ == '__main__':
    cli_convert()