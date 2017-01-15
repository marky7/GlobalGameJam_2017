@echo off
setlocal enabledelayedexpansion enableextensions

type client-part1.html > client.html

echo. >> client.html
echo ^<div^> ^<^^!--CORE FILES--^> >> client.html
for %%x in (core/*.js) do echo ^<script src="core/%%x"^>^</script^> >> client.html
echo ^</div^> >> client.html

echo. >> client.html
echo ^<div^> ^<^^!--LIB FILES--^> >> client.html
for %%x in (lib/*.js) do echo ^<script src="lib/%%x"^>^</script^> >> client.html
echo ^</div^> >> client.html

echo. >> client.html
echo ^<div^> ^<^^!--GUI FILES--^> >> client.html
for %%x in (gui/*.js) do echo ^<script src="gui/%%x"^>^</script^> >> client.html
echo ^</div^> >> client.html

echo. >> client.html
echo ^<div^> ^<^^!--DATA FILES--^> >> client.html
for %%x in (data/*.js) do echo ^<script src="data/%%x"^>^</script^> >> client.html
echo ^</div^> >> client.html

echo. >> client.html
type client-part2.html >> client.html
