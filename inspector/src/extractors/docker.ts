import {promisify} from "util";
import Docker from "dockerode"

const docker = promisify(Docker);
export const isDockerEnabled : () => Promise<boolean> = async () => {
        try {
                await docker().listImages();
                return true
        }
        catch {
                return false
        }
        finally {
                return false
        }

}