import click
import pyogrio
import yaml
from pmtiles import convert
import os
import subprocess
from glob import glob
from pathlib import Path

@click.command()
@click.option("--input", prompt="Input file", default="input.gpkg", help="Path to any Ogr2ogr compatible geodata, relative to this folder.")
@click.option("--output", prompt="Output file", default="output.pmtiles", help="Output path for PMtiles file, relative to this folder.")
@click.option("--config", prompt="Yaml Config", default="tiles_config.yaml", help="Tippecanoe options in a Yaml format, path relative to this folder.")
@click.option("--retain", prompt="Keep temporary files", default=False, help="Keep temporary fgb and mbtiles data?")
def cli_convert(input, output, config, retain):
    """Simple program that greets NAME for a total of COUNT times."""
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
    
  
def check_compatibility() -> bool:
    is_valid = True

    click.echo('Checking ogr2ogr / gdal compatibility...')
    gdal_is_valid = "FlatGeobuf" in pyogrio.list_drivers()
    if gdal_is_valid:
        click.secho('Gdal supports FlatGeoBuf!', fg='green')
    else:
        click.secho('Error: the available GDAL / ogr2ogr does not support FlatGeoBuf. Please install version 3.1 or newer.', bg='red', bold=True)
        is_valid = False

    click.echo("Checking Tippecanoe Compatibility...")
    tc_v = subprocess.run(["tippecanoe -v"], shell=True, text=True, capture_output=True)
    tc_is_valid = "v2." in tc_v.stderr
    if tc_is_valid:
        click.secho('Tippecanoe supports FlatGeoBuf!', fg='green')
    else:
        click.secho('Error: Tippecanoe is not installed or the available Tippecanoe not support FlatGeoBuf. Please install version 2.1 or higher. See https://github.com/felt/tippecanoe.', fg='red', underline=True, bold=True)
        is_valid = False

    return is_valid

def convert_to_fgb(input: str) -> bool:
    click.secho('🔄 Converting to flatgeobuf 🔄', bg="blue")
    if(not Path(f"./{input}").exists()): 
        click.secho(f'Error: {input} does not exist!', fg='red', underline=True, bold=True)
        return False
    else:
        df = pyogrio.read_dataframe(f"./{input}")
        pyogrio.write_dataframe(df, "./_converted.fgb")
        return True

def run_tippecanoe(input_path: str, config_path: str, output_path: str) -> dict:
    click.secho('🔄 Building MBTiles from FGB 🔄', bg="blue")
    with open(config_path, 'r') as stream:
        config_dict = yaml.safe_load(stream)
    config_dict = flatten_data(config_dict)
    
    tc_args = [
        "tippecanoe",
        "--no-tile-compression",
        "-o",
        output_path,
        input_path
    ]
    for key in config_dict.keys():
        arg = config_dict[key]
        if type(config_dict[key]) is bool:
            tc_args.append(f"--{key}")
        elif type(config_dict[key]) is list:
            for element in arg:
                tc_args.append(f"--{key}={element}")
        else:
            tc_args.append(f"--{key}={arg}")

    subprocess.run(tc_args)
    return config_dict

def convert_mbtiles_to_pmtiles(input_path: str, output_path:str, config: dict) -> bool:
    click.secho('🔄 Building PMTiles from MBTiles 🔄', bg="blue")
    max_zoom = 18
    if type(config['maximum-zoom']) is int:
        max_zoom = config['maximum-zoom']
    convert.mbtiles_to_pmtiles(input_path, output_path, max_zoom, True)
    return True

def flatten_data(y):
    out = {}
    for key in y.keys():
        if type(y[key]) is dict:
            for prop in y[key].keys():
                out[prop] = y[key][prop]
    return out

if __name__ == '__main__':
    cli_convert()