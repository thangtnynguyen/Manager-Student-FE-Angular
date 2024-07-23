import { environment } from 'src/environments/environment';

const systemConfig = {
    baseUrl : environment.host.baseUrl ?? "",
    baseFileSystemUrl: environment.host.baseFileSystemUrl ?? "",
};

export default systemConfig;
