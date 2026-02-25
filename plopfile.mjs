export default function (plop) {
  plop.setHelper('render', function (text, options) {
    return plop.renderString(text, options.data.root);
  });

  plop.setGenerator('module', {
    description: 'Create a new module with CRUD operations',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (dash-case, e.g., user-profile):',
      },
    ],
    actions: [
      // Domain
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/domain/{{dashCase name}}.entity.ts',
        templateFile: 'plop-templates/domain-entity.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/domain/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: { exports: ['{{dashCase name}}.entity'] },
      },

      // Application Repositories
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/repositories/{{dashCase name}}.repository.ts',
        templateFile: 'plop-templates/repository-interface.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/repositories/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: { exports: ['{{dashCase name}}.repository'] },
      },
      // Factories
      {
        type: 'add',
        path: 'tests/factories/make-{{dashCase name}}.ts',
        templateFile: 'plop-templates/factory.hbs',
      },
      {
        type: 'modify',
        path: 'tests/factories/index.ts',
        pattern: /$/g,
        template: "\nexport * from './make-{{dashCase name}}';",
      },

      // Application Use Cases
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/create.usecase.ts',
        templateFile: 'plop-templates/use-cases/create.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/tests/create.usecase.spec.ts',
        templateFile: 'plop-templates/use-cases/create.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/delete.usecase.ts',
        templateFile: 'plop-templates/use-cases/delete.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/tests/delete.usecase.spec.ts',
        templateFile: 'plop-templates/use-cases/delete.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/get-by-id.usecase.ts',
        templateFile: 'plop-templates/use-cases/get-by-id.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/tests/get-by-id.usecase.spec.ts',
        templateFile: 'plop-templates/use-cases/get-by-id.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/list.usecase.ts',
        templateFile: 'plop-templates/use-cases/list.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/tests/list.usecase.spec.ts',
        templateFile: 'plop-templates/use-cases/list.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/update.usecase.ts',
        templateFile: 'plop-templates/use-cases/update.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/{{dashCase name}}/tests/update.usecase.spec.ts',
        templateFile: 'plop-templates/use-cases/update.spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/application/use-cases/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: {
          exports: [
            '{{dashCase name}}/create.usecase',
            '{{dashCase name}}/delete.usecase',
            '{{dashCase name}}/get-by-id.usecase',
            '{{dashCase name}}/list.usecase',
            '{{dashCase name}}/update.usecase',
          ],
        },
      },

      // Infra Controllers
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/create.controller.ts',
        templateFile: 'plop-templates/controllers/create.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/delete.controller.ts',
        templateFile: 'plop-templates/controllers/delete.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/get-by-id.controller.ts',
        templateFile: 'plop-templates/controllers/get-by-id.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/list.controller.ts',
        templateFile: 'plop-templates/controllers/list.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/update.controller.ts',
        templateFile: 'plop-templates/controllers/update.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/tests/create.controller.e2e-spec.ts',
        templateFile: 'plop-templates/controllers/tests/create.e2e-spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/tests/delete.controller.e2e-spec.ts',
        templateFile: 'plop-templates/controllers/tests/delete.e2e-spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/tests/get-by-id.controller.e2e-spec.ts',
        templateFile: 'plop-templates/controllers/tests/get-by-id.e2e-spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/tests/list.controller.e2e-spec.ts',
        templateFile: 'plop-templates/controllers/tests/list.e2e-spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/{{dashCase name}}/tests/update.controller.e2e-spec.ts',
        templateFile: 'plop-templates/controllers/tests/update.e2e-spec.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/controllers/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: {
          exports: [
            '{{dashCase name}}/create.controller',
            '{{dashCase name}}/delete.controller',
            '{{dashCase name}}/get-by-id.controller',
            '{{dashCase name}}/list.controller',
            '{{dashCase name}}/update.controller',
          ],
        },
      },

      // Infra DTOs
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/{{dashCase name}}/create.dto.ts',
        templateFile: 'plop-templates/dtos/create.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/{{dashCase name}}/delete.dto.ts',
        templateFile: 'plop-templates/dtos/delete.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/{{dashCase name}}/get-by-id.dto.ts',
        templateFile: 'plop-templates/dtos/get-by-id.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/{{dashCase name}}/list.dto.ts',
        templateFile: 'plop-templates/dtos/list.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/{{dashCase name}}/update.dto.ts',
        templateFile: 'plop-templates/dtos/update.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/dtos/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: {
          exports: [
            '{{dashCase name}}/create.dto',
            '{{dashCase name}}/delete.dto',
            '{{dashCase name}}/get-by-id.dto',
            '{{dashCase name}}/list.dto',
            '{{dashCase name}}/update.dto',
          ],
        },
      },

      // Infra Database
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/database/mappers/{{dashCase name}}.mapper.ts',
        templateFile: 'plop-templates/mapper.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/database/mappers/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: { exports: ['{{dashCase name}}.mapper'] },
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/database/repositories/{{dashCase name}}.repository.ts',
        templateFile: 'plop-templates/prisma-repository.hbs',
      },
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/infra/database/repositories/index.ts',
        templateFile: 'plop-templates/barrel-index.hbs',
        data: { exports: ['{{dashCase name}}.repository'] },
      },

      // Module
      {
        type: 'add',
        path: 'src/modules/{{dashCase name}}/{{dashCase name}}.module.ts',
        templateFile: 'plop-templates/module.hbs',
      },

      // Register Module in app.module.ts
      {
        type: 'modify',
        path: 'src/app.module.ts',
        pattern:
          /(import { UsersModule } from '.\/modules\/users\/users.module';)/g,
        template:
          "$1\nimport { {{pascalCase name}}Module } from './modules/{{dashCase name}}/{{dashCase name}}.module';",
      },
      {
        type: 'modify',
        path: 'src/app.module.ts',
        pattern: /(UsersModule,)/g,
        template: '$1\n    {{pascalCase name}}Module,',
      },

      // Register Swagger Constants
      {
        type: 'modify',
        path: 'src/shared/libs/nest/config/swagger-constants.ts',
        pattern: /(USERS = 'Users',)/g,
        template: "$1\n  {{constantCase name}} = '{{pascalCase name}}',",
      },
      {
        type: 'modify',
        path: 'src/shared/libs/nest/config/swagger-constants.ts',
        pattern: /(USERS = `\/users`,)/g,
        template: '$1\n  {{constantCase name}} = `/{{dashCase name}}`,',
      },
    ],
  });
}
