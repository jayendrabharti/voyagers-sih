import { Router } from "express";
import {
  createInstitution,
  getAllInstitutions,
  getInstitutionById,
  updateInstitution,
  deleteInstitution,
  getInstitutionStatistics,
  getInstitutionStudents,
  getInstitutionTeachers,
  getInstitutionClasses,
} from "../controllers/institutions.controllers.js";
// import { validToken } from '../middlewares/validToken.js'; // Uncomment when ready to add auth

const router = Router();

/**
 * Institution Routes
 * All endpoints for managing institutions
 */

// Basic CRUD operations
router.post("/", createInstitution);
router.get("/", getAllInstitutions);
router.get("/:id", getInstitutionById);
router.put("/:id", updateInstitution);
router.delete("/:id", deleteInstitution);

// Institution-specific data
router.get("/:id/statistics", getInstitutionStatistics);
router.get("/:id/students", getInstitutionStudents);
router.get("/:id/teachers", getInstitutionTeachers);
router.get("/:id/classes", getInstitutionClasses);

export default router;
