import { Router } from "express";
import {
  getContact,
  addContact,
  updateContact,
  deleteContact,
} from "./controller";

const router: Router = Router();

router.get("/contact", getContact);

router.post("/add-contact", addContact);

router.put("/edit-contact", updateContact);

router.delete("/delete-contact", deleteContact);

export default router;
