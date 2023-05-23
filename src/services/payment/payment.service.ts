import axios from 'axios'

type PaymentData = {
  amount: number
  email: string
  name: string
}
export default class PaymentGateway {
  static async initializePayment(data: PaymentData) {
    return axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      url: `${process.env.PAYSTACK_URL}/transaction/initialize`,
      data,
    })
      .then(({ data: { data } }) => {
        return data
      })
      .catch((error) => {
        return error
      })
  }

  static async verifyPayment(transactionReference: string) {
    return axios({
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      url: `${process.env.PAYSTACK_URL}/transaction/verify/${transactionReference}`,
    })
      .then(({ data: { data } }) => {
        return data
      })
      .catch((error) => {
        return error
      })
  }
}
