type IssueType = "bug" | "feature_request";

export interface IIssue {
  title?: string;
  description?: string;
  type?: IssueType;
}
