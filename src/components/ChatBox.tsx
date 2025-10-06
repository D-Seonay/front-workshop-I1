import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, MessageCircle } from 'lucide-react';
import { useGame } from '@/context/GameContext';

interface Message {
  id: string;
  sender: 'agent' | 'operator';
  text: string;
  timestamp: Date;
}

export const ChatBox = () => {
  const { playerRole } = useGame();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const sendMessage = () => {
    if (!inputValue.trim() || !playerRole) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: playerRole,
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
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
        <div className="space-y-2">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Aucun message. Commencez à communiquer !
            </p>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === playerRole ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender === playerRole
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">
                    {msg.sender === 'agent' ? '🧑‍🎨 Agent' : '👨‍💻 Opérateur'}
                  </div>
                  {msg.text}
                </div>
              </div>
            ))
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
