import type { IIssue } from "./issues-interface";
import { pool } from "../../db";

const createIssueIntoDB = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
        INSERT INTO issues(title,description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *`,
    [title, description, type, reporterId],
  );
  return result.rows[0];
};

const getIssuesFromDB = async () => {};

const getSingleIssueFromDB = async (issueId: number) => {
  const issueResult = await pool.query(
    `
        SELECT * FROM issues WHERE id = $1
        `,
    [issueId],
  );

  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue Not Found");
  }

  const reporterResult = await pool.query(
    `
    SELECT id,name,role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterResult.rows[0] ?? null,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

export const issueService = {
  createIssueIntoDB,
  getIssuesFromDB,
  getSingleIssueFromDB,
};
