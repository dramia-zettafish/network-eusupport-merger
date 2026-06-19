import { handleRouteError, json, readJson } from '@/network-workbench/lib/apiResponse';
import { scheduleUpsInstallations } from '@/network-workbench/lib/upsRepository';

export async function POST(request) {
  try {
    const body = await readJson(request);
    const schedule = await scheduleUpsInstallations(body);
    return json(schedule);
  } catch (error) {
    return handleRouteError(error, 'Error generating UPS schedule');
  }
}
