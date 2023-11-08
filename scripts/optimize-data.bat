echo off

@REM Project to WGS 84, simplify geometry, and reduce coordinate precision
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-county.geojson
set tolerance=10
set coordinatePrecision=5
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/simplified-optimized-pinellas-county.geojson
ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -simplify %tolerance% -lco COORDINATE_PRECISION=%coordinatePrecision% %outputFile% %inputFile%

@REM Filter national waterways gpkg (29.3 GB)
set inputFile=C:/Users/psash/Downloads/ATTAINS_Assessment_20230908_gpkg/ATTAINS_Assessment_20230908.gpkg
set layerName=attains_au_lines
set layerNickname=waterlines
set outputFile=C:/Users/psash/Documents/pinellas-%layerNickname%/florida_%layerNickname%.gpkg
ogr2ogr -f "GPKG" -where "state = 'FL'" %outputFile% %inputFile% -nln %layerName%

@REM Clip the filtered catchment gpkg (416 MB) by the pinellas county mask layer - Resulting geojson is 37 MB
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/florida-%layerNickname%.gpkg
set maskLayer=C:/Users/psash/Documents/pinellas-watersheds/optimized-pinellas-county.geojson
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-%layerNickname%.geojson
ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -clipsrc %maskLayer% %outputFile% %inputFile%

@REM @REM View attributes
ogrinfo -al -so C:/Users/psash/Documents/pinellas-watersheds/pinellas-%layerNickname%.geojson

@REM Drop unnecessary attributes - Resulting geojson is 34 MB
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-%layerNickname%.geojson
set outputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-%layerNickname%-cleaned.geojson
ogr2ogr -f "GeoJSON" -select "assessmentunitname,waterbodyreportlink" %outputFile% %inputFile%

@REM Simplify geometry, and reduce coordinate precision
set inputFile=C:/Users/psash/Documents/pinellas-watersheds/pinellas-%layerNickname%-cleaned.geojson
set tolerance=0.0003
set coordinatePrecision=5
set outputFile=C:/Users/psash/Documents/pinellas-%layerNickname%/optimized-pinellas-waters%layerNickname%heds-%tolerance%-tolerance-precision-%coordinatePrecision%.geojson
ogr2ogr -f "GeoJSON" -simplify %tolerance% -lco COORDINATE_PRECISION=%coordinatePrecision% %outputFile% %inputFile%

echo "done"


