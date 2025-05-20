import { Controller, Post, UseGuards,  Req, Res, UnauthorizedException, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserExistGuard } from './guards/user-exists.guard';
import { UserNotExistGuard } from './guards/user-not-exist.guard';
import { OwnerRoleGuard } from './guards/owner.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(UserExistGuard)
  @Post('email/register')
  async emailRegister(@Body() body:UserEmailRegisterDto){
    return this.authService.emailRegister(body)
  }
  @UseGuards(UserNotExistGuard)
  @Post('email/login')
    async emailLogin(@Body() body: UserEmailLoginDto){
    return this.authService.login(body)
  }

}
