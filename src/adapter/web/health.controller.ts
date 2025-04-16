import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MikroOrmHealthIndicator } from '@nestjs/terminus';

import { Public } from '../../framework/auth/decorator/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly db: MikroOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  async readiness() {
    return this.healthService.check([async () => this.db.pingCheck('database', { timeout: 500 })]);
  }
}
