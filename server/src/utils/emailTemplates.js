export function bookingAcceptedTemplate(booking) {
  const { bookingID, eventDate, startTime, endTime } = booking || {};
  return {
    subject: `Your booking #${bookingID} has been accepted` ,
    html: `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color:#16a34a;">Booking Accepted</h2>
        <p>We're happy to let you know your booking has been <strong>ACCEPTED</strong>.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingID}</li>
          <li><strong>Time:</strong> ${eventDate || ''} ${startTime || ''} - ${endTime || ''}</li>
        </ul>
        <p>We'll be in touch if we need anything else. Thank you for choosing us!</p>
      </div>
    `,
    text: [
      `Booking Accepted`,
      `Booking ID: ${bookingID}`,
      `Time: ${eventDate || ''} ${startTime || ''} - ${endTime || ''}`,
      `We'll be in touch if we need anything else. Thank you for choosing us!`
    ].join('\n')
  };
}

export function bookingRejectedTemplate(booking, reason) {
  const { bookingID, eventDate, startTime, endTime } = booking || {};
  return {
    subject: `Your booking #${bookingID} has been rejected` ,
    html: `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color:#dc2626;">Booking Rejected</h2>
        <p>We're sorry to inform you your booking has been <strong>REJECTED</strong>.</p>
        <ul>
          <li><strong>Booking ID:</strong> ${bookingID}</li>
          <li><strong>Time:</strong> ${eventDate || ''} ${startTime || ''} - ${endTime || ''}</li>
          ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
        </ul>
        <p>If you have questions, please reply to this email.</p>
      </div>
    `,
    text: [
      `Booking Rejected`,
      `Booking ID: ${bookingID}`,
      `Time: ${eventDate || ''} ${startTime || ''} - ${endTime || ''}`,
      reason ? `Reason: ${reason}` : '',
      `If you have questions, please reply to this email.`
    ].filter(Boolean).join('\n')
  };
}
