import subprocess
import click
import pyogrio
import yaml
from pathlib import Path
from pmtiles import convert
from utils import flatten_data

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
