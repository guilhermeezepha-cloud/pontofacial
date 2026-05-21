#!/bin/bash
set -e

echo "📌 Parando Gradle e Metro..."
cd /Users/jonastolentino/projects/fillet/dorma/ponto-facial
./android/gradlew --stop || true
pkill -f GradleDaemon || true
pkill -f 'java.*gradle' || true
watchman watch-del-all 2>/dev/null || true
watchman shutdown-server 2>/dev/null || true

echo "📌 Corrigindo permissões do projeto..."
sudo chown -R $(whoami):staff .
chmod -R u+rwX .

echo "📌 Limpando node_modules e builds..."
rm -rf node_modules
rm -rf android/.cxx
rm -rf android/build
rm -rf android/app/build
rm -rf node_modules/onnxruntime-react-native/android/build

echo "📌 Instalando dependências com Yarn..."
yarn install

echo "📌 Limpando Gradle..."
cd android
./gradlew clean
cd ..

echo "✅ Reset concluído!"
echo "Agora abra dois terminais:"
echo "  1️⃣ yarn start --reset-cache"
echo "  2️⃣ yarn android"
