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
	conversations: many(conversations)
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
	messages: many(messages)
}));

// Messages table
export const messages = pgTable('messages', {
	id: uuid('id').defaultRandom().primaryKey(),
	conversation_id: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
	role: messageRoleEnum('role').notNull(),
	content: text('content').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

// Message relations
export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversation_id],
		references: [conversations.id]
	})
}));
