import { User } from "../../services/user/user.model";
import { CreateAssistanceDto } from "./assistance.dto";
import { Assistance } from "./assistance.model";
import { cloudinary } from "../../config/cloudinary.config";
import { generateRandomAlphaNumeric } from "../../utils/type";
import UserNotFoundException from "../../exceptions/UserNotFoundException";
import AssistanceNotFoundException from "../../exceptions/AssistanceNotFoundException";
import { Donor } from "../donation/donor.model";

class AssistanceService {
  public assistance = Assistance;
  public user = User
  public donor = Donor

  public async create(assistanceData: CreateAssistanceDto) {
    const userExist = await this.user.findOne({
      where: { id: assistanceData.user_id }
    })

    const assistanceExist = await this.assistance.findOne({
      where: { user_id: assistanceData.user_id, title: assistanceData.title }
    })

    const response = await cloudinary.v2.uploader.upload(assistanceData.imgUrl, { public_id: generateRandomAlphaNumeric(8), resource_type: 'raw' })

    if (userExist) {
      await this.assistance.save({
        ...assistanceData,
        beneficiary: assistanceData.beneficiary ? assistanceData.beneficiary : userExist.full_name,
        imgUrl: response.secure_url,
      })

      return {
        success: true,
        message: 'assistance created successfully'
      }
    } else {
      throw new UserNotFoundException(assistanceData.user_id);
    }
  }
  public async getAll() {
    const allAssistances = await this.assistance.find({})

    if (allAssistances.length >= 1) {
      return {
        success: true,
        message: 'assistances fetched successfully',
        data: allAssistances
      }
    } else {
      throw new AssistanceNotFoundException()
    }
  }
  public async getAllUserAssistance(user_id: string) {
    const allAssistances = await this.assistance.find({
      where: { user_id: user_id },
      relations: {
        user: true,
        donor: true
      },
    })

    if (allAssistances.length >= 1) {
      return {
        success: true,
        message: 'assistances fetched successfully',
        data: allAssistances
      }
    } else {
      throw new AssistanceNotFoundException()
    }
  }
  public async getOneById(id: string) {
    const allAssistances = await this.assistance.findOne({
      where: { id },
      relations: {
        user: true,
        donor: true
      },
    })

    if (allAssistances) {
      return {
        success: true,
        message: 'assistances fetched successfully',
        data: allAssistances
      }
    } else {
      return {
        success: true,
        message: `no assistance for the category with id ${id}`,
      }   
    }
  }
  public async getAllByCategory(category_id: string) {
    const allAssistances = await this.assistance.find({
      where: { category_id: category_id },
    })

    if (allAssistances.length >= 1) {
      return {
        success: true,
        message: 'assistances fetched successfully',
        data: allAssistances
      }
    } else {
      return {
        success: true,
        message: `no assistance for the category with id ${category_id}`,
        data: []
      }    
    }
  }
}

export default AssistanceService;