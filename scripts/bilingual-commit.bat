@echo off
setlocal enabledelayedexpansion

:: Script para commits bilíngues (PT/EN)
:: Bilingual commit script (PT/EN)

echo 🌍 Commit Bilíngue / Bilingual Commit
echo ====================================

:: Tipos de commit
echo Selecione o tipo de commit / Select commit type:
echo 1. ✨ feat - Nova funcionalidade / New feature
echo 2. 🐛 fix - Correção de bug / Bug fix
echo 3. 📚 docs - Documentação / Documentation
echo 4. 💄 style - Estilo/formatação / Style/formatting
echo 5. ♻️ refactor - Refatoração / Refactoring
echo 6. ⚡ perf - Performance / Performance
echo 7. 🧪 test - Testes / Tests
echo 8. 🔧 chore - Manutenção / Maintenance
echo 9. 💥 BREAKING - Mudança breaking / Breaking change

set /p type_num="Digite o número (1-9): "

if "%type_num%"=="1" (
    set emoji=✨
    set type=feat
) else if "%type_num%"=="2" (
    set emoji=🐛
    set type=fix
) else if "%type_num%"=="3" (
    set emoji=📚
    set type=docs
) else if "%type_num%"=="4" (
    set emoji=💄
    set type=style
) else if "%type_num%"=="5" (
    set emoji=♻️
    set type=refactor
) else if "%type_num%"=="6" (
    set emoji=⚡
    set type=perf
) else if "%type_num%"=="7" (
    set emoji=🧪
    set type=test
) else if "%type_num%"=="8" (
    set emoji=🔧
    set type=chore
) else if "%type_num%"=="9" (
    set emoji=💥
    set type=BREAKING
) else (
    echo Opção inválida / Invalid option
    pause
    exit /b 1
)

:: Título em português
set /p title_pt="Título em português: "

:: Título em inglês
set /p title_en="Title in English: "

:: Descrição em português
echo Descrição em português (Digite cada item, Enter vazio para finalizar):
set description_pt=
set counter=1
:loop_pt
set /p "item=Item %counter%: "
if "%item%"=="" goto end_loop_pt
set description_pt=!description_pt!- %item%^

set /a counter+=1
goto loop_pt
:end_loop_pt

:: Descrição em inglês
echo Description in English (Enter each item, empty line to finish):
set description_en=
set counter=1
:loop_en
set /p "item=Item %counter%: "
if "%item%"=="" goto end_loop_en
set description_en=!description_en!- %item%^

set /a counter+=1
goto loop_en
:end_loop_en

:: Criar arquivo temporário com a mensagem
echo %emoji% [PT/EN] %type%: %title_pt% > temp_commit.txt
echo. >> temp_commit.txt
echo %description_pt% >> temp_commit.txt
echo --- >> temp_commit.txt
echo. >> temp_commit.txt
echo %title_en% >> temp_commit.txt
echo. >> temp_commit.txt
echo %description_en% >> temp_commit.txt

:: Mostrar preview
echo.
echo 📋 Preview do commit / Commit preview:
echo ======================================
type temp_commit.txt
echo ======================================

set /p confirm="Confirmar commit? (y/n): "

if /i "%confirm%"=="y" (
    git add .
    git commit -F temp_commit.txt
    echo ✅ Commit realizado com sucesso! / Commit successful!
) else (
    echo ❌ Commit cancelado / Commit cancelled
)

del temp_commit.txt
pause
