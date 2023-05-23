import { Assistance } from "../../services/assistance/assistance.model";
import { Donor } from "./donor.model";
import { User } from "../../services/user/user.model";
import { CreateDonorDto } from "./donor.dto";
import PaymentGateway from "../../services/payment/payment.service";
import UnprocessableEntityException from "../../exceptions/UnableToverifyPayment";


class DonorService {
  public assistance = Assistance;
  public user = User
  public donor = Donor

  public async confirmDonationWithCard(donorData: CreateDonorDto, user_id: string) {
    const assistance = await this.assistance.findBy({ id: donorData.assistance_id })
    const user = await this.user.findBy({ id: user_id })

    const paystackResponse = await PaymentGateway.verifyPayment(
      donorData.reference,
    );

    if (!paystackResponse) {
      throw new UnprocessableEntityException('unable to verify payment');
    }

    const {
      domain,
      reference,
      amount,
      customer,
      authorization,
      gateway_response: response,
    } = paystackResponse;

    if (response.toLowerCase() !== 'successful') {
      throw new UnprocessableEntityException('payment is not successful');
    }

    await this.assistance.update(
      { id: donorData.assistance_id },
      { 
        donated_amount: assistance[0].donated_amount + amount,
      }
    )
    await this.donor.save({
      assistance_id: donorData.assistance_id,
      name: user[0].full_name,
      donated_amount: amount,
    })

    return {
      success: true,
      message: 'donation confirmed successfully'
    }
  }

  public async getAllAssistanceDonations(assistance_id: string) {
    const allAssistanceDonors = await this.donor.find({
      where: { id: assistance_id },
    })

    return {
      success: true,
      message: 'assistance donors fetched successfully',
      data: allAssistanceDonors
    }
  }
}

export default DonorService