import type { Request, Response } from "express";
import { issueService } from "./issues-service";
import type { JwtPayload } from "jsonwebtoken";
import type {
  IIssueQuery,
  SortType,
  StatusType,
  IssueType,
} from "./issues-interface";

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
    const queryParams: IIssueQuery = {
      sort: req.query.sort as SortType,
      status: req.query.status as StatusType,
      type: req.query.type as IssueType,
    };
    const result = await issueService.getAllIssuesFromDB(queryParams);
    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    const result = await issueService.getSingleIssueFromDB(issueId);

    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Issue Not Found!",
      Error: error.message,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);

    const result = await issueService.updateIssueIntoDB(
      req.body,
      issueId,
      req.user as JwtPayload,
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      succes: false,
      message: error.message,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const issueId = Number(req.params.id);
    const userRole = req.user?.role;
    await issueService.deleteIssueFromDB(issueId, userRole);

    res.status(200).json({
      suscces: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
