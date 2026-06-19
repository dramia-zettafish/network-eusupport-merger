import { handleRouteError, json, readJson } from '@/network-workbench/lib/apiResponse';
import { updateUpsInstallation } from '@/network-workbench/lib/upsRepository';

const allowedFields = ['ups_po', 'bp_po', 'approved_install_date'];

export async function PATCH(request, { params }) {
  try {
    const { ups_installation_id: upsInstallationId } = await params;
    const body = await readJson(request);
    const install = await updateUpsInstallation(Number.parseInt(upsInstallationId, 10), body, allowedFields);
    return json(install);
  } catch (error) {
    return handleRouteError(error, 'Error updating UPS phase 3 warehouse');
  }
}
