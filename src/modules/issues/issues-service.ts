import type { IIssue, IIssueQuery } from "./issues-interface";
import { pool } from "../../db";
import type { JwtPayload } from "jsonwebtoken";

//create issue
const createIssueIntoDB = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `
        INSERT INTO issues(title,description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *`,
    [title, description, type, reporterId],
  );
  return result.rows[0];
};

//get all issue
const getAllIssuesFromDB = async (queryParams: IIssueQuery) => {
  const { sort = "newest", type, status } = queryParams;

  let query = `SELECT * FROM issues WHERE 1=1`;

  const values: string[] = [];

  if (type) {
    values.push(type);
    query += ` AND type = $${values.length}`;
  }
  if (status) {
    values.push(status);
    query += ` AND status =$${values.length}`;
  }
  query +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issueResult = await pool.query(query, values);

  const reporterIds: number[] = [
    ...new Set(issueResult.rows.map((issue) => Number(issue.reporter_id))),
  ];
  if (reporterIds.length === 0) {
    return [];
  }

  const userResult = await pool.query(
    `
    SELECT id, name,role FROM users WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userMap = new Map();
  userResult.rows.forEach((user) => {
    userMap.set(user.id, user);
  });

  const getIssue = issueResult.rows.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userMap.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return getIssue;
};

//get single issue
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

//update issue
const updateIssueIntoDB = async (
  payload: IIssue,
  issueId: number,
  user: JwtPayload,
) => {
  const { title, type, description } = payload;
  const issueResult = await pool.query(
    `
        SELECT * FROM issues WHERE id =$1
        `,
    [issueId],
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("No Issue Found!");
  }

  // authorization
  if (user.role === "contributor") {
    const isOwn = issue.reporter_id === user.id;
    const isOpen = issue.status === "open";

    if (!isOwn || !isOpen) {
      throw new Error("Forbidden!");
    }
  }

  const status = "in_progress";

  //update
  const updateResult = await pool.query(
    `
    UPDATE issues
    SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = $4,
        updated_at = NOW()
        WHERE id = $5
        RETURNING *
    `,
    [title, description, type, status, issueId],
  );
  return updateResult.rows[0];
};

//delete issue
const deleteIssueFromDB = async (issueId: number, userRole: string) => {
  if (userRole === "contributor") {
    throw new Error("Forbidden!");
  }

  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id = $1
    `,
    [issueId],
  );

  if (!issueResult.rows[0]) {
    throw new Error("No Issue Found");
  }

  await pool.query(
    `
        DELETE FROM issues WHERE id = $1
        `,
    [issueId],
  );
  return true;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
