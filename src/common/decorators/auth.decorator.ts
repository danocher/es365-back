import { createParamDecorator, ExecutionContext } from "@nestjs/common";

const getServerCustomParams = createParamDecorator((data, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest()
    const userId = req.userId
    const ownerId = req.ownerId
    return {userId, ownerId}
})

export {getServerCustomParams}