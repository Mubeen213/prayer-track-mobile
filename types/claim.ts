export interface CreateClaimRequest {
  name: string;
  phone_number: string;
  mosque_id: string;
  message?: string;
}

export interface ClaimRequest {
  id: string;
  name: string;
  phone_number: string;
  user_id: string;
  mosque_id: string;
  message?: string;
  status: "pending" | "in_review" | "approved" | "rejected" | "withdrawn";
  reviewed_by?: string;
  reviewed_at?: string;
  review_comment?: string;
  created_at: string;
  updated_at: string;
  mosque_name?: string;
  mosque_address?: string;
  user_name?: string;
  reviewer_name?: string;
}

export interface ClaimRequestsResponse {
  claims: ClaimRequest[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
