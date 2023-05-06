import UserNotFoundException from "../../exceptions/UserNotFoundException";
import { User } from "./user.model";


class UserService {
  public user = User;

  public async fetchAll() {
    const users = await this.user.find()

    if (users.length) {
      return {
        success: true,
        message: 'users fetched successfully',
        data: users
      }
    } else {
      throw new UserNotFoundException();
    }
  }

  public async fetchOne(id: string) {
    const user = await this.user.findOne({
      where: { id }
    })

    if (user) {
      return {
        success: true,
        message: 'user fetched successfully',
        data: user
      }
    } else {
      throw new UserNotFoundException(`User with id ${id} not found`);
    }
  }
}

export default UserService;