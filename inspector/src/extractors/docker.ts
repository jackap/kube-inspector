import Docker from "dockerode";
import { promisify } from "util";

const docker = promisify(Docker);
export const isDockerEnabled: () => Promise<boolean> = async () => {
  try {
    await docker().listImages();
    return true;
  } catch {
    return false;
  }
};
