import { APPOINTMENT_STATUS } from "@prisma/client";
import { zodErrorFmt } from "../libs";
import { db } from "../model";
import { getUserInfo } from "../services/auth";
import { Role } from "../types";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";

import { appointmentValidator, queryParamIDValidator } from "../validators";
import { constants } from "node:fs/promises";

export const getAppointmentsController = asyncWrapper(async (req, res) => {
  const appointments = await db.appointment.findMany();

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "All appointments",
    result: appointments,
  });
});

export const getAppointmentsByPatientIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator(
      "Please provide valid patient ID."
    ).safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const appointments = await db.appointment.findMany({
      where: {
        patientId: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Patient's appointments",
      result: appointments,
    });
  }
);

export const getAppointmentsOfPatientController = asyncWrapper(
  async (req, res) => {
    const patient = req.user;

    console.log({patient})

    const appointments = await db.appointment.findMany({
      where: {
        patientId: patient?.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Patient's appointments",
      result: appointments,
    });
  }
);

// ! For doctor only
export const getAppointmentsByDoctorIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator(
      "Please provide valid patient ID."
    ).safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Doctor's appointments",
      result: appointments,
    });
  }
);

export const getAppointmentsOfDoctorController = asyncWrapper(
  async (req, res) => {
    const doctor = req.user;

    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctor?.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Doctor's appointments",
      result: appointments,
    });
  }
);

export const getAppointmentByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator().safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const appointment = await db.appointment.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!appointment) throw RouteError.NotFound("Appointment not found.");

  return sendApiResponse({
    res,
    statusCode: 200,
    success: true,
    message: "Appointment found",
    result: appointment,
  });
});

// ! For patient only
export const createAppointmentController = asyncWrapper(async (req, res) => {
  const bodyValidation = appointmentValidator.createAppointmentSchema.safeParse(
    req.body
  );

  const patient = req.user;
  console.log({ patient });

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const data = await getUserInfo(bodyValidation.data.doctorId);
  console.log({ data });
  if (!data.success || data.result.role !== Role.DOCTOR)
    throw RouteError.NotFound("Doctor not found with the provided doctor ID.");

  const appointment = await db.appointment.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: 201,
    success: true,
    message: "Appointment created successfully.",
    result: appointment,
  });
});

// ! For doctor and admin only
export const updateAppointmentStatusByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const bodyValidation =
      appointmentValidator.updateAppointmentStatusSchema.safeParse(req.body);

    if (!bodyValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(bodyValidation.error)[0].message,
        zodErrorFmt(bodyValidation.error)
      );

    const existingAppointment = await db.appointment.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    if (!existingAppointment)
      throw RouteError.NotFound("Appointment not found.");

    const updatedAppointment = await db.appointment.update({
      where: {
        id: queryParamValidation.data.id,
      },
      data: {
        status: bodyValidation.data.status,
      },
    });

    if (!updatedAppointment)
      throw RouteError.NotFound("Appointment not found.");

    return sendApiResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Appointment status updated successfully.",
      result: updatedAppointment,
    });
  }
);

// ! For patient only
export const patientSatisfactionByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const bodyValidation =
      appointmentValidator.patientSatisfactionSchema.safeParse(req.body);

    if (!bodyValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(bodyValidation.error)[0].message,
        zodErrorFmt(bodyValidation.error)
      );

    const existingAppointment = await db.appointment.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    if (!existingAppointment)
      throw RouteError.NotFound("Appointment not found.");

    if (existingAppointment.status !== APPOINTMENT_STATUS.COMPLETED)
      throw RouteError.BadRequest(
        "Cannot update satisfaction for an appointment in progress."
      );

    const updatedAppointment = await db.appointment.update({
      where: {
        id: queryParamValidation.data.id,
      },
      data: {
        patientSatisfaction: bodyValidation.data.patientSatisfaction,
        patientComment: bodyValidation.data.patientComment,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 201,
      success: true,
      message: "Appointment updated successfully.",
      result: updatedAppointment,
    });
  }
);

export const deleteAppointmentByIDController = asyncWrapper(
  async (req, res) => {
    const queryParamValidation = queryParamIDValidator().safeParse(req.params);

    if (!queryParamValidation.success)
      throw RouteError.BadRequest(
        zodErrorFmt(queryParamValidation.error)[0].message,
        zodErrorFmt(queryParamValidation.error)
      );

    const existingAppointment = await db.appointment.findUnique({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    if (!existingAppointment)
      throw RouteError.NotFound("Appointment not found.");

    await db.appointment.delete({
      where: {
        id: queryParamValidation.data.id,
      },
    });

    return sendApiResponse({
      res,
      statusCode: 204,
      success: true,
      message: "Appointment deleted successfully.",
      result: null,
    });
  }
);
