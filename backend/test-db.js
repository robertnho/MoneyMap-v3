// Test database connection
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  console.log('🔍 Testing database connection...')
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))
  
  try {
    // Test 1: Simple query
    console.log('\n✅ Test 1: Running simple query...')
    await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Simple query successful!')

    // Test 2: Check if User table exists
    console.log('\n✅ Test 2: Checking User table...')
    const userCount = await prisma.user.count()
    console.log(`✅ User table exists! Found ${userCount} users.`)

    // Test 3: Check if Account table exists
    console.log('\n✅ Test 3: Checking Account table...')
    const accountCount = await prisma.account.count()
    console.log(`✅ Account table exists! Found ${accountCount} accounts.`)

    // Test 4: Check if Transaction table exists
    console.log('\n✅ Test 4: Checking Transaction table...')
    const transactionCount = await prisma.transaction.count()
    console.log(`✅ Transaction table exists! Found ${transactionCount} transactions.`)

    console.log('\n🎉 All tests passed! Database connection is working correctly.')
  } catch (error) {
    console.error('\n❌ Database connection failed!')
    console.error('Error:', error.message)
    
    if (error.code === 'P1001') {
      console.error('\n💡 Possible causes:')
      console.error('   - Database server is unreachable')
      console.error('   - Firewall blocking connection')
      console.error('   - Wrong host or port in DATABASE_URL')
    } else if (error.code === 'P1002') {
      console.error('\n💡 Possible causes:')
      console.error('   - Database server timeout')
      console.error('   - Network issues')
    } else if (error.code === 'P1003') {
      console.error('\n💡 Possible causes:')
      console.error('   - Database does not exist')
      console.error('   - Wrong database name in DATABASE_URL')
    } else if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Possible causes:')
      console.error('   - Wrong username or password in DATABASE_URL')
      console.error('   - User does not have access to the database')
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Possible causes:')
      console.error('   - Tables not created yet')
      console.error('   - Run migrations: npm run db:migrate')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
