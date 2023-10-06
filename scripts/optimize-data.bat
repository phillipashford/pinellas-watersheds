echo off

@REM Project to WGS 84, simplify geometry, and reduce coordinate precision
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-county.geojson
set tolerance=10
set coordinatePrecision=5
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/simplified-optimized-pinellas-county.geojson
ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -simplify %tolerance% -lco COORDINATE_PRECISION=%coordinatePrecision% %outputFile% %inputFile%

@REM Filter national catchment gpkg (29.3 GB)
@REM set inputFile=C:/Users/psash/Downloads/ATTAINS_Assessment_20230908_gpkg/ATTAINS_Assessment_20230908.gpkg
@REM set layerName=attains_au_catchments
@REM set outputFile=C:/Users/psash/Documents/pinellas-watersheds/florida-watersheds.gpkg
@REM ogr2ogr -f "GPKG" -where "state = 'FL'" %outputFile% %inputFile% -nln %layerName%

@REM Clip the filtered catchment gpkg (416 MB) by the pinellas county mask layer - Resulting geojson is 37 MB
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/florida-watersheds.gpkg
set maskLayer=C:/Users/psash/Documents/pinellas-watersheds/optimized-pinellas-county.geojson
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-watersheds.geojson
ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -clipsrc %maskLayer% %outputFile% %inputFile%

@REM @REM View attributes
@REM ogrinfo -al -so C:/Users/psash/Documents/pinellas-watersheds/pinellas-watersheds.geojson

@REM Drop unnecessary attributes - Resulting geojson is 34 MB
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-watersheds.geojson
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-watersheds-cleaned.geojson
ogr2ogr -f "GeoJSON" -select "assessmentunitname" %outputFile% %inputFile%

@REM Simplify geometry, and reduce coordinate precision
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-watersheds-cleaned.geojson
set tolerance=0.0003
set coordinatePrecision=5
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/optimized-pinellas-watersheds-%tolerance%-tolerance-precision-%coordinatePrecision%.geojson
ogr2ogr -f "GeoJSON" -simplify %tolerance% -lco COORDINATE_PRECISION=%coordinatePrecision% %outputFile% %inputFile%

echo "done"


