import fs from 'fs'
import path from 'path'
import csv from 'csvtojson'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Issuer from '../models/Issuer.js'

dotenv.config()

function parseDescriptor(descriptor) {
  if (!descriptor) return {}

  // Extract coupon rate — number before NCD/BD/LOA
  const couponMatch = descriptor.match(/(\d+\.?\d*)\s*(NCD|BD|LOA|BOND)/)
  const couponRate = couponMatch ? parseFloat(couponMatch[1]) : null

  // Extract maturity date — pattern like 22JU26, 10AP29
  const maturityMatch = descriptor.match(/\b(\d{2}[A-Z]{2}\d{2})\b/)
  const maturityDate = maturityMatch ? maturityMatch[1] : null

  // Extract instrument type
  let instrumentType = 'Not sure'
  if (descriptor.includes('NCD')) instrumentType = 'Secured NCD'
  else if (descriptor.includes('BD') || descriptor.includes('BOND')) instrumentType = 'Secured NCD'
  else if (descriptor.includes('LOA')) instrumentType = 'Unsecured NCD'

  // Extract issuer name — everything before the coupon rate
  const issuerMatch = descriptor.match(/^(.+?)\s+\d+\.?\d*\s*(NCD|BD|LOA|SR|BOND)/)
  const issuer = issuerMatch ? issuerMatch[1].trim() : descriptor.split(' ').slice(0, 4).join(' ')

  return { issuer, couponRate, maturityDate, instrumentType }
}

function getIssuerType(issuerName) {
  const name = issuerName.toUpperCase()
  if (name.includes('BANK')) return 'Financial Services'
  if (name.includes('FINANCE') || name.includes('FINSERV') || name.includes('CAPITAL')) return 'NBFC'
  if (name.includes('POWER') || name.includes('GRID') || name.includes('ELECTRIC')) return 'PSU / Utility'
  if (name.includes('INFRASTRUCTURE') || name.includes('METRO')) return 'Infrastructure'
  if (name.includes('HOUSING')) return 'Housing Finance'
  if (name.includes('NABARD') || name.includes('SIDBI') || name.includes('NHB') || name.includes('REC') || name.includes('PFC')) return 'PSU / Utility'
  return 'Not sure'
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const rows = await csv().fromFile(path.resolve('src/data/listed_bonds.csv'))

  const docs = rows.map(row => {
    const descriptor = row['DESCRIPTOR \n'] || row['DESCRIPTOR'] || ''
    const isin = (row['ISIN \n'] || row['ISIN'] || '').trim()
    const ytm = parseFloat(row['WEIGHTED  AVERAGE YIELD \n(YTM) (%)'] || 0)

    const { issuer, couponRate, maturityDate, instrumentType } = parseDescriptor(descriptor.trim())
    const issuerType = getIssuerType(issuer || '')

    return {
      isin,
      issuer: issuer || 'Unknown',
      issuerType,
      instrumentType,
      couponRate,
      maturityDate,
      yieldToMaturity: ytm,
      creditRating: 'Not sure',
      securityType: 'Not sure',
      groupSupport: 'Not sure',
      issueSize: 'Not sure',
    }
  }).filter(doc => doc.isin)

  await Issuer.deleteMany({})
  await Issuer.insertMany(docs, { ordered: false })
  console.log(`Seeded ${docs.length} issuers`)

  await mongoose.disconnect()
}

seed().catch(console.error)