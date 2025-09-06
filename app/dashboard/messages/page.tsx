"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Mail, MailOpen, Clock, Phone, Calendar, Filter, Trash2 } from "lucide-react"
import { MessageModal } from "@/components/message-modal"
import DataService, { type MessageData } from "@/lib/data-service"

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageData[]>([])
  const [filteredMessages, setFilteredMessages] = useState<MessageData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const loadedMessages = await DataService.getMessages()
        setMessages(loadedMessages)
        setFilteredMessages(loadedMessages)
      } catch (error) {
        console.error("Error loading messages:", error)
      }
    }
    loadMessages()
  }, [])

  useEffect(() => {
    const filtered = messages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredMessages(filtered)
  }, [messages, searchTerm])

  const handleOpenMessage = (message: MessageData) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
  }

  const handleUpdateMessage = (updatedMessage: MessageData) => {
    const updatedMessages = messages.map((m) => (m.id === updatedMessage.id ? updatedMessage : m))
    setMessages(updatedMessages)
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm("Tem certeza que deseja excluir esta mensagem?")) {
      try {
        const success = await DataService.deleteMessage(messageId)
        if (success) {
          const updatedMessages = await DataService.getMessages()
          setMessages(updatedMessages)
          setFilteredMessages(updatedMessages)
        }
      } catch (error) {
        console.error("Error deleting message:", error)
      }
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const updatedMessage = await DataService.updateMessage(messageId, { status: "read" })
      if (updatedMessage) {
        handleUpdateMessage(updatedMessage)
      }
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }

  const unreadCount = messages.filter((m) => m.status === "unread").length
  const todayCount = messages.filter((m) => {
    const messageDate = new Date(m.date)
    const today = new Date()
    return messageDate.toDateString() === today.toDateString()
  }).length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Média"
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mensagens de Contato</h1>
          <p className="text-muted-foreground">Gerencie as mensagens recebidas através do formulário de contato</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-accent">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Mensagens pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCount}</div>
            <p className="text-xs text-muted-foreground">Recebidas hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">Todas as mensagens</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou assunto..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card
            key={message.id}
            className={`cursor-pointer transition-colors hover:bg-muted/30 ${
              message.status === "unread" ? "border-red-accent/50 bg-red-accent/5" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3" onClick={() => handleOpenMessage(message)}>
                  <div
                    className={`p-2 rounded-full ${
                      message.status === "unread" ? "bg-red-accent text-white" : "bg-muted"
                    }`}
                  >
                    {message.status === "unread" ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{message.name}</h3>
                    <p className="text-sm text-muted-foreground">{message.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(message.priority)}>{getPriorityLabel(message.priority)}</Badge>
                  {message.status === "unread" && <Badge variant="destructive">Nova</Badge>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {message.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {message.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(message.date)}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg mb-4" onClick={() => handleOpenMessage(message)}>
                <p className="text-sm line-clamp-2">{message.message}</p>
              </div>

              {message.response && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                  <p className="text-sm text-green-800 font-medium">Respondido:</p>
                  <p className="text-sm text-green-700 line-clamp-1">{message.response}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-red-accent hover:bg-red-accent/90"
                  onClick={() => handleOpenMessage(message)}
                >
                  {message.response ? "Ver Conversa" : "Responder"}
                </Button>
                {message.status === "unread" && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(message.id)}>
                    Marcar como Lida
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma mensagem encontrada para sua busca." : "Nenhuma mensagem encontrada."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateMessage}
        message={selectedMessage}
      />
    </div>
  )
}
