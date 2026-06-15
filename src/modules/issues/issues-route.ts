import { Router } from "express";
import { issueController } from "./issues-controller";
import auth from "../../middleware/auth";

const route = Router();

route.post("/", auth(), issueController.createIssue);
route.get("/", auth(), issueController.getAllIssues);
route.get("/:id", issueController.getSingleIssue);
route.patch("/:id", auth(), issueController.updateIssue);

export const issuesRoute = route;
