import { Router } from "express";
import { issueController } from "./issues-controller";
import auth from "../../middleware/create-issues";

const route = Router();

route.post("/", auth(), issueController.createIssue);

route.get("/", auth(), issueController.getAllIssues);

export const issuesRoute = route;
