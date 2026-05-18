<?php

namespace Tests\Feature\Api;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_start_conversation(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->vendor()->create();
        $token = $sender->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/chats', [
                'receiver_id' => $receiver->id,
                'message' => 'Hello, I am interested in your property',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.message', 'Hello, I am interested in your property');
    }

    public function test_user_can_list_conversations(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Conversation::create([
            'sender_id' => $user->id,
            'receiver_id' => $other->id,
            'last_message_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/chats');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_user_can_send_message(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();
        $token = $sender->createToken('test')->plainTextToken;

        $conversation = Conversation::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'last_message_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/chats', [
                'receiver_id' => $receiver->id,
                'message' => 'New message',
            ]);

        $response->assertStatus(201);
    }

    public function test_messages_marked_read_when_viewed(): void
    {
        $sender = User::factory()->create();
        $receiver = User::factory()->create();

        $conversation = Conversation::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'last_message_at' => now(),
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'message' => 'Test message',
        ]);

        $token = $receiver->createToken('test')->plainTextToken;
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/v1/chats/{$conversation->id}");

        $response->assertStatus(200);
        $this->assertTrue(
            Message::where('conversation_id', $conversation->id)
                ->where('sender_id', $sender->id)
                ->first()->is_read,
        );
    }

    public function test_user_cannot_access_others_conversation(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        $conversation = Conversation::create([
            'sender_id' => $user1->id,
            'receiver_id' => $user2->id,
            'last_message_at' => now(),
        ]);

        $token = $user3->createToken('test')->plainTextToken;
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/v1/chats/{$conversation->id}");

        $response->assertStatus(403);
    }
}
