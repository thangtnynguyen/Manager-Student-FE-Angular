import { environment } from "../environments/environment";

export const app = {
    baseApiUrl: environment.baseApiUrl || '',
    apiUrl: environment.apiUrl || '',
};
