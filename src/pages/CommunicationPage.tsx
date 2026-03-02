import { useState } from 'react';
import { Bell, MessageSquare, Send } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockNotifications, mockMessages, mockStaff } from '@/data/mock';
import type { Notification, Message } from '@/types';
import { cn } from '@/lib/utils';

export default function CommunicationPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [messages, setMessages] = useState(mockMessages);
  const [composeOpen, setComposeOpen] = useState(false);
  const [msgForm, setMsgForm] = useState({ to: '', subject: '', body: '' });

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleSendMessage = () => {
    if (!msgForm.to || !msgForm.subject || !msgForm.body) return;
    setMessages(prev => [{
      id: String(Date.now()), from: 'Admin', to: msgForm.to,
      subject: msgForm.subject, body: msgForm.body, read: false,
      createdAt: new Date().toISOString(),
    }, ...prev]);
    setComposeOpen(false);
    setMsgForm({ to: '', subject: '', body: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Communication" description="Notifications et messagerie interne" />

      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Messagerie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
            {notifications.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucune notification</p>}
            {notifications.map(n => (
              <div
                key={n.id}
                className={cn('flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/30', !n.read && 'bg-muted/50')}
                onClick={() => markRead(n.id)}
              >
                <div className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                  n.type === 'success' && 'bg-success', n.type === 'warning' && 'bg-warning',
                  n.type === 'info' && 'bg-info', n.type === 'error' && 'bg-destructive'
                )} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-card-foreground">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                </div>
                {!n.read && <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-primary" />}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="mb-4">
            <Button onClick={() => setComposeOpen(true)}>
              <Send className="mr-2 h-4 w-4" />
              Nouveau message
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
            {messages.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucun message</p>}
            {messages.map(m => (
              <div key={m.id} className={cn('p-4', !m.read && 'bg-muted/50')}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-card-foreground">{m.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{m.to}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className="text-sm font-medium">{m.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.body}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Compose dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Nouveau message</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destinataire</Label>
              <Select value={msgForm.to} onValueChange={v => setMsgForm({ ...msgForm, to: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tout le personnel">Tout le personnel</SelectItem>
                  {mockStaff.map(s => <SelectItem key={s.id} value={`${s.firstName} ${s.lastName}`}>{s.lastName} {s.firstName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Objet</Label>
              <Input value={msgForm.subject} onChange={e => setMsgForm({ ...msgForm, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea rows={4} value={msgForm.body} onChange={e => setMsgForm({ ...msgForm, body: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setComposeOpen(false)}>Annuler</Button>
            <Button onClick={handleSendMessage}>Envoyer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
