import { Router } from "express";
import {
  getAppointmentsController,
  getAppointmentsByPatientIDController,
  getAppointmentsByDoctorIDController,
  getAppointmentByIDController,
  createAppointmentController,
  updateAppointmentStatusByIDController,
  patientSatisfactionByIDController,
  deleteAppointmentByIDController,
  getAppointmentsOfPatientController,
  getAppointmentsOfDoctorController,
} from "../controllers/appointment.controller";
import middleware from "../middleware";
import { Role } from "../types";

const router = Router();

// General routes
router.get(
  "/",
  middleware.auth.roleAuthenticationMiddleware([Role.ADMIN]),
  getAppointmentsController
);

// Patient-specific routes
router.get(
  "/patients/:id",
  middleware.auth.roleAuthenticationMiddleware([Role.ADMIN, Role.PATIENT]),
  getAppointmentsByPatientIDController
); // id => patientID

router.get(
  "/patients",
  middleware.auth.roleAuthenticationMiddleware([Role.PATIENT]),
  getAppointmentsOfPatientController
);

router.post(
  "/patients",
  middleware.auth.roleAuthenticationMiddleware([Role.PATIENT]),
  createAppointmentController
);
router.patch(
  "/patients/:id/satisfactions",
  middleware.auth.roleAuthenticationMiddleware([Role.PATIENT]),
  patientSatisfactionByIDController
); // id => appointmentID

router.get(
  "/doctors/:id",
  middleware.auth.roleAuthenticationMiddleware([Role.ADMIN, Role.DOCTOR]),
  getAppointmentsByDoctorIDController
); // id => doctorID

router.get(
  // Doctor-specific routes
  "/doctors",
  middleware.auth.roleAuthenticationMiddleware([Role.DOCTOR]),
  getAppointmentsOfDoctorController
); // id => doctorID

// Update appointment status (accessible to doctor and admin)
router.patch(
  "/:id/status",
  middleware.auth.roleAuthenticationMiddleware([Role.DOCTOR]),
  updateAppointmentStatusByIDController
);

router.get("/:id", getAppointmentByIDController);

router.delete(
  "/:id",
  middleware.auth.roleAuthenticationMiddleware([Role.DOCTOR]),
  deleteAppointmentByIDController
);

export default router;
