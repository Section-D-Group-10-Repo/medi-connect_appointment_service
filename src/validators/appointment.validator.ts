import { APPOINTMENT_STATUS } from "@prisma/client";
import * as z from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string({ message: "Patient ID must be a string." }).min(1, {
    message: "Patient ID is required.",
  }),

  doctorId: z.string({ message: "Doctor ID must be a string." }).min(1, {
    message: "Doctor ID is required.",
  }),
  startDate: z.coerce.date({ message: "Start date isn't a valid date." }),
  duration: z.number({ message: "Duration must be a number" }).positive({
    message: "Duration must be a positive integer.",
  }),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(
    [
      APPOINTMENT_STATUS.PENDING,
      APPOINTMENT_STATUS.CANCELED,
      APPOINTMENT_STATUS.CONFIRMED,
      APPOINTMENT_STATUS.COMPLETED,
    ],
    { message: "Invalid appointment status." }
  ),
});

export const patientSatisfactionSchema = z.object({
  patientComment: z
    .string({ message: "Patient comment must be a string." })
    .max(500, { message: "Patient comment cannot exceed 500 characters." })
    .optional(),

  patientSatisfaction: z
    .number({ message: "Patient satisfaction must be a number." })
    .int({ message: "Patient satisfaction must be an integer." })
    .min(1, { message: "Patient satisfaction must be between 1 and 10." })
    .max(10, { message: "Patient satisfaction must be between 1 and 10." })
    .optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
