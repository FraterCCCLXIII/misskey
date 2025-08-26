#!/usr/bin/env node

import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { entities } from '../built/postgres.js';

// Test data marker - all test data will have this prefix
const TEST_MARKER = '[TEST_DATA]';

// Simple ID generator
function generateId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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
	logging: false,
});

// Test users data
const testUsers = [
	{
		username: 'test_alice',
		usernameLower: 'test_alice',
		password: 'password123',
		email: 'test_alice@example.com',
		name: `${TEST_MARKER} Alice Test`,
		description: 'This is a test user for UI testing. Can be safely deleted.',
		location: 'Test City',
		birthday: '1990-01-01',
		lang: 'en-US',
		host: null,
		uri: null,
		url: null,
		movedToUri: null,
		alsoKnownAs: null,
		preventIndexing: false,
		disallowUnfollow: false,
		isSilenced: false,
		isSuspended: false,
		isHibernated: false,
		requireSigninToViewContents: false,
		score: 0,
		chatScope: 'mutual',
	},
	{
		username: 'test_bob',
		usernameLower: 'test_bob',
		password: 'password123',
		email: 'test_bob@example.com',
		name: `${TEST_MARKER} Bob Test`,
		description: 'Another test user for UI testing. Safe to delete.',
		location: 'Test Town',
		birthday: '1992-05-15',
		lang: 'en-US',
		host: null,
		uri: null,
		url: null,
		movedToUri: null,
		alsoKnownAs: null,
		preventIndexing: false,
		disallowUnfollow: false,
		isSilenced: false,
		isSuspended: false,
		isHibernated: false,
		requireSigninToViewContents: false,
		score: 0,
		chatScope: 'mutual',
	},
	{
		username: 'test_carol',
		usernameLower: 'test_carol',
		password: 'password123',
		email: 'test_carol@example.com',
		name: `${TEST_MARKER} Carol Test`,
		description: 'Test user for UI testing. Safe to delete.',
		location: 'Test Village',
		birthday: '1988-12-25',
		lang: 'en-US',
		host: null,
		uri: null,
		url: null,
		movedToUri: null,
		alsoKnownAs: null,
		preventIndexing: false,
		disallowUnfollow: false,
		isSilenced: false,
		isSuspended: false,
		isHibernated: false,
		requireSigninToViewContents: false,
		score: 0,
		chatScope: 'mutual',
	},
	{
		username: 'test_dave',
		usernameLower: 'test_dave',
		password: 'password123',
		email: 'test_dave@example.com',
		name: `${TEST_MARKER} Dave Test`,
		description: 'Test user for UI testing. Safe to delete.',
		location: 'Test Borough',
		birthday: '1995-07-04',
		lang: 'en-US',
		host: null,
		uri: null,
		url: null,
		movedToUri: null,
		alsoKnownAs: null,
		preventIndexing: false,
		disallowUnfollow: false,
		isSilenced: false,
		isSuspended: false,
		isHibernated: false,
		requireSigninToViewContents: false,
		score: 0,
		chatScope: 'mutual',
	},
	{
		username: 'test_eve',
		usernameLower: 'test_eve',
		password: 'password123',
		email: 'test_eve@example.com',
		name: `${TEST_MARKER} Eve Test`,
		description: 'Test user for UI testing. Safe to delete.',
		location: 'Test District',
		birthday: '1991-03-20',
		lang: 'en-US',
		host: null,
		uri: null,
		url: null,
		movedToUri: null,
		alsoKnownAs: null,
		preventIndexing: false,
		disallowUnfollow: false,
		isSilenced: false,
		isSuspended: false,
		isHibernated: false,
		requireSigninToViewContents: false,
		score: 0,
		chatScope: 'mutual',
	},
];

// Sample posts content (simplified to avoid poll issues)
const samplePosts = [
	`${TEST_MARKER} Hello everyone! This is a test post to help with UI testing. #test #misskey`,
	`${TEST_MARKER} Just testing the interface here. How does this look? 🎨✨`,
	`${TEST_MARKER} Another test post with some emojis and formatting. **Bold text** and *italic text*!`,
	`${TEST_MARKER} Testing the timeline functionality. This should appear in the global timeline.`,
	`${TEST_MARKER} A longer test post to see how the UI handles different post lengths. This is just some sample text to make the post longer and see how the interface adapts to various content sizes.`,
	`${TEST_MARKER} Testing mentions: @test_alice @test_bob @test_carol`,
	`${TEST_MARKER} Testing hashtags: #misskey #test #social #federation`,
	`${TEST_MARKER} Testing CW (Content Warning): This post has a content warning.`,
	`${TEST_MARKER} Testing local-only posts. This should only appear locally.`,
	`${TEST_MARKER} Another simple test post to fill the timeline.`,
];

