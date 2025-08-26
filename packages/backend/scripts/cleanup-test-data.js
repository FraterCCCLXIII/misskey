#!/usr/bin/env node

import { DataSource } from 'typeorm';
import { entities } from '../built/postgres.js';

// Database connection
const dataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'misskey_user',
	password: 'misskey_password',
	database: 'misskey',
	entities: entities,
	synchronize: false,
	logging: false
});

async function cleanupTestData() {
	try {
		console.log('🔌 Connecting to database...');
		await dataSource.initialize();

		console.log('🧹 Starting test data cleanup...');

		// Get repositories
		const userRepository = dataSource.getRepository('MiUser');
		const noteRepository = dataSource.getRepository('MiNote');
		const followingRepository = dataSource.getRepository('MiFollowing');
		const userProfileRepository = dataSource.getRepository('MiUserProfile');
		const userKeypairRepository = dataSource.getRepository('MiUserKeypair');

		// Find all test users
		const testUsers = await userRepository.find({
			where: {
				username: {
					$like: 'test_%'
				}
			}
		});

		if (testUsers.length === 0) {
			console.log('ℹ️  No test users found to clean up.');
			return;
		}

		console.log(`👥 Found ${testUsers.length} test users to remove:`);
		testUsers.forEach(user => console.log(`   - ${user.username}`));

		// Get user IDs for cleanup
		const testUserIds = testUsers.map(user => user.id);

		// Delete related data first (foreign key constraints)
		console.log('🗑️  Deleting related data...');

		// Delete notes by test users
		const deletedNotes = await noteRepository.delete({
			userId: {
				$in: testUserIds
			}
		});
		console.log(`   📝 Deleted ${deletedNotes.affected || 0} notes`);

		// Delete notes with test data marker
		const deletedTestNotes = await noteRepository.delete({
			text: {
				$like: '%[TEST_DATA]%'
			}
		});
		console.log(`   📝 Deleted ${deletedTestNotes.affected || 0} test posts`);

		// Delete follow relationships
		const deletedFollowing = await followingRepository.delete({
			$or: [
				{ followerId: { $in: testUserIds } },
				{ followeeId: { $in: testUserIds } }
			]
		});
		console.log(`   🤝 Deleted ${deletedFollowing.affected || 0} follow relationships`);

		// Delete user profiles
		const deletedProfiles = await userProfileRepository.delete({
			userId: {
				$in: testUserIds
			}
		});
		console.log(`   👤 Deleted ${deletedProfiles.affected || 0} user profiles`);

		// Delete user keypairs
		const deletedKeypairs = await userKeypairRepository.delete({
			userId: {
				$in: testUserIds
			}
		});
		console.log(`   🔑 Deleted ${deletedKeypairs.affected || 0} user keypairs`);

		// Finally, delete the test users
		console.log('👥 Deleting test users...');
		const deletedUsers = await userRepository.delete({
			id: {
				$in: testUserIds
			}
		});
		console.log(`   ✅ Deleted ${deletedUsers.affected || 0} test users`);

		console.log('\n🎉 Test data cleanup completed successfully!');
		console.log('\n📊 Cleanup summary:');
		console.log(`   👥 Users removed: ${deletedUsers.affected || 0}`);
		console.log(`   📝 Notes removed: ${(deletedNotes.affected || 0) + (deletedTestNotes.affected || 0)}`);
		console.log(`   🤝 Follow relationships removed: ${deletedFollowing.affected || 0}`);
		console.log(`   👤 User profiles removed: ${deletedProfiles.affected || 0}`);
		console.log(`   🔑 User keypairs removed: ${deletedKeypairs.affected || 0}`);

	} catch (error) {
		console.error('❌ Error cleaning up test data:', error);
	} finally {
		if (dataSource.isInitialized) {
			await dataSource.destroy();
		}
	}
}

// Run the cleanup
cleanupTestData();
