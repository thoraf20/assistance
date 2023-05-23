import { Request, Response, NextFunction, Router } from 'express';
import httpStatus from 'http-status-codes';
import Controller from '../../interfaces/controller.interface';
import validationMiddleware from '../../middleware/validation.middleware';
import authMiddleware from '../../middleware/auth.middleware';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import DonorService from './donation.service';
import { CreateDonorDto } from './donor.dto';

class DonorController implements Controller {
  public path = '/donor';
  public router = Router();
  public donorService = new DonorService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware(), validationMiddleware(CreateDonorDto), this.verifyDonationWithCard);
    this.router.get(`${this.path}`, this.getAllAssistanceDonations);
  }

  private verifyDonationWithCard = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const donorData: CreateDonorDto = request.body;
    const userId = request.user.id
    try {
      const donation = await this.donorService.confirmDonationWithCard(donorData, userId);
      response.status(httpStatus.CREATED).send(donation);
    } catch (error) {
      next(error);
    }
  }

  private getAllAssistanceDonations = async (request: Request, response: Response, next: NextFunction) => {
    const assistanceId = request.query.assistance as any
    try {
      const donors = await this.donorService.getAllAssistanceDonations(assistanceId);
      response.status(httpStatus.OK).send(donors);
    } catch (error) {
      next(error);
    }
  }
}

export default DonorController;