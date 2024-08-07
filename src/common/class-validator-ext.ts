import { ValidationOptions, registerDecorator } from 'class-validator';

export function Id(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'id',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value >= 1;
        },
      },
    });
  };
}
