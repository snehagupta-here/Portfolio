import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SkillInputRaw = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return {
      body: req.body,
      file: req.file as Express.Multer.File | undefined,
    };
  },
);