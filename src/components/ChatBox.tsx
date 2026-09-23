'use client'

import { useState, useRef, useEffect } from 'react'
import { sendMessage, deleteMessage, markMessagesAsRead } from '@/app/actions/messages'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Send, Image as ImageIcon, Download, Trash, Check, CheckCheck } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent } from '@/components/ui/dialog'

type ChatBoxProps = {
  initialMessages: any[]
  userId: string
  leadId?: string
  clientId?: string
}

export default function ChatBox({ initialMessages, userId, leadId, clientId }: ChatBoxProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    markMessagesAsRead(userId, leadId, clientId)
  }, [userId, leadId, clientId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!text.trim()) return

    const tempMsg = {
      id: Math.random().toString(),
      text,
      imageUrl: null,
      userId,
      user: { name: 'You' },
      createdAt: new Date()
    }
    setMessages((prev) => [...prev, tempMsg])
    setText('')

    const savedMsg = await sendMessage({ text, userId, leadId, clientId })
    // In a real app we'd replace tempMsg, but revalidatePath will refresh the page via server components or Next router
  }

  const uploadFile = async (file: File) => {
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("Cloudinary keys are not set yet!")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const isImage = file.type.startsWith('image/')
    const resourceType = isImage ? 'image' : 'raw'

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        await sendMessage({ imageUrl: data.secure_url, fileName: data.original_filename, userId, leadId, clientId })
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await uploadFile(file)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) uploadFile(file)
      }
    }
  }

  const getDownloadUrl = (url: string) => {
    // Only apply fl_attachment to image URLs because raw files don't support transformations
    if (url.includes('/image/upload/')) {
      return url.replace('/image/upload/', '/image/upload/fl_attachment/')
    }
    return url
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Team Discussion</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            <div className="p-4 bg-gray-50 rounded-full">
              <Send className="w-8 h-8 text-gray-300" />
            </div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.userId === userId
          const isDoc = msg.imageUrl && !msg.imageUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i)
          
          return (
            <div key={msg.id} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1.5 mx-1">
                {isMe && <button onClick={async () => { setMessages(messages.filter(m => m.id !== msg.id)); await deleteMessage(msg.id, leadId, clientId) }} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"><Trash className="w-3 h-3" /></button>}
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  {isMe ? 'You' : msg.user?.name} • {format(new Date(msg.createdAt), 'p')}
                  {isMe && (
                    <span className="ml-0.5">
                      {msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </span>
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[85%] shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                {msg.imageUrl && (
                  isDoc ? (
                    <a href={getDownloadUrl(msg.imageUrl)} download={msg.fileName || 'document'} target="_blank" rel="noreferrer" className="flex items-center gap-2 mt-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition text-inherit">
                      <Download className="w-5 h-5 flex-shrink-0" />
                      <span className="underline truncate text-sm max-w-[200px]">{msg.fileName || 'Download Attachment'}</span>
                    </a>
                  ) : (
                    <img 
                      src={msg.imageUrl} 
                      alt="attachment" 
                      className="rounded-xl mt-3 max-w-full h-auto object-cover max-h-72 border border-black/10 cursor-zoom-in" 
                      onClick={() => setZoomedImage(msg.imageUrl)}
                    />
                  )
                )}
              </div>
            </div>
          )
        })}
        {uploading && (
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 mb-1.5 mx-1 font-medium">You • just now</span>
            <div className="px-5 py-4 rounded-2xl bg-indigo-600/50 text-white rounded-br-sm flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Uploading attachment...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50/50 border-t">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <input 
            type="file" 
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" 
            className="hidden" 
            id="file-upload" 
            onChange={handleImageUpload} 
            disabled={uploading}
          />
          <Label htmlFor="file-upload" className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full border shadow-sm flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </Label>
          <Input 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste} 
            placeholder={uploading ? "Uploading file..." : "Type or paste image..."} 
            className="flex-1 rounded-full bg-white border-gray-200 shadow-sm focus-visible:ring-indigo-500 py-6 px-6"
            disabled={uploading}
          />
          <Button type="submit" size="icon" className="rounded-full w-12 h-12 shadow-md bg-indigo-600 hover:bg-indigo-700" disabled={!text.trim() || uploading}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

      <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center">
          {zoomedImage && (
            <div className="relative group">
              <img src={zoomedImage} alt="zoomed" className="max-w-full max-h-[85vh] rounded-lg object-contain" />
              <a 
                href={getDownloadUrl(zoomedImage)} 
                target="_blank" 
                rel="noreferrer" 
                download
                className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
