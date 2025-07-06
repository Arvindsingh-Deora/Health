import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-medication-tablet.ts';
import '@/ai/flows/decide-additional-info.ts';
import '@/ai/flows/analyze-skin-condition.ts';