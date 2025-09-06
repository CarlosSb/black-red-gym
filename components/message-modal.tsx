"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Mail, Phone, Clock, Loader2, Send } from "lucide-react"
import DataService, { type MessageData } from "@/lib/data-service"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (message: MessageData) => void
  message: MessageData | null
}

export function MessageModal({ isOpen, onClose, onUpdate, message }: MessageModalProps) {
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!message) return null

  const handleRespond = async () => {
    if (!response.trim()) return

    setIsLoading(true)
    try {
      const updatedMessage = await DataService.updateMessage(message.id, {
        status: "read",
        response: response.trim(),
        respondedAt: new Date().toISOString(),
      })

      if (updatedMessage) {
        onUpdate(updatedMessage)
        setResponse("")
        onClose()
      }
    } catch (error) {
      console.error("Error responding to message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async () => {
    setIsLoading(true)
    try {
      const updatedMessage = await DataService.updateMessage(message.id, {
        status: "read",
      })

      if (updatedMessage) {
        onUpdate(updatedMessage)
        onClose()
      }
    } catch (error) {
      console.error("Error updating message:", error)
    } finally {
      setIsLoading(false)
    }
  }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{message.subject}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityColor(message.priority)}>{getPriorityLabel(message.priority)}</Badge>
              {message.status === "unread" && <Badge variant="destructive">Nova</Badge>}
            </div>
          </div>
          <DialogDescription>Mensagem de {message.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{message.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{message.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(message.date)}</span>
            </div>
          </div>

          {/* Original Message */}
          <div>
            <Label className="text-base font-medium">Mensagem Original:</Label>
            <div className="mt-2 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Previous Response */}
          {message.response && (
            <div>
              <Label className="text-base font-medium">Resposta Enviada:</Label>
              <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{message.response}</p>
                {message.respondedAt && (
                  <p className="text-xs text-muted-foreground mt-2">Respondido em {formatDate(message.respondedAt)}</p>
                )}
              </div>
            </div>
          )}

          {/* Response Form */}
          <div>
            <Label htmlFor="response" className="text-base font-medium">
              {message.response ? "Nova Resposta:" : "Responder:"}
            </Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Digite sua resposta..."
              rows={4}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>

          {message.status === "unread" && (
            <Button type="button" variant="outline" onClick={handleMarkAsRead} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Marcar como Lida"}
            </Button>
          )}

          <Button
            onClick={handleRespond}
            className="bg-red-accent hover:bg-red-accent/90"
            disabled={!response.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Resposta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