async function generateTestData() {
	try {
		console.log('🔌 Connecting to database...');
		await dataSource.initialize();

		console.log('📝 Starting test data generation...');

		const userRepository = dataSource.getRepository('MiUser');
		const userProfileRepository = dataSource.getRepository('MiUserProfile');
		const userKeypairRepository = dataSource.getRepository('MiUserKeypair');
		const noteRepository = dataSource.getRepository('MiNote');

		const createdUsers = [];

		// Create test users
		for (const userData of testUsers) {
			console.log(`👤 Creating user: ${userData.username}`);

			// Generate user ID
			const userId = generateId();

			// Hash password
			const hashedPassword = await bcrypt.hash(userData.password, 10);

			// Create user
			const user = userRepository.create({
				id: userId,
				username: userData.username,
				usernameLower: userData.usernameLower,
				password: hashedPassword,
				email: userData.email,
				host: userData.host,
				uri: userData.uri,
				url: userData.url,
				movedToUri: userData.movedToUri,
				alsoKnownAs: userData.alsoKnownAs,
				preventIndexing: userData.preventIndexing,
				disallowUnfollow: userData.disallowUnfollow,
				isSilenced: userData.isSilenced,
				isSuspended: userData.isSuspended,
				isHibernated: userData.isHibernated,
				requireSigninToViewContents: userData.requireSigninToViewContents,
				score: userData.score,
				chatScope: userData.chatScope,
			});

			const savedUser = await userRepository.save(user);
			createdUsers.push(savedUser);

			// Create user profile
			const userProfile = userProfileRepository.create({
				userId: savedUser.id,
				name: userData.name,
				description: userData.description,
				location: userData.location,
				birthday: userData.birthday,
				lang: userData.lang,
				verifiedLinks: [],
				hardMutedWords: [],
				followedMessage: null,
				followingVisibility: 'public',
				followersVisibility: 'public',
			});

			await userProfileRepository.save(userProfile);

			// Create user keypair (required for ActivityPub)
			const userKeypair = userKeypairRepository.create({
				id: generateId(),
				userId: savedUser.id,
				publicKey: 'test-public-key',
				privateKey: 'test-private-key',
			});

			await userKeypairRepository.save(userKeypair);

			console.log(`✅ Created user: ${userData.username} (ID: ${savedUser.id})`);
		}

		// Create test posts
		console.log('📝 Creating test posts...');

		for (let i = 0; i < samplePosts.length; i++) {
			const postContent = samplePosts[i];
			const authorIndex = i % createdUsers.length;
			const author = createdUsers[authorIndex];

			const note = noteRepository.create({
				id: generateId(),
				text: postContent,
				cw: postContent.includes('CW') ? 'Content Warning' : null,
				userId: author.id,
				replyId: null,
				renoteId: null,
				visibility: 'public',
				localOnly: postContent.includes('local-only'),
				reactionAcceptance: null,
				uri: null,
				url: null,
				channelId: null,
				hasPoll: false, // Disable polls for now to avoid entity issues
				pollChoices: null,
				pollMultiple: false,
				pollExpiresAt: null,
				reactionAndUserPairCache: [],
				pageCount: 0,
			});

			await noteRepository.save(note);
			console.log(`✅ Created post ${i + 1}: "${postContent.substring(0, 50)}..." by ${author.username}`);
		}

		// Create some follow relationships
		console.log('🤝 Creating follow relationships...');

		for (let i = 0; i < createdUsers.length; i++) {
			const follower = createdUsers[i];
			const followee = createdUsers[(i + 1) % createdUsers.length];

			if (follower.id !== followee.id) {
				const following = dataSource.getRepository('MiFollowing').create({
					id: generateId(),
					followerId: follower.id,
					followeeId: followee.id,
					followerHost: null,
					followeeHost: null,
					withReplies: false,
					notify: null,
					isFollowerHibernated: false,
				});

				await dataSource.getRepository('MiFollowing').save(following);
				console.log(`✅ ${follower.username} is now following ${followee.username}`);
			}
		}

		console.log('\n🎉 Test data generation completed successfully!');
		console.log('\n📊 Summary:');
		console.log(`   👥 Users created: ${createdUsers.length}`);
		console.log(`   📝 Posts created: ${samplePosts.length}`);
		console.log(`   🤝 Follow relationships: ${createdUsers.length}`);

		console.log('\n🔍 Test users created:');
		createdUsers.forEach(user => {
			console.log(`   - ${user.username} (password: password123)`);
		});

		console.log('\n🧹 To clean up later, run:');
		console.log('   DELETE FROM "user" WHERE "username" LIKE \'test_%\';');
		console.log('   DELETE FROM "note" WHERE "text" LIKE \'%[TEST_DATA]%\';');
		console.log('   DELETE FROM "following" WHERE "followerId" IN (SELECT "id" FROM "user" WHERE "username" LIKE \'test_%\');');
	} catch (error) {
		console.error('❌ Error generating test data:', error);
	} finally {
		if (dataSource.isInitialized) {
			await dataSource.destroy();
		}
	}
}

// Run the script
generateTestData();
