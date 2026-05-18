<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $userId = auth()->id();
        $conversations = Conversation::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->with(['sender', 'receiver', 'property', 'lastMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get();

        return $this->success($conversations);
    }

    public function show(Conversation $conversation): JsonResponse
    {
        $userId = auth()->id();
        if ($conversation->sender_id !== $userId && $conversation->receiver_id !== $userId) {
            return $this->error('Unauthorized', 403);
        }

        $conversation->load(['sender', 'receiver', 'property', 'messages.sender']);
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->success($conversation);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'property_id' => 'nullable|exists:properties,id',
            'message' => 'required_without:file|string|nullable',
            'file' => 'nullable|file|max:10240',
        ]);

        $conversation = Conversation::firstOrCreate(
            [
                'sender_id' => auth()->id(),
                'receiver_id' => $validated['receiver_id'],
                'property_id' => $validated['property_id'] ?? null,
            ],
            [
                'last_message_at' => now(),
            ],
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => auth()->id(),
            'message' => $validated['message'] ?? null,
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('chat-files', 'public');
            $message->update([
                'file_path' => $path,
                'file_type' => $request->file('file')->getMimeType(),
            ]);
        }

        $conversation->update(['last_message_at' => now()]);

        return $this->success($message->load('sender'), 'Message sent', 201);
    }

    public function markRead(Conversation $conversation): JsonResponse
    {
        Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return $this->success(null, 'Messages marked as read');
    }
}
