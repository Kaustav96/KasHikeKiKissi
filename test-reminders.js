/**
 * Manual Reminder Test Script
 *
 * Usage: node test-reminders.js
 *
 * This script manually triggers the reminder engine to test if reminders work
 * without waiting for the hourly cron job.
 */

import { processReminders } from './dist/server/services/reminders.js';

console.log('🧪 Testing reminder engine...\n');
console.log('This will check if any reminders should fire right now.');
console.log('Check your Telegram for admin notifications if reminders are sent.\n');

processReminders()
  .then(() => {
    console.log('\n✅ Test complete! Check the output above for results.');
    console.log('If reminders were sent, you should receive admin notifications on Telegram.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error during test:', err);
    process.exit(1);
  });
