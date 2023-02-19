import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { OrderStatusDto } from "src/dtos/order/order.dto";
import { AllowToRoles } from "src/msci/allow.to.roles.descriptor";
import { ApiResponse } from "src/msci/api.response.class";
import { RoleCheckedGuard } from "src/msci/role.check.guards";
import { Order } from "src/output/entities/order.entity";
import { OrderService } from "src/services/order/order.service";


@Controller('api/adminOrder')
export class AdministratorOrderController {

    constructor(private orderService: OrderService)
    { }

    // GET http://localhost:3000/api/adminOrder/:id
    @Get(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    async getSpecOrder(@Param('id') orderId: number): Promise<Order | ApiResponse> {
        const searchedOrder = await this.orderService.getById(orderId);

        if (!searchedOrder)
            return new ApiResponse('error', -9001, 'The such order is not found!');
        return searchedOrder;
    }

    // PATCH http://localhost:3000/api/adminOrder/:id
    @Patch(':id')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    async cahngeStatus(@Param('id') orderId: number, @Body() data: OrderStatusDto): Promise<Order | ApiResponse> {
        
        return await this.orderService.cahngeStatus(orderId, data);
    }

}