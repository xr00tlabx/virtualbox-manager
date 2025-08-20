@echo off
chcp 65001 >nul

REM Script para sincronizar documentação PT/EN
REM Script to sync PT/EN documentation

echo 📚 Sincronização de Documentação / Documentation Sync
echo =====================================================

:create_index
if "%1"=="index" goto :index_only
if "%1"=="check" goto :check_only
if "%1"=="contributing" goto :contributing_only
if "%1"=="all" goto :sync_all

:menu
echo.
echo Selecione uma opção / Select an option:
echo 1. Verificar arquivos / Check files
echo 2. Criar índice / Create index
echo 3. Criar templates de contribuição / Create contributing templates
echo 4. Sincronizar tudo / Sync everything
echo.
set /p option="Opção (1-4): "

if "%option%"=="1" goto :check_files
if "%option%"=="2" goto :index_only
if "%option%"=="3" goto :contributing_only
if "%option%"=="4" goto :sync_all
echo ❌ Opção inválida / Invalid option
exit /b 1

:check_files
set missing=0

if not exist "docs\pt\API.md" (
    echo ❌ Faltando: docs\pt\API.md
    set missing=1
)

if not exist "docs\en\API.md" (
    echo ❌ Faltando: docs\en\API.md
    set missing=1
)

if not exist "docs\pt\QUICK_START.md" (
    echo ❌ Faltando: docs\pt\QUICK_START.md
    set missing=1
)

if not exist "docs\en\QUICK_START.md" (
    echo ❌ Faltando: docs\en\QUICK_START.md
    set missing=1
)

if "%missing%"=="0" (
    echo ✅ Todos os arquivos encontrados / All files found
)

if "%1"=="check" exit /b %missing%
goto :end

:index_only
echo # 📚 Documentação / Documentation > docs\README.md
echo. >> docs\README.md
echo ## 🇧🇷 Português >> docs\README.md
echo. >> docs\README.md
echo - [🚀 Guia de Instalação Rápida](pt/QUICK_START.md) >> docs\README.md
echo - [📖 Documentação da API](pt/API.md) >> docs\README.md
echo - [🤝 Como Contribuir](pt/CONTRIBUTING.md) >> docs\README.md
echo. >> docs\README.md
echo ## 🇺🇸 English >> docs\README.md
echo. >> docs\README.md
echo - [🚀 Quick Start Guide](en/QUICK_START.md) >> docs\README.md
echo - [📖 API Documentation](en/API.md) >> docs\README.md
echo - [🤝 Contributing](en/CONTRIBUTING.md) >> docs\README.md
echo. >> docs\README.md
echo ## 🌐 Configuração de Idiomas / Language Configuration >> docs\README.md
echo. >> docs\README.md
echo - [📝 Guia de Idiomas / Language Guide](LANGUAGE_GUIDE.md) >> docs\README.md
echo. >> docs\README.md
echo --- >> docs\README.md
echo. >> docs\README.md
echo **Escolha seu idioma / Choose your language:** [PT](pt/) ^| [EN](en/) >> docs\README.md

echo ✅ Índice criado / Index created
if "%1"=="index" exit /b 0
goto :end

:contributing_only
REM Criar diretórios se não existirem
if not exist "docs\pt" mkdir "docs\pt"
if not exist "docs\en" mkdir "docs\en"

REM Português
echo # 🤝 Como Contribuir > docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo Obrigado por seu interesse em contribuir com o VirtualBox Manager! >> docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo ## 📋 Processo de Contribuição >> docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo 1. **Fork** o repositório >> docs\pt\CONTRIBUTING.md
echo 2. **Clone** seu fork >> docs\pt\CONTRIBUTING.md
echo 3. **Crie** uma branch para sua feature: `git checkout -b minha-feature` >> docs\pt\CONTRIBUTING.md
echo 4. **Faça** suas mudanças >> docs\pt\CONTRIBUTING.md
echo 5. **Teste** suas mudanças >> docs\pt\CONTRIBUTING.md
echo 6. **Commit** usando nosso formato bilíngue >> docs\pt\CONTRIBUTING.md
echo 7. **Push** para sua branch: `git push origin minha-feature` >> docs\pt\CONTRIBUTING.md
echo 8. **Abra** um Pull Request >> docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo ## 💬 Commits Bilíngues >> docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo Use o script para commits em PT/EN: >> docs\pt\CONTRIBUTING.md
echo ```bash >> docs\pt\CONTRIBUTING.md
echo ./scripts/bilingual-commit.sh  # Linux/macOS >> docs\pt\CONTRIBUTING.md
echo .\scripts\bilingual-commit.bat # Windows >> docs\pt\CONTRIBUTING.md
echo ``` >> docs\pt\CONTRIBUTING.md
echo. >> docs\pt\CONTRIBUTING.md
echo **Obrigado por contribuir! 🎉** >> docs\pt\CONTRIBUTING.md

REM English
echo # 🤝 Contributing > docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo Thank you for your interest in contributing to VirtualBox Manager! >> docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo ## 📋 Contributing Process >> docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo 1. **Fork** the repository >> docs\en\CONTRIBUTING.md
echo 2. **Clone** your fork >> docs\en\CONTRIBUTING.md
echo 3. **Create** a branch for your feature: `git checkout -b my-feature` >> docs\en\CONTRIBUTING.md
echo 4. **Make** your changes >> docs\en\CONTRIBUTING.md
echo 5. **Test** your changes >> docs\en\CONTRIBUTING.md
echo 6. **Commit** using our bilingual format >> docs\en\CONTRIBUTING.md
echo 7. **Push** to your branch: `git push origin my-feature` >> docs\en\CONTRIBUTING.md
echo 8. **Open** a Pull Request >> docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo ## 💬 Bilingual Commits >> docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo Use the script for PT/EN commits: >> docs\en\CONTRIBUTING.md
echo ```bash >> docs\en\CONTRIBUTING.md
echo ./scripts/bilingual-commit.sh  # Linux/macOS >> docs\en\CONTRIBUTING.md
echo .\scripts\bilingual-commit.bat # Windows >> docs\en\CONTRIBUTING.md
echo ``` >> docs\en\CONTRIBUTING.md
echo. >> docs\en\CONTRIBUTING.md
echo **Thank you for contributing! 🎉** >> docs\en\CONTRIBUTING.md

echo ✅ Templates de contribuição criados / Contributing templates created
if "%1"=="contributing" exit /b 0
goto :end

:sync_all
echo 🔄 Sincronizando tudo / Syncing everything...
call :check_files
call :index_only
call :contributing_only
echo ✅ Sincronização completa! / Sync complete!
goto :end

:end
echo 📚 Documentação atualizada! / Documentation updated!
exit /b 0
