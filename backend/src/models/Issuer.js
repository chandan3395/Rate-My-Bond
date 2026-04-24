import mongoose from 'mongoose'

const issuerSchema = new mongoose.Schema({
  isin: { type: String, required: true, unique: true },
  issuer: { type: String, required: true },
  issuerType: { type: String, default: 'Not sure' },
  creditRating: { type: String, default: 'Not sure' },
  instrumentType: { type: String, default: 'Not sure' },
  securityType: { type: String, default: 'Not sure' },
  groupSupport: { type: String, default: 'Not sure' },
  couponRate: { type: Number },
  maturityDate: { type: String },
  issueSize: { type: String, default: 'Not sure' },
  yieldToMaturity: { type: Number },
}, { timestamps: true })

export default mongoose.model('Issuer', issuerSchema)