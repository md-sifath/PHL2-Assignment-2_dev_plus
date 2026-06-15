export type IssueType = "bug" | "feature_request";
export type StatusType = "open" | "in_progress" | "resolved";
export type SortType = "newest" | "oldest";

export interface IIssue {
  title?: string;
  description?: string;
  type?: IssueType;
}

export interface IIssueQuery {
  sort?: SortType;
  type?: IssueType;
  status?: StatusType;
}
