import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService} from '@nestjs/terminus';

@Controller('health')
export class HealthControllerV1 {
  constructor(
    private health: HealthCheckService,
  ) { }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}