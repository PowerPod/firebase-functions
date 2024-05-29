const { logger } = require('firebase-functions')
const { onRequest } = require('firebase-functions/v2/https')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')

const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

exports.mintPT = onRequest(async (req, res) => {
  const { orderId, address, amount } = req.body

  if (!orderId || !address || !amount) {
    res.status(400).json({ code: '1', message: 'missing required fields' })
    return
  }

  // verify orderId is unique
  const order = await getFirestore()
    .collection('mint_pt_order')
    .doc(orderId)
    .get()
  if (order.exists) {
    res.status(400).json({ code: '2', message: 'orderId already exists' })
    return
  }

  const writeResult = await getFirestore()
    .collection('mint_pt_order')
    .doc(orderId)
    .create({ address, amount, status: 'pending' })

  res.json({ code: '0', message: 'success', data: writeResult })
})
