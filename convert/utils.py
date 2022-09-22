import click
import subprocess
import pyogrio

def flatten_data(y):
    out = {}
    for key in y.keys():
        if type(y[key]) is dict:
            for prop in y[key].keys():
                out[prop] = y[key][prop]
    return out

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
