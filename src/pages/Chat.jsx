import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    therapistName: "Dr. Ahmad Wijaya",
    therapistInitial: "AW",
    lastMessage: "Baik, silakan datang tepat waktu",
    time: "10:30",
    unread: 0,
  },
  {
    id: 2,
    therapistName: "Dr. Siti Nurhaliza",
    therapistInitial: "SN",
    lastMessage: "Ada yang bisa saya bantu?",
    time: "09:15",
    unread: 2,
  },
  {
    id: 3,
    therapistName: "Dr. Budi Santoso",
    therapistInitial: "BS",
    lastMessage: "Terima kasih atas feedbacknya",
    time: "Kemarin",
    unread: 0,
  },
  {
    id: 4,
    therapistName: "Dr. Maya Kusuma",
    therapistInitial: "MK",
    lastMessage: "Sampai jumpa di sesi berikutnya",
    time: "2 hari lalu",
    unread: 0,
  },
];

const messagesByConversation = {
  1: [
    {
      id: 1,
      sender: "therapist",
      text: "Halo, booking Anda untuk besok sudah dikonfirmasi",
      time: "10:20",
    },
    {
      id: 2,
      sender: "user",
      text: "Terima kasih dok. Jam berapa ya?",
      time: "10:25",
    },
    {
      id: 3,
      sender: "therapist",
      text: "Baik, silakan datang tepat waktu",
      time: "10:30",
    },
  ],
  2: [
    {
      id: 1,
      sender: "therapist",
      text: "Halo, ada yang bisa saya bantu?",
      time: "09:00",
    },
    {
      id: 2,
      sender: "user",
      text: "Halo dok, saya ingin konsultasi mengenai nyeri punggung saya",
      time: "09:02",
    },
    {
      id: 3,
      sender: "therapist",
      text: "Baik, bisa dijelaskan lebih detail lokasinya dimana dan sudah berapa lama?",
      time: "09:03",
    },
    {
      id: 4,
      sender: "user",
      text: "Di bagian punggung bawah, sudah sekitar 2 minggu ini",
      time: "09:05",
    },
    {
      id: 5,
      sender: "therapist",
      text: "Oke, untuk penanganan awal saya sarankan: 1) Kompres hangat 15-20 menit 2) Hindari posisi duduk terlalu lama 3) Lakukan peregangan ringan. Kita bisa lanjut dengan sesi terapi jika diperlukan.",
      time: "09:10",
    },
    {
      id: 6,
      sender: "therapist",
      text: "Ada yang bisa saya bantu?",
      time: "09:15",
    },
  ],
  3: [
    {
      id: 1,
      sender: "user",
      text: "Terima kasih dok atas terapinya kemarin, punggung saya sudah jauh lebih baik",
      time: "14:00",
    },
    {
      id: 2,
      sender: "therapist",
      text: "Terima kasih atas feedbacknya",
      time: "14:05",
    },
  ],
  4: [
    {
      id: 1,
      sender: "therapist",
      text: "Jangan lupa latihan yang sudah saya ajarkan ya",
      time: "16:00",
    },
    {
      id: 2,
      sender: "user",
      text: "Siap dok, terima kasih",
      time: "16:05",
    },
    {
      id: 3,
      sender: "therapist",
      text: "Sampai jumpa di sesi berikutnya",
      time: "16:10",
    },
  ],
};

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const currentConversation = conversations.find((c) => c.id === selectedChat);

  const handleSelectConversation = (conversationId) => {
    setSelectedChat(conversationId);
    setMessages(messagesByConversation[conversationId] || []);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: inputMessage,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  if (selectedChat === null) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-lg font-bold">Chat</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/40">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/50 active:bg-secondary"
              >
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-sm font-bold text-foreground">
                    {conversation.therapistInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">
                      {conversation.therapistName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-foreground">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-sm font-bold text-foreground">
                {currentConversation?.therapistInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-bold">
                {currentConversation?.therapistName}
              </h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 bg-muted/40">
        <div className="space-y-4 px-4 py-6 pb-24">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                  message.sender === "user"
                    ? "rounded-br-md bg-primary text-foreground"
                    : "rounded-bl-md bg-card"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 left-1/2 w-full max-w-[450px] -translate-x-1/2 border-t border-border/40 bg-card/95 p-4 backdrop-blur-lg">
        <div className="flex gap-2">
          <Input
            placeholder="Ketik pesan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="h-12 flex-1 rounded-full border-border bg-secondary/50 px-6"
          />
          <Button
            size="icon"
            className="h-12 w-12 flex-shrink-0 rounded-full bg-primary text-foreground shadow-lg hover:shadow-xl"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
