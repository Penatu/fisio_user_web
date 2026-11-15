import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useChatSocket } from "@/hooks/useChatSocket";
import { ArrowLeft, MoreVertical, Phone, Send, Video } from "lucide-react";

const CHAT_ERROR_MESSAGE = "sedang terjadi gangguan, segera hubungi admin";

export default function ChatRoomPage() {
  const { roomId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const preview =
    location.state?.room?.id === roomId ? location.state.room : null;
  const { rooms, yourChatRef: fetchedChatRef, isLoading, error, reload } = useChatRooms();
  const [inputMessage, setInputMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef(null);

  const fetchedRoom = rooms.find((room) => room.id === roomId);
  const room =
    fetchedRoom || ((isLoading || error) && preview ? preview : null);
  const yourChatRef =
    room?.yourChatRef ||
    fetchedChatRef ||
    preview?.yourChatRef ||
    location.state?.yourChatRef ||
    "";

  const handleRoomError = useCallback(() => {
    navigate("/chat", {
      replace: true,
      state: { roomAlert: CHAT_ERROR_MESSAGE },
    });
  }, [navigate]);

  const {
    messages,
    isConnected,
    partnerOnline,
    isHistoryLoading,
    historyError,
    connectionError,
    sendMessage,
    reloadHistory,
  } = useChatSocket({
    roomId: room?.id ?? "",
    userRef: yourChatRef,
    onRoomError: handleRoomError,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const viewport = bottomRef.current?.closest(
        "[data-slot='scroll-area-viewport']",
      );
      if (!viewport) return;
      viewport.scrollTo({ top: viewport.scrollHeight });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isHistoryLoading, sendError]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const sent = sendMessage(inputMessage);
    if (!sent) {
      setSendError(CHAT_ERROR_MESSAGE);
      return;
    }
    setSendError("");
    setInputMessage("");
  };

  const presenceLabel = partnerOnline
    ? "Online"
    : isConnected
      ? "Offline"
      : "Menghubungkan...";

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="z-50 shrink-0 border-b border-border/40 bg-card/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <Link to="/chat">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              {room?.profilePicture && (
                <AvatarImage
                  src={room.profilePicture}
                  alt={room.therapistName}
                />
              )}
              <AvatarFallback className="bg-primary text-sm font-bold text-foreground">
                {room?.therapistInitial || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">
                {room?.therapistName || "Chat"}
              </h3>
              {room && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      partnerOnline
                        ? "bg-green-500"
                        : isConnected
                          ? "bg-muted-foreground/40"
                          : "bg-amber-500"
                    }`}
                  />
                  {presenceLabel}
                </p>
              )}
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

      <ScrollArea className="min-h-0 flex-1 bg-muted/40">
        <div className="w-full space-y-4 px-4 py-6">
          {isLoading && !room ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Memuat chat...
            </p>
          ) : error && !room ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">{CHAT_ERROR_MESSAGE}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4 rounded-full"
                onClick={reload}
              >
                Coba lagi
              </Button>
            </div>
          ) : !room ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Percakapan tidak ditemukan
              </p>
              <Button variant="outline" className="mt-4 rounded-full" asChild>
                <Link to="/chat">Kembali ke daftar</Link>
              </Button>
            </div>
          ) : (
            <>
              {!yourChatRef && (
                <p className="py-12 text-center text-sm text-destructive">
                  {CHAT_ERROR_MESSAGE}
                </p>
              )}
              {connectionError && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                  {CHAT_ERROR_MESSAGE}
                </p>
              )}
              {isHistoryLoading ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Memuat pesan...
                </p>
              ) : historyError ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-destructive">
                    {CHAT_ERROR_MESSAGE}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-full"
                    onClick={reloadHistory}
                  >
                    Coba lagi
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Belum ada pesan
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${message.isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                        message.isSelf
                          ? "rounded-br-md bg-primary text-foreground"
                          : "rounded-bl-md bg-card"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.isSelf
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {room && (
        <div className="shrink-0 border-t border-border/40 bg-card/95 p-4 backdrop-blur-lg">
          {sendError && (
            <p className="mb-2 text-center text-xs text-destructive">
              {sendError}
            </p>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Ketik pesan..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              disabled={!yourChatRef}
              className="h-12 flex-1 rounded-full border-border bg-secondary/50 px-6"
            />
            <Button
              type="button"
              size="icon"
              className="h-12 w-12 flex-shrink-0 rounded-full bg-primary text-foreground shadow-lg hover:shadow-xl"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
