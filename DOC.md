# Ponto Facial - Aplicativo Mobile

## 📱 Visão Geral

O **Ponto Facial** é um aplicativo móvel desenvolvido em React Native que permite o registro de ponto através de reconhecimento facial. O sistema oferece uma solução moderna e segura para controle de frequência, utilizando tecnologias de machine learning para identificação biométrica.

### 🎯 Objetivo Principal
O aplicativo tem como função capturar a foto do funcionário, identificar no arquivo de treinamento e registrar a marcação (batida) via API REST do backend. Esta marcação vai ser sincronizada com o sistema de ponto (via SOAP) quando houver internet. O app também pode operar offline, armazenando localmente as marcações e enviando quando houver conectividade.

## 🎯 Funcionalidades Principais

### 🔐 Autenticação e Configuração
- **Configuração Inicial**: Registro do coletor/dispositivo no sistema
- **Autenticação por Token**: Sistema seguro de autenticação JWT
- **Gestão de Sessão**: Manutenção automática da sessão do usuário

### 👤 Reconhecimento Facial
- **Captura de Face**: Interface intuitiva para captura da imagem facial
- **Processamento Local**: Utilização de modelos ONNX para processamento em tempo real
- **Validação Biométrica**: Comparação de embeddings faciais para identificação
- **Feedback Visual**: Indicadores visuais durante o processo de captura

### ⏰ Registro de Ponto
- **Marcação Automática**: Registro automático após identificação facial
- **Histórico de Marcações**: Visualização do histórico de pontos registrados
- **Sincronização**: Envio automático dos dados para o servidor
- **Modo Offline**: Armazenamento local quando não há conectividade

### 📊 Relatórios e Consultas
- **Calendário de Marcações**: Visualização mensal das marcações
- **Estatísticas**: Resumos e estatísticas de frequência
- **Lista de Marcações**: Marcações relacionadas ao coletor específico
- **Gerenciamento de Configurações**: Interface para configurar o dispositivo

## 🚀 Fluxo de Uso da Aplicação

### 1. Primeiro Acesso - Cadastro do Coletor
- Ao abrir o app pela primeira vez, você verá a tela de cadastro do coletor
- Digite o código do grupo fornecido pelo administrador
- Digite o nome do coletor (identificação do dispositivo)
- O sistema irá validar o código e registrar o coletor no backend

### 2. Reconhecimento Facial para Marcação
- Após o cadastro, a tela principal permite capturar a foto do funcionário
- A câmera é ativada e o sistema detecta automaticamente o rosto
- O processamento de reconhecimento facial é feito localmente usando modelos ONNX
- Se o funcionário for identificado, a marcação é registrada automaticamente
- Feedback visual indica o sucesso ou falha da identificação

### 3. Sincronização e Conectividade
- Quando há internet, as marcações são enviadas automaticamente para o backend
- O backend sincroniza com o sistema de ponto via SOAP
- Em modo offline, as marcações ficam armazenadas localmente
- Quando a conectividade é restaurada, a sincronização acontece automaticamente

### 4. Consulta de Marcações
- O app permite visualizar as marcações já registradas
- Filtros por data e funcionário
- Status da sincronização (pendente, sincronizado, erro)

### 5. Configurações
- Ajustes de conectividade com o servidor
- Configurações de timeout e retry
- Informações do dispositivo e versão

## 🏗️ Arquitetura Técnica

### 📋 Stack Tecnológico
- **Framework**: React Native 0.80.0
- **Linguagem**: TypeScript
- **Gerenciamento de Estado**: Redux Toolkit
- **Navegação**: React Navigation v7
- **Formulários**: React Hook Form + Zod
- **Câmera**: React Native Vision Camera
- **Machine Learning**: ONNX Runtime React Native
- **Detecção Facial**: React Native Vision Camera Face Detector

### 🧠 Machine Learning
- **Modelos ONNX**: Processamento local de reconhecimento facial
- **Embeddings**: Geração de vetores característicos das faces
- **Similaridade**: Algoritmos de comparação para identificação
- **Modelos Utilizados**:
  - `det_10g.onnx`: Detecção facial
  - `glintr100.onnx`: Geração de embeddings
  - `w600k_r50.onnx`: Rede neural para características faciais
  - `genderage.onnx`: Análise de gênero e idade
  - `1k3d68.onnx`: Pontos de referência facial
  - `2d106det.onnx`: Detecção de pontos faciais

