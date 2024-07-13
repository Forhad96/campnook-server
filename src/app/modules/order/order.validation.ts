import { z } from 'zod';
import { PaymentMethods } from './order.constant';
const zCheckoutSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters long.' }),
  address: z
    .string()
    .min(10, { message: 'Address must be at least 10 characters long.' }),
  paymentMethod: z.enum(PaymentMethods),
});

export default zCheckoutSchema;
