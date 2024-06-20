export interface IJobsState {
  jobs: IJob[];
  data: {
    focusedJob: IJob;
  };
  filter: string;
}

export interface IJob {
  id: string;
  registeredUser_id: string;
  customer_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  scheduledDate: string;
  customers: string | null;
}