### 🗂️ Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
├── config/             # Configurações (Redux, Axios, Navigation)
├── features/           # Módulos funcionais
│   ├── attendance/     # Funcionalidades de ponto
│   ├── auth/          # Autenticação
│   ├── face-recognition/ # Reconhecimento facial
│   ├── menu/          # Menu principal
│   ├── register/      # Registro inicial
│   └── settings/      # Configurações
├── hooks/             # Hooks customizados
├── machine-learning/  # Módulos de ML
├── styles/           # Estilos globais
├── types/            # Definições de tipos
├── utils/            # Utilitários
└── views/            # Telas principais
```

### 🔄 Fluxo de Dados
1. **Inicialização**: Carregamento dos modelos de ML
2. **Autenticação**: Verificação de token e sessão
3. **Captura**: Processamento da imagem da câmera
4. **Identificação**: Comparação com embeddings armazenados
5. **Registro**: Envio da marcação para o backend
6. **Sincronização**: Atualização do estado local

## 🚀 Configuração de Desenvolvimento

### 📋 Pré-requisitos
- Node.js >= 18
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)
- CocoaPods (para iOS)

### 💿 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd dorma/ponto-facial
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Para iOS, instale pods**
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

4. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
API_BASE_URL=http://localhost:3000
ENVIRONMENT=development
```

### 🏃‍♂️ Executando o Projeto

1. **Inicie o Metro bundler**
```bash
yarn start
```

2. **Execute no Android**
```bash
yarn android
```

3. **Execute no iOS**
```bash
yarn ios
```

### 🧹 Comandos Úteis
```bash
# Limpeza do cache
yarn start --reset-cache

# Limpeza do build Android
yarn clean:android

# Testes
yarn test

# Lint
yarn lint
```

## 📦 Build e Deploy

### 🏗️ Build de Produção

**Android:**
```bash
cd android
./gradlew assembleRelease
```

**iOS:**
```bash
# Através do Xcode ou
npx react-native run-ios --configuration Release
```

### 📱 Distribuição
- **Android**: APK/AAB através do Google Play Console ou distribuição direta
- **iOS**: IPA através do App Store Connect

## 🔧 Configurações

### 🎛️ Configurações do Aplicativo
- **Servidor**: Configuração do endpoint do backend
- **Timeouts**: Configuração de timeouts para requisições
- **Cache**: Configuração de cache de imagens e dados
- **Logs**: Configuração de níveis de log

### 🛠️ Desenvolvimento
- **Reactotron**: Ferramenta de debug disponível em modo desenvolvimento
- **Hot Reload**: Recarregamento automático durante desenvolvimento
- **TypeScript**: Tipagem estática para maior robustez

## 🧪 Testes

### 🧪 Estratégia de Testes
- **Unit Tests**: Testes unitários com Jest
- **Component Tests**: Testes de componentes React
- **Integration Tests**: Testes de integração com APIs
- **E2E Tests**: Testes end-to-end (planejado)

### 📊 Executar Testes
```bash
# Todos os testes
yarn test

# Testes em modo watch
yarn test:watch

# Coverage
yarn test:cov
```

## 🚨 Troubleshooting

### ❓ Problemas Comuns

**Metro bundler não inicia:**
```bash
yarn start --reset-cache
```

**Erro de build Android:**
```bash
cd android
./gradlew clean
cd ..
yarn android
```

**Problemas com pods (iOS):**
```bash
cd ios
bundle exec pod deintegrate
bundle exec pod install
cd ..
```

**Erro de permissões de câmera:**
- Verifique as permissões no `android/app/src/main/AndroidManifest.xml`
- Verifique as permissões no `ios/pontofacial/Info.plist`

## 📱 Plataforma Alvo

### 🎯 Dispositivos Suportados
- **Android**: Tablets com Android 7.0+ (API 24+)
- **iOS**: iPads com iOS 12.0+
- **Câmera**: Frontal ou traseira com autofoco
- **Processador**: Mínimo ARMv7 para processamento de ML

### 💾 Requisitos de Hardware
- **RAM**: Mínimo 3GB (recomendado 4GB+)
- **Armazenamento**: 500MB para o app + modelos ML
- **Conectividade**: WiFi ou dados móveis para sincronização

## 📄 Licença

Este projeto está sob licença proprietária. Todos os direitos reservados.

## 👥 Equipe

- **Desenvolvimento**: Equipe Fillet
- **Machine Learning**: Especialistas em reconhecimento facial
- **QA**: Equipe de qualidade

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o desenvolvimento, entre em contato com a equipe de desenvolvimento.
- Preencha os campos:

2. Tela principal
- Após o cadastro, você verá a tela principal com as opções:
  - Registrar marcação
  - Listar marcações
  - Configurações

3. Configurações