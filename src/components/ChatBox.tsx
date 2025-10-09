import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import { useLobby } from '@/context/LobbyProvider';

export const ChatBox = () => {
  const { messages, sendMessage: sendLobbyMessage, currentPlayerId, room } = useLobby();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand nouveau message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !room) return;
    sendLobbyMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
        <Button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-glow-cyan"
            variant="default"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
    );
  }

  return (
      <div className="fixed bottom-4 right-4 w-80 h-96 bg-card border border-border rounded-lg shadow-elegant flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-sm">Communication</h3>
          </div>
          <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2" ref={scrollRef}>
            {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Aucun message. Commencez à communiquer !
                </p>
            ) : (
                messages.map((msg, index) => {
                  const currentPlayer = room?.players.find(p => p.id === currentPlayerId);
                  const isCurrentUser = msg.name === currentPlayer?.name;

                  return (
                      <div
                          key={index}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                                isCurrentUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                            }`}
                        >
                          <div className="font-semibold text-xs mb-1">
                            {msg.name}
                          </div>
                          {msg.message}
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                  );
                })
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border flex gap-2">
          <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Votre message..."
              className="flex-1"
          />
          <Button onClick={sendMessage} size="sm" className="gap-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
  );
};
