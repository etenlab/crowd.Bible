import { GraphFirstLayerService } from './graph-first-layer.service';
import { GraphSecondLayerService } from './graph-second-layer.service';

import { PropertyKeyConst, NodeTypeConst } from '@/constants/graph.constant';

import { UserDto } from '@/dtos/user.dto';

export class UserService {
  constructor(
    private readonly graphFirstLayerService: GraphFirstLayerService,
    private readonly graphSecondLayerService: GraphSecondLayerService,
  ) {}

  async createOrFindUser(email: string): Promise<UserDto> {
    const user = await this.getUser(email);

    if (user) {
      return user;
    }

    const newUser = await this.graphSecondLayerService.createNodeFromObject(
      NodeTypeConst.USER,
      {
        email,
      },
    );

    return {
      id: newUser.id,
      email,
    };
  }

  async getUser(email: string): Promise<UserDto | null> {
    const user = await this.graphFirstLayerService.getNodeByProp(
      NodeTypeConst.USER,
      {
        key: PropertyKeyConst.EMAIL,
        value: email,
      },
    );

    if (user == null) {
      return null;
    }

    return {
      id: user.id,
      email,
    };
  }
}
