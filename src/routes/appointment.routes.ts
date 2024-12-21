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
} from "../controllers/appointment.controller";

const router = Router();

// General routes
router.get("/", getAppointmentsController);
router.get("/:id", getAppointmentByIDController);

// Patient-specific routes
router.get("/patient/:id", getAppointmentsByPatientIDController); // id => patientID
router.post("/patient", createAppointmentController);
router.patch("/patient/:id/satisfaction", patientSatisfactionByIDController); // id => appointmentID

// Doctor-specific routes
router.get("/doctor/:id", getAppointmentsByDoctorIDController); // id => doctorID

// Update appointment status (accessible to doctor and admin)
router.patch("/:id/status", updateAppointmentStatusByIDController);

// Delete appointment (accessible to admin)
router.delete("/:id", deleteAppointmentByIDController);

export default router;
