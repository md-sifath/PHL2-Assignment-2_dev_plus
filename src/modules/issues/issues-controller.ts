import type { Request, Response } from "express";
import { issueService } from "./issues-service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req.user?.id;

    const result = await issueService.createIssueIntoDB(req.body, reporterId);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server Error",
      Error: error.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getIssuesFromDB();
  } catch (error: any) {
    message: error.message;
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
};
