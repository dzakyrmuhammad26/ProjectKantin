const PESANAN_FULL_INCLUDE = {
  items: true,
  pembayaran: true,
}

/**
 * Menghitung ulang total tagihan aktif pada sebuah sesi pelanggan (tidak termasuk pesanan batal).
 */
export const syncSesiTotalTagihan = async (tx, idSesi) => {
  if (!idSesi) return
  const aggregate = await tx.pesanan.aggregate({
    where: {
      idSesi,
      status: { not: 'batal' },
    },
    _sum: { total: true },
  })
  await tx.sesi.updateMany({
    where: { idSesi },
    data: { totalTagihan: aggregate._sum.total ?? 0 },
  })
}

/**
 * Menentukan status header pesanan secara agregat dari pembayaranId dan daftar statusItem.
 */
export const computeAggregateOrderStatus = (pembayaranId, items = []) => {
  if (items.length > 0 && items.every((item) => item.statusItem === 'batal')) {
    return 'batal'
  }

  if (!pembayaranId) {
    return 'menunggu_bayar'
  }

  const activeItems = items.filter((item) => item.statusItem !== 'batal')
  if (activeItems.length > 0 && activeItems.every((item) => item.statusItem === 'selesai')) {
    return 'selesai'
  }

  return 'siap_dibuat'
}

/**
 * Menyinkronkan total, status agregat pesanan, serta totalTagihan sesi di dalam satu transaksi.
 */
export const syncPesananState = async (tx, pesananId) => {
  const order = await tx.pesanan.findUnique({
    where: { id: pesananId },
    include: { items: true },
  })
  if (!order) return null

  const activeItems = order.items.filter((item) => item.statusItem !== 'batal')
  const nextStatus = computeAggregateOrderStatus(order.pembayaranId, order.items)
  const nextTotal =
    activeItems.length > 0
      ? activeItems.reduce((sum, item) => sum + item.subtotal, 0)
      : order.total

  const updated = await tx.pesanan.update({
    where: { id: order.id },
    data: {
      total: nextTotal,
      status: nextStatus,
    },
    include: PESANAN_FULL_INCLUDE,
  })

  await syncSesiTotalTagihan(tx, updated.idSesi)
  return updated
}
