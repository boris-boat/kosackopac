import { ICustomersState } from "./customerTypes";
import { IJobsState } from "./jobsTypes";
import { IInitialUserState } from "./userTypes";

export interface IReduxStoreRootState {
  userData: IInitialUserState;
  customersData: ICustomersState;
  jobsData: IJobsState;
}
