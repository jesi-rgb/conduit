import { pgTable, serial, text, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define message role enum
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system']);

// Users table
export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	name: varchar('name', { length: 255 }),
	avatar_url: text('avatar_url'),
	created_at: timestamp('created_at').defaultNow().notNull()
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
	rootConversations: many(conversations)
}));

// Conversations table
export const conversations = pgTable('conversations', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Conversation relations
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
	user: one(users, {
		fields: [conversations.user_id],
		references: [users.id]
	}),
	mainMessages: many(messages, { relationName: 'main_chat_messages' }),
	branches: many(branches)
}));

// IMPORTANT: Define messages table *first* because `branches` needs to reference it.
// We'll define the `branch_id` FK as part of the messages definition.
export const messages = pgTable('messages', {
	id: uuid('id').defaultRandom().primaryKey(),
	conversation_id: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
	// DEFERRED FK for branch_id - it references `branches.id`
	// We will add the foreign key constraint directly using `foreignKey()` if needed, or rely solely on `relations`
	// For now, let's keep it simple with Drizzle not auto-creating the FK constraint in this specific definition for `branch_id` to avoid the loop at THIS stage.
	branch_id: uuid('branch_id'),
	role: messageRoleEnum('role').notNull(),
	content: text('content').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

// Messages relations
export const messagesRelations = relations(messages, ({ one, many }) => ({
	rootConversation: one(conversations, {
		fields: [messages.conversation_id],
		references: [conversations.id],
		relationName: 'main_chat_messages'
	}),
	// Link to a specific branch, if applicable.
	// The *actual foreign key constraint* to `branches.id` needs to be defined
	// separately after both tables are guaranteed to exist,
	// or implicitly by Drizzle Kit in its migration process.
	// For direct circular dependency during schema loading, sometimes we omit `references()` here initially.
	branch: one(branches, {
		fields: [messages.branch_id],
		references: [branches.id], // Drizzle should now allow this with the definition order
		relationName: 'branch_messages'
	}),
	branchesStartingFromThisMessage: many(branches) // Inverse relation
}));


// Branches table (Now can reference `messages` as `messages` is defined)
export const branches = pgTable('branches', {
	id: uuid('id').defaultRandom().primaryKey(),
	parent_conversation_id: uuid('parent_conversation_id')
		.notNull()
		.references(() => conversations.id, { onDelete: 'cascade' }),
	branch_from_message_id: uuid('branch_from_message_id')
		.notNull()
		.references(() => messages.id, { onDelete: 'cascade' }), // Now `messages` is defined!
	branch_name: varchar('branch_name', { length: 255 }).notNull(),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Branch relations
export const branchesRelations = relations(branches, ({ one, many }) => ({
	parentConversation: one(conversations, {
		fields: [branches.parent_conversation_id],
		references: [conversations.id]
	}),
	branchFromMessage: one(messages, {
		fields: [branches.branch_from_message_id],
		references: [messages.id]
	}),
	branchMessages: many(messages, { relationName: 'branch_messages' })
}));
