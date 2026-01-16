# HServices

Um framework leve para criação de microserviços em TypeScript, com suporte a eventos e decorators.

## 📋 Características

- **Arquitetura baseada em serviços** - Crie serviços modulares e independentes
- **Sistema de eventos** - Comunicação entre serviços através de eventos
- **Decorators** - Configuração declarativa de serviços e handlers de eventos
- **Auto-discovery** - Carregamento automático de serviços por padrão de arquivos
- **Cron Jobs** - Suporte integrado para tarefas agendadas
- **Logger colorido** - Logs formatados com cores para melhor visualização
- **Graceful shutdown** - Encerramento seguro de todos os serviços

## 🚀 Instalação

```bash
npm install
```

## 📦 Dependências Principais

- `reflect-metadata` - Suporte a decorators e metadados
- `cron` - Agendamento de tarefas
- `commander` - Parser de argumentos CLI
- `kleur` - Colorização de logs
- `glob` - Pattern matching para descoberta de arquivos

## 🏃 Executando

```bash
# Modo desenvolvimento
npm run dev

# Com máscara personalizada para arquivos de serviço
npm run dev -- -m "**/*.service.ts"
```

### Opções CLI

| Opção               | Descrição                                                                  |
| ------------------- | -------------------------------------------------------------------------- |
| `-d, --debug`       | Ativa logs de debug                                                        |
| `-m, --mask <mask>` | Padrão glob para localizar arquivos de serviço (padrão: `**/*.service.ts`) |

## 📖 Uso

### Criando um Serviço

```typescript
import Broker from '../src/broker';
import { Event, ServiceDecorator } from '../src/decorators';
import Service from '../src/service';

@ServiceDecorator({
  name: 'user',
  group: 'user',
})
export default class UserService extends Service {
  constructor(broker: Broker) {
    super(broker);
  }

  // Handler de evento
  @Event({ name: 'user.created', group: 'user' })
  handleUserCreated(payload: any) {
    console.log('Usuário criado:', payload);
  }

  // Lifecycle hook - executado quando o serviço inicia
  async onStarted(): Promise<void> {
    this.logger.info('UserService', 'Serviço iniciado!');
  }

  // Lifecycle hook - executado quando o serviço para
  async onStopped(): Promise<void> {
    this.logger.info('UserService', 'Serviço parado!');
  }
}
```

### Usando Cron Jobs

```typescript
import { CronJob } from 'cron';
import Broker from '../src/broker';
import { ServiceDecorator } from '../src/decorators';
import Service from '../src/service';

@ServiceDecorator({
  name: 'scheduler',
  group: 'jobs',
})
export default class SchedulerService extends Service {
  constructor(broker: Broker) {
    super(broker);
  }

  async onStarted(): Promise<void> {
    // Executa a cada 10 segundos
    new CronJob('*/10 * * * * *', async () => {
      this.broker.emit('task.scheduled', { timestamp: new Date() });
    }).start();
  }
}
```

### Emitindo Eventos

```typescript
// Dentro de um serviço
this.broker.emit('evento.nome', { dados: 'payload' });
```

## 🏗️ Arquitetura

```
HServices/
├── src/
│   ├── broker.ts       # Gerenciador central de serviços e eventos
│   ├── decorators.ts   # Decorators @ServiceDecorator e @Event
│   ├── logger.ts       # Sistema de logs coloridos
│   ├── runner.ts       # CLI e inicialização
│   ├── service.ts      # Classe base para serviços
│   └── interfaces/
│       └── IEventOptions.ts
├── dev/                # Serviços de exemplo/desenvolvimento
│   ├── teste.service.ts
│   └── user.service.ts
├── package.json
└── tsconfig.json
```

## 🔧 Componentes

### Broker

O `Broker` é o núcleo do framework, responsável por:

- Registrar e gerenciar serviços
- Roteamento de eventos entre serviços
- Descoberta automática de arquivos de serviço
- Gerenciamento do ciclo de vida dos serviços

### Service

Classe base abstrata que todos os serviços devem estender. Fornece:

- Acesso ao `broker` para emitir eventos
- Acesso ao `logger` para logs
- Hooks de lifecycle (`onStarted`, `onStopped`)

### Decorators

- `@ServiceDecorator({ name, group })` - Define metadados do serviço
- `@Event({ name, group })` - Marca um método como handler de evento
