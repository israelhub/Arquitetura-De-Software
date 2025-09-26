# Desafio Design Pattern 2 - Sistema de Currículos

Este projeto implementa um sistema para criação e gerenciamento de currículos utilizando **TypeScript** e diversos padrões de design.

## Funcionalidades

- **Interface CLI interativa** para criação de currículos passo a passo
- **Múltiplos formatos de salvamento** (texto, JSON)
- **Validação robusta** de dados
- **Arquitetura extensível** com padrões de design

## Padrões de Design Implementados

### 1. **Builder Pattern**
- **Localização**: `src/builders/resumeBuilder.ts`
- **Propósito**: Construção fluente e validada de currículos
- **Exemplo de uso**:
```typescript
const resume = new ResumeBuilder()
  .withName("Diego Castro")
  .withContact("diego.castro@cefet-rj.br")
  .addExperience("Professor", "CEFET", "2015-2024")
  .addEducation("Doutorado em Computação", "UFRJ", "2019-2023")
  .build();
```

### 2. **Strategy Pattern**
- **Localização**: `src/strategies/savers/`
- **Propósito**: Diferentes estratégias de salvamento de currículos
- **Strategies implementadas**:
  - `LocalJsonSaver`: Salva em arquivo JSON local
  - `LocalTextSaver`: Salva em arquivo de texto local
  - `CompositeSaver`: Combina múltiplas strategies

### 3. **Factory Method**
- **Localização**: `src/factories/saverFactory.ts`
- **Propósito**: Criação centralizada e padronizada de savers
- **Exemplo**:
```typescript
const jsonSaver = SaverFactory.createLocalJsonSaver();
const textSaver = SaverFactory.createLocalTextSaver();
const compositeSaver = SaverFactory.createLocalCompositeSaver();
```

### 4. **Singleton-like (Config)**
- **Localização**: `src/config/config.ts`
- **Propósito**: Configurações centralizadas da aplicação

## Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Compilar o projeto
npm run build
```

### Executando a CLI
```bash
# CLI em produção
npm start

# CLI em desenvolvimento
npm run dev
```

## Estrutura do Projeto

```
src/
├── builders/           # Builder Pattern
│   └── resumeBuilder.ts
├── cli/               # Interface CLI
│   └── index.ts
├── config/            # Configurações (Singleton-like)
│   └── config.ts
├── factories/         # Factory Method
│   └── saverFactory.ts
├── models/            # Modelos de dados
│   └── resume.ts
└── strategies/        # Strategy Pattern
    └── savers/
        ├── types.ts
        ├── localJsonSaver.ts
        ├── localTextSaver.ts
        └── compositeSaver.ts
```

## Exemplo de Uso Completo

### 1. Usar a CLI
```bash
npm start
```

### 2. Exemplo de currículo criado
A CLI guiará você através do processo:
1. Informações básicas (nome e contato)
2. Experiências profissionais (múltiplas)
3. Formação acadêmica (múltiplas)
4. Opções de salvamento (texto e/ou JSON)

### 3. Resultado
O sistema criará arquivos como:
- `resumes/joao_silva_2024-03-15T10-30-00.txt`
- `resumes/joao_silva_2024-03-15T10-30-00.json`

## Arquitetura e Design

### Princípios Aplicados
- **Single Responsibility**: Cada classe tem uma responsabilidade específica
- **Open/Closed**: Extensível para novos tipos de savers sem modificar código existente
- **Dependency Inversion**: CLI depende de abstrações, não implementações
- **Interface Segregation**: Interfaces específicas para cada funcionalidade

### Extensibilidade
Para adicionar um novo formato de salvamento:
1. Implementar interface `ResumeSaver`
2. Adicionar tipo em `SaverType` enum
3. Atualizar `SaverFactory`
4. Funcionalidade estará disponível automaticamente na CLI

## Scripts Disponíveis

```bash
npm run build        # Compila TypeScript
npm start           # Executa CLI (compilado)
npm run dev         # Executa CLI (desenvolvimento)
```

## Tecnologias Utilizadas

- **TypeScript**: Linguagem principal
- **Node.js**: Runtime
- **Inquirer**: Interface CLI interativa

## Características Técnicas

- Tipagem forte com TypeScript
- Validação robusta em todas as camadas
- Error handling apropriado
- Logging estruturado
- Configuração centralizada
- Arquitetura limpa e extensível
- Testes de compilação passando
- Documentação completa

---

## Desenvolvido para o Desafio Design Pattern 2
**CEFET-RJ - Arquitetura de Software**