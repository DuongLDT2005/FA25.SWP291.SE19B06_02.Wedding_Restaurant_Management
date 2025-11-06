import ContractDAO, { ContractStatus } from '../dao/ContractDAO.js';
import BookingDAO from '../dao/BookingDAO.js';
import BookingStatus from '../models/enums/BookingStatus.js';
import fs from 'fs/promises';
import path from 'path';

const SIGNED_DIR = path.resolve(process.cwd(), 'server', 'uploads', 'contracts', 'signed');

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
}

class ContractController {
  // Customer uploads/saves signed contract (expects base64 in body.signedBase64 and optional filename)
  static async signContract(req, res) {
    try {
      const contractID = req.params.id;
      const userId = req.user?.userId;
      if (!contractID) return res.status(400).json({ success: false, message: 'Missing contract id' });

      const contract = await ContractDAO.getByID(contractID);
      if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

      const booking = await BookingDAO.getBookingById(contract.bookingID);
      if (!booking) return res.status(404).json({ success: false, message: 'Related booking not found' });

      // Only customer for this booking can sign, and only after deposit
      if (booking.customerID !== userId) return res.status(403).json({ success: false, message: 'Only booking customer can sign contract' });
      if (booking.status !== BookingStatus.DEPOSITED) return res.status(400).json({ success: false, message: 'Booking must be deposited before customer can sign' });

      const { signedBase64, filename } = req.body || {};
      if (!signedBase64) return res.status(400).json({ success: false, message: 'Missing signedBase64 in request body' });

      await ensureDir(SIGNED_DIR);
      const name = filename ? path.basename(filename) : `signed-${contractID}-${Date.now()}.pdf`;
      const filepath = path.join(SIGNED_DIR, name);
      const data = signedBase64.split(',').pop();
      const buf = Buffer.from(data, 'base64');
      await fs.writeFile(filepath, buf);

      // Update contract record: url, signedDate, status
      await ContractDAO.updateContract(contractID, { contractURL: filepath, signedDate: new Date(), status: ContractStatus.CUSTOMER_UPLOADED });

      return res.status(200).json({ success: true, message: 'Contract signed and uploaded', file: filepath });
    } catch (e) {
      console.error('signContract error', e);
      return res.status(500).json({ success: false, message: e?.message || e });
    }
  }

  // Partner upload (optional): partner can upload their signed file and set status PARTNER_UPLOADED
  static async partnerUpload(req, res) {
    try {
      const contractID = req.params.id;
      if (!contractID) return res.status(400).json({ success: false, message: 'Missing contract id' });
      const contract = await ContractDAO.getByID(contractID);
      if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

      const { signedBase64, filename } = req.body || {};
      if (!signedBase64) return res.status(400).json({ success: false, message: 'Missing signedBase64 in request body' });

      await ensureDir(SIGNED_DIR);
      const name = filename ? path.basename(filename) : `partner-signed-${contractID}-${Date.now()}.pdf`;
      const filepath = path.join(SIGNED_DIR, name);
      const data = signedBase64.split(',').pop();
      const buf = Buffer.from(data, 'base64');
      await fs.writeFile(filepath, buf);

      await ContractDAO.updateContract(contractID, { contractURL: filepath, signedDate: new Date(), status: ContractStatus.PARTNER_UPLOADED });
      return res.status(200).json({ success: true, message: 'Partner signed contract uploaded', file: filepath });
    } catch (e) {
      console.error('partnerUpload error', e);
      return res.status(500).json({ success: false, message: e?.message || e });
    }
  }
}

export default ContractController;
