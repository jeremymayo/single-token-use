@echo off
set LOGFILE=batch.log
call :LOG > %LOGFILE%
exit /B

:LOG

tabcmd login --server http://localhost --username admin --password admin

tabcmd publish "Superstore Data.tdsx" -n "Superstore Data"

tabcmd publish "tc_viz.twb" -n "tc_viz"

tabcmd publish "RedirectPage.twbx" -n "RedirectPage"

tabcmd logout