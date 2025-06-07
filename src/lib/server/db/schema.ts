import { pgTable, text, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system']);

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	name: varchar('name', { length: 255 }),
	avatar_url: text('avatar_url'),
	created_at: timestamp('created_at').defaultNow().notNull()
});

// Define conversations table without self-reference first
export const conversations = pgTable('conversations', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	// Self-references defined without .references() initially
	parent_conversation_id: uuid('parent_conversation_id'),
	branch_from_message_id: uuid('branch_from_message_id'),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const messages = pgTable('messages', {
	id: uuid('id').defaultRandom().primaryKey(),
	conversation_id: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
	role: messageRoleEnum('role').notNull(),
	content: text('content').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations handle the foreign key constraints
export const usersRelations = relations(users, ({ many }) => ({
	conversations: many(conversations)
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
	user: one(users, {
		fields: [conversations.user_id],
		references: [users.id]
	}),
	messages: many(messages),
	parentConversation: one(conversations, {
		fields: [conversations.parent_conversation_id],
		references: [conversations.id],
		relationName: 'parent_child'
	}),
	childBranches: many(conversations, { relationName: 'parent_child' }),
	branchFromMessage: one(messages, {
		fields: [conversations.branch_from_message_id],
		references: [messages.id]
	})
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
	conversation: one(conversations, {
		fields: [messages.conversation_id],
		references: [conversations.id]
	}),
	branchedConversations: many(conversations)
}));
