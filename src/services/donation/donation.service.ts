import { Assistance } from "../../services/assistance/assistance.model";
import { Donor } from "./donor.model";
import { User } from "../../services/user/user.model";
import { CreateDonorDto, GetDonorsDto } from "./donor.dto";
import PaymentGateway from "../../services/payment/payment.service";
import UnprocessableEntityException from "../../exceptions/UnableToverifyPayment";


class DonorService {
  public assistance = Assistance;
  public user = User
  public donor = Donor

  public async confirmDonationWithCard(donorData: CreateDonorDto, user_id: string) {
    const assistance = await this.assistance.findOne({ 
      where: { id: donorData.assistance_id }
    })
    const user = await this.user.findOne({ 
      where: { id: user_id } 
    })

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
        donated_amount: assistance.donated_amount + amount,
      }
    )
    await this.donor.save({
      assistance_id: donorData.assistance_id,
      name: user.full_name,
      donated_amount: amount,
    })

    return {
      success: true,
      message: 'donation confirmed successfully'
    }
  }

  public async getAllAssistanceDonations(
    assistance_id: string,
    data: GetDonorsDto
    ) {

    if (data.topDonors && data.topDonors === true) {
      const topDonations = await this.donor.find({
        where: { id: assistance_id },
        order: {
          donated_amount: 'DESC',
          created_at: 'DESC'
        }
      })
  
      return {
        success: true,
        message: 'assistance top donors fetched successfully',
        data: topDonations
      } 
    }

    const allAssistanceDonors = await this.donor.findAndCount({
      where: { id: assistance_id },
      order: {
        created_at: 'DESC'
      },
      skip: (data.page - 1) * data.page,
      take: data.per_page
    })

    return {
      success: true,
      message: 'assistance donors fetched successfully',
      data: allAssistanceDonors,
      totalCount: allAssistanceDonors[1],
      recentDonation: allAssistanceDonors[0][0],
      topDonation: allAssistanceDonors,
      firstDonation: allAssistanceDonors[0][-1]
    }
  }
}

export default DonorService