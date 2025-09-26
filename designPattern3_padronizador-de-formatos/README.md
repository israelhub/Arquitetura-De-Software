# Product Standardizer

Sistema de padronização de produtos de diferentes fornecedores usando design patterns em TypeScript.

## Descrição

Este projeto implementa um sistema que recebe arquivos de produtos de fornecedores em diferentes formatos (JSON, XML, CSV) e os padroniza para um formato único usando design patterns como boas práticas.

## Design Patterns Utilizados

- **Singleton** - `ConfigManager`: Gerencia configurações da aplicação
- **Factory Method** - `ProductProviderFactory`: Cria adapters baseado no formato
- **Adapter** - `JsonAdapter`, `CsvAdapter`, `XmlAdapter`: Converte diferentes formatos para Product
- **Builder** - `ProductBuilder`: Constrói objetos Product de forma flexível
- **Strategy** - `ProcessingStrategies`: Diferentes algoritmos de processamento

## Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Compilar o projeto
```bash
npm run build
```

### 3. Executar a aplicação
```bash
# Usando arquivo CSV
node dist/app.js --input data/produtos.csv --format=csv

# Usando arquivo JSON (formato detectado automaticamente)
node dist/app.js --input data/produtos.json

# Usando arquivo XML
node dist/app.js --input data/produtos.xml --format=xml
```

### 4. Exemplos disponíveis
O projeto inclui arquivos de exemplo na pasta `data/`:
- `produtos.json` - Formato JSON
- `produtos.csv` - Formato CSV
- `produtos.xml` - Formato XML

## Estrutura do Projeto

```
src/
├── models/          # Modelos de domínio
│   └── Product.ts
├── interfaces/      # Contratos e interfaces
│   └── IProductProvider.ts
├── adapters/        # Padrão Adapter
│   ├── JsonAdapter.ts
│   ├── CsvAdapter.ts
│   └── XmlAdapter.ts
├── factories/       # Padrão Factory Method
│   └── ProductProviderFactory.ts
├── builders/        # Padrão Builder
│   └── ProductBuilder.ts
├── strategies/      # Padrão Strategy
│   ├── ProcessingStrategies.ts
│   └── ProductProcessor.ts
├── config/          # Padrão Singleton
│   └── ConfigManager.ts
└── app.ts          # Aplicação principal
```

## Funcionalidades

- Suporte a múltiplos formatos (JSON, CSV, XML)
- Detecção automática de formato por extensão
- Validação de produtos
- Ordenação automática por nome
- Processamento flexível com estratégias
- Configuração centralizada
- Log detalhado do processamento

## Scripts Disponíveis

- `npm run build` - Compila o TypeScript
- `npm start` - Executa a aplicação compilada
- `npm run dev` - Executa em modo desenvolvimento

## Formato de Saída

Todos os produtos são padronizados para o formato:
```typescript
{
  id: string,
  name: string,
  price: number
}
```

## Exemplo de Uso

```bash
npm run build
node dist/app.js --input data/produtos.csv --format=csv
```

Saída esperada:
```json
[
  {
    "id": "1",
    "name": "Smartphone Samsung Galaxy",
    "price": 899.99
  },
  {
    "id": "2", 
    "name": "Notebook Dell Inspiron",
    "price": 2499.90
  }
]
```