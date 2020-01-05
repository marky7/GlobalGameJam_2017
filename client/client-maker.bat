@echo off
setlocal enabledelayedexpansion enableextensions

type client-part1.html > client.ejs

echo. >> client.ejs
echo ^<div^> ^<^^!--CORE FILES--^> >> client.ejs
for %%x in (core/*.js) do echo ^<script src="core/%%x"^>^</script^> >> client.ejs
echo ^</div^> >> client.ejs

echo. >> client.ejs
echo ^<div^> ^<^^!--LIB FILES--^> >> client.ejs
for %%x in (lib/*.js) do echo ^<script src="lib/%%x"^>^</script^> >> client.ejs
echo ^</div^> >> client.ejs

echo. >> client.ejs
echo ^<div^> ^<^^!--GUI FILES--^> >> client.ejs
for %%x in (gui/*.js) do echo ^<script src="gui/%%x"^>^</script^> >> client.ejs
echo ^</div^> >> client.ejs

echo. >> client.ejs
echo ^<div^> ^<^^!--DATA FILES--^> >> client.ejs
for %%x in (data/*.js) do echo ^<script src="data/%%x"^>^</script^> >> client.ejs
echo ^</div^> >> client.ejs

echo. >> client.ejs
type client-part2.html >> client.ejs
