import newman from 'newman'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const collectionPath = path.join(__dirname, 'kantin-api.postman_collection.json')
const environmentPath = path.join(__dirname, 'kantin-local.postman_environment.json')
const reportPath = path.join(__dirname, 'newman-report.json')

const baseUrlArg = process.env.API_BASE_URL

console.log('🚀 Menjalankan API Automated Test menggunakan Newman...')
console.log(`📦 Collection : ${collectionPath}`)
console.log(`🌐 Environment: ${environmentPath}`)

newman.run(
  {
    collection: collectionPath,
    environment: environmentPath,
    ...(baseUrlArg && {
      envVar: [{ key: 'baseUrl', value: baseUrlArg }],
    }),
    reporters: ['cli', 'json'],
    reporter: {
      json: {
        export: reportPath,
      },
    },
    bail: false,
    color: 'on',
  },
  (err, summary) => {
    if (err) {
      console.error('❌ Newman gagal dijalankan:', err)
      process.exit(1)
    }

    const { stats, failures } = summary.run
    console.log('\n📊 Ringkasan Pengujian Newman:')
    console.log(`   - Total Requests  : ${stats.requests.total}`)
    console.log(`   - Total Assertions: ${stats.assertions.total}`)
    console.log(`   - Failed Asserts  : ${stats.assertions.failed}`)
    console.log(`   - Report JSON     : ${reportPath}`)

    if (failures && failures.length > 0) {
      console.error(`\n❌ Terdapat ${failures.length} kegagalan assertion!`)
      process.exit(1)
    }

    console.log('\n✅ Semua skenario pengujian API berhasil lulus!')
    process.exit(0)
  },
)
