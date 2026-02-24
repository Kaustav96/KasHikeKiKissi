/**
 * Admin Dashboard — Protected Route
 *
 * Tabs: Overview | Guests | Events | Configuration | WhatsApp Logs
 * All data mutates optimistically and invalidates relevant query caches.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Calendar, Settings, MessageSquare, Download, LogOut,
  Plus, Trash2, Edit2, Check, X, ToggleRight, ToggleLeft,
  MapPin, Clock, Heart, Loader2, Send, Eye, EyeOff, RefreshCw,
  ChevronUp, ChevronDown, AlertCircle, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiRequest } from "@/lib/queryClient";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Admin { userId: string; username: string }
interface WeddingConfig {
  id: string; weddingDate: string; dateConfirmed: boolean;
  venueName: string; venueAddress: string; venueMapUrl: string;
  coupleStory: string; whatsappEnabled: boolean;
}
interface Guest {
  id: string; name: string; email: string; phone: string; side: string;
  rsvpStatus: string; plusOne: boolean; plusOneName: string;
  dietaryRequirements: string; message: string; whatsappOptIn: boolean;
  tableNumber: number | null; inviteSlug: string; createdAt: string;
}
interface WeddingEvent {
  id: string; title: string; description: string; startTime: string;
  endTime: string | null; venueName: string; venueAddress: string;
  venueMapUrl: string; isMainEvent: boolean; dressCode: string; sortOrder: number;
}
interface MessageLog {
  id: string; guestName: string; phone: string; templateName: string;
  messageType: string; status: string; errorMessage: string; retryCount: number;
  sentAt: string | null; createdAt: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    sent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    duplicate: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const style = styles[status] || "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}

function formatDateTime(dt: string) {
  return new Date(dt).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ config, guests, events }: { config: WeddingConfig | undefined; guests: Guest[]; events: WeddingEvent[] }) {
  const confirmed = guests.filter((g) => g.rsvpStatus === "confirmed").length;
  const declined = guests.filter((g) => g.rsvpStatus === "declined").length;
  const pending = guests.filter((g) => g.rsvpStatus === "pending").length;
  const whatsappOptedIn = guests.filter((g) => g.whatsappOptIn).length;

  const stats = [
    { label: "Total Guests", value: guests.length, icon: Users, color: "text-blue-500" },
    { label: "Confirmed", value: confirmed, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Pending", value: pending, icon: AlertCircle, color: "text-amber-500" },
    { label: "Declined", value: declined, icon: X, color: "text-red-500" },
    { label: "WhatsApp Opted In", value: whatsappOptedIn, icon: MessageSquare, color: "text-green-500" },
    { label: "Events", value: events.length, icon: Calendar, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6" data-testid="tab-overview">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-card-border" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-md bg-muted flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-serif">{s.value}</p>
                <p className="text-muted-foreground text-xs font-sans">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wedding details */}
      {config && (
        <Card className="border-card-border">
          <CardHeader className="pb-3">
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Wedding Details
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-muted-foreground">Date: </span>
                <span className="text-foreground font-medium">
                  {new Date(config.weddingDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                {config.dateConfirmed ? (
                  <Badge variant="default" className="ml-2 text-xs">Confirmed</Badge>
                ) : (
                  <Badge variant="secondary" className="ml-2 text-xs">TBD</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-muted-foreground">Venue: </span>
                <span className="text-foreground font-medium">{config.venueName}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="text-muted-foreground">WhatsApp Automation: </span>
                <StatusBadge status={config.whatsappEnabled ? "sent" : "declined"} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSVP breakdown */}
      <Card className="border-card-border">
        <CardHeader className="pb-3">
          <h3 className="font-serif text-lg font-bold text-foreground">RSVP Breakdown</h3>
        </CardHeader>
        <CardContent>
          {guests.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No guests yet</p>
          ) : (
            <div className="space-y-2">
              {[
                { label: "Confirmed", count: confirmed, total: guests.length, color: "bg-emerald-500" },
                { label: "Pending", count: pending, total: guests.length, color: "bg-amber-500" },
                { label: "Declined", count: declined, total: guests.length, color: "bg-red-400" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-sans">{item.label}</span>
                    <span className="text-foreground font-medium">{item.count}/{item.total}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: item.total > 0 ? `${(item.count / item.total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Guests Tab ───────────────────────────────────────────────────────────────
function GuestsTab({ guests, onRefresh }: { guests: Guest[]; onRefresh: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Guest>>({});
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "", side: "both" as const });

  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || g.rsvpStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/guests/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] }); toast({ title: "Guest removed" }); },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newGuest) => apiRequest("POST", "/api/admin/guests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      setShowForm(false);
      setNewGuest({ name: "", email: "", phone: "", side: "both" });
      toast({ title: "Guest added" });
    },
    onError: (e) => toast({ title: "Failed to add guest", description: (e as Error).message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Guest> }) =>
      apiRequest("PATCH", `/api/admin/guests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      setEditingId(null);
      toast({ title: "Guest updated" });
    },
  });

  return (
    <div className="space-y-4" data-testid="tab-guests">
      {/* Header actions */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Search guests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
            data-testid="input-guest-search"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36" data-testid="select-rsvp-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/admin/guests/export" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" data-testid="button-export-csv">
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </a>
          <Button size="sm" onClick={() => setShowForm((v) => !v)} data-testid="button-add-guest">
            <Plus className="w-4 h-4 mr-1" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Add guest form */}
      {showForm && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-medium text-sm text-foreground">New Guest</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name *</Label>
                <Input
                  value={newGuest.name}
                  onChange={(e) => setNewGuest((g) => ({ ...g, name: e.target.value }))}
                  placeholder="Full name"
                  className="mt-1"
                  data-testid="input-new-guest-name"
                />
              </div>
              <div>
                <Label className="text-xs">Side</Label>
                <Select value={newGuest.side} onValueChange={(v: any) => setNewGuest((g) => ({ ...g, side: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride's Side</SelectItem>
                    <SelectItem value="groom">Groom's Side</SelectItem>
                    <SelectItem value="both">Both Sides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input
                  value={newGuest.email}
                  onChange={(e) => setNewGuest((g) => ({ ...g, email: e.target.value }))}
                  placeholder="email@example.com"
                  type="email"
                  className="mt-1"
                  data-testid="input-new-guest-email"
                />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest((g) => ({ ...g, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                  data-testid="input-new-guest-phone"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} data-testid="button-cancel-guest">Cancel</Button>
              <Button size="sm" onClick={() => createMutation.mutate(newGuest)} disabled={!newGuest.name || createMutation.isPending} data-testid="button-save-guest">
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Guest"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Guest list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="guests-empty">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No guests found</p>
          </div>
        ) : (
          filtered.map((guest) => (
            <Card key={guest.id} className="border-card-border" data-testid={`guest-card-${guest.id}`}>
              <CardContent className="p-4">
                {editingId === guest.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input
                          value={editData.name ?? guest.name}
                          onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                          className="mt-1 h-8 text-sm"
                          data-testid={`input-edit-name-${guest.id}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">RSVP Status</Label>
                        <Select
                          value={editData.rsvpStatus ?? guest.rsvpStatus}
                          onValueChange={(v) => setEditData((d) => ({ ...d, rsvpStatus: v }))}
                        >
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Phone</Label>
                        <Input
                          value={editData.phone ?? guest.phone}
                          onChange={(e) => setEditData((d) => ({ ...d, phone: e.target.value }))}
                          className="mt-1 h-8 text-sm"
                          data-testid={`input-edit-phone-${guest.id}`}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Table #</Label>
                        <Input
                          type="number"
                          value={editData.tableNumber ?? guest.tableNumber ?? ""}
                          onChange={(e) => setEditData((d) => ({ ...d, tableNumber: e.target.value ? Number(e.target.value) : null }))}
                          className="mt-1 h-8 text-sm"
                          data-testid={`input-edit-table-${guest.id}`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditData({}); }}>Cancel</Button>
                      <Button size="sm" onClick={() => updateMutation.mutate({ id: guest.id, data: editData })} disabled={updateMutation.isPending} data-testid={`button-save-guest-${guest.id}`}>
                        {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground text-sm font-sans" data-testid={`guest-name-${guest.id}`}>{guest.name}</p>
                        <StatusBadge status={guest.rsvpStatus} />
                        {guest.whatsappOptIn && (
                          <Badge variant="outline" className="text-xs border-green-300 text-green-600 dark:border-green-700 dark:text-green-400">
                            WhatsApp
                          </Badge>
                        )}
                        {guest.plusOne && (
                          <Badge variant="secondary" className="text-xs">+1</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {guest.email && <span>{guest.email}</span>}
                        {guest.phone && <span>{guest.phone}</span>}
                        {guest.tableNumber && <span>Table {guest.tableNumber}</span>}
                        <span className="capitalize">{guest.side}'s side</span>
                      </div>
                      <div className="text-xs text-muted-foreground/60">
                        Invite: <span className="font-mono text-xs">/invite/{guest.inviteSlug}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingId(guest.id); setEditData({}); }}
                        data-testid={`button-edit-guest-${guest.id}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(guest.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-guest-${guest.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────
function EventsTab({ events }: { events: WeddingEvent[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", startTime: "", endTime: "",
    venueName: "", venueAddress: "", venueMapUrl: "",
    isMainEvent: false, dressCode: "", sortOrder: 0,
  });

  const resetForm = () => setForm({
    title: "", description: "", startTime: "", endTime: "",
    venueName: "", venueAddress: "", venueMapUrl: "",
    isMainEvent: false, dressCode: "", sortOrder: 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => apiRequest("POST", "/api/admin/events", {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setShowForm(false);
      resetForm();
      toast({ title: "Event created" });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) =>
      apiRequest("PATCH", `/api/admin/events/${id}`, {
        ...data,
        startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
        endTime: data.endTime ? new Date(data.endTime).toISOString() : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setEditId(null);
      resetForm();
      toast({ title: "Event updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Event removed" });
    },
  });

  const toLocalDateTime = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const EventForm = ({ onSave, onCancel, saving }: { onSave: () => void; onCancel: () => void; saving: boolean }) => (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Event Title *</Label>
            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Wedding Ceremony" className="mt-1" data-testid="input-event-title" />
          </div>
          <div>
            <Label className="text-xs">Start Date & Time *</Label>
            <Input type="datetime-local" value={form.startTime} onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))} className="mt-1" data-testid="input-event-start" />
          </div>
          <div>
            <Label className="text-xs">End Date & Time</Label>
            <Input type="datetime-local" value={form.endTime} onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))} className="mt-1" data-testid="input-event-end" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className="mt-1" data-testid="input-event-description" />
          </div>
          <div>
            <Label className="text-xs">Venue Name</Label>
            <Input value={form.venueName} onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))} className="mt-1" data-testid="input-event-venue" />
          </div>
          <div>
            <Label className="text-xs">Dress Code</Label>
            <Input value={form.dressCode} onChange={(e) => setForm((f) => ({ ...f, dressCode: e.target.value }))} placeholder="e.g. Smart Casual" className="mt-1" data-testid="input-event-dresscode" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Venue Address</Label>
            <Input value={form.venueAddress} onChange={(e) => setForm((f) => ({ ...f, venueAddress: e.target.value }))} className="mt-1" data-testid="input-event-address" />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={form.isMainEvent}
              onCheckedChange={(v) => setForm((f) => ({ ...f, isMainEvent: v }))}
              data-testid="switch-event-main"
            />
            <Label className="text-xs">Main ceremony event</Label>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={onSave} disabled={!form.title || !form.startTime || saving} data-testid="button-save-event">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4" data-testid="tab-events">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-foreground">Wedding Events</h3>
        <Button size="sm" onClick={() => { setShowForm(true); setEditId(null); resetForm(); }} data-testid="button-add-event">
          <Plus className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>

      {showForm && !editId && (
        <EventForm
          onSave={() => createMutation.mutate(form)}
          onCancel={() => { setShowForm(false); resetForm(); }}
          saving={createMutation.isPending}
        />
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground" data-testid="events-empty">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No events yet</p>
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} data-testid={`event-card-${ev.id}`}>
              {editId === ev.id ? (
                <EventForm
                  onSave={() => updateMutation.mutate({ id: ev.id, data: form })}
                  onCancel={() => { setEditId(null); resetForm(); }}
                  saving={updateMutation.isPending}
                />
              ) : (
                <Card className="border-card-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground font-sans">{ev.title}</p>
                          {ev.isMainEvent && <Badge variant="default" className="text-xs">Main</Badge>}
                          {ev.dressCode && <Badge variant="secondary" className="text-xs">{ev.dressCode}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(ev.startTime)}
                          {ev.endTime && ` – ${new Date(ev.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                        </p>
                        {ev.venueName && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{ev.venueName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditId(ev.id);
                            setShowForm(false);
                            setForm({
                              title: ev.title, description: ev.description,
                              startTime: toLocalDateTime(ev.startTime),
                              endTime: ev.endTime ? toLocalDateTime(ev.endTime) : "",
                              venueName: ev.venueName, venueAddress: ev.venueAddress,
                              venueMapUrl: ev.venueMapUrl, isMainEvent: ev.isMainEvent,
                              dressCode: ev.dressCode, sortOrder: ev.sortOrder,
                            });
                          }}
                          data-testid={`button-edit-event-${ev.id}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(ev.id)}
                          data-testid={`button-delete-event-${ev.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Config Tab ───────────────────────────────────────────────────────────────
function ConfigTab({ config }: { config: WeddingConfig | undefined }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    weddingDate: "",
    dateConfirmed: false,
    venueName: "",
    venueAddress: "",
    venueMapUrl: "",
    coupleStory: "",
    whatsappEnabled: false,
  });

  useEffect(() => {
    if (config) {
      const d = new Date(config.weddingDate);
      const pad = (n: number) => String(n).padStart(2, "0");
      setForm({
        weddingDate: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
        dateConfirmed: config.dateConfirmed,
        venueName: config.venueName,
        venueAddress: config.venueAddress,
        venueMapUrl: config.venueMapUrl,
        coupleStory: config.coupleStory,
        whatsappEnabled: config.whatsappEnabled,
      });
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) =>
      apiRequest("PATCH", "/api/admin/config", {
        ...data,
        weddingDate: data.weddingDate ? new Date(data.weddingDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      toast({ title: "Configuration saved" });
    },
    onError: (e) => toast({ title: "Error", description: (e as Error).message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6" data-testid="tab-config">
      <Card className="border-card-border">
        <CardHeader className="pb-4">
          <h3 className="font-serif text-lg font-bold text-foreground">Wedding Configuration</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Wedding Date & Time *</Label>
              <Input
                type="datetime-local"
                value={form.weddingDate}
                onChange={(e) => setForm((f) => ({ ...f, weddingDate: e.target.value }))}
                className="mt-1"
                data-testid="input-config-date"
              />
            </div>
            <div className="flex items-end gap-3 pb-1">
              <Switch
                checked={form.dateConfirmed}
                onCheckedChange={(v) => setForm((f) => ({ ...f, dateConfirmed: v }))}
                data-testid="switch-config-date-confirmed"
              />
              <div>
                <p className="text-sm font-medium text-foreground">Date Confirmed</p>
                <p className="text-muted-foreground text-xs">Enables countdown on public site</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Venue Name</Label>
              <Input value={form.venueName} onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))} className="mt-1" data-testid="input-config-venue" />
            </div>
            <div>
              <Label className="text-xs">Venue Map URL</Label>
              <Input value={form.venueMapUrl} onChange={(e) => setForm((f) => ({ ...f, venueMapUrl: e.target.value }))} placeholder="https://maps.google.com/..." className="mt-1" data-testid="input-config-mapurl" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Venue Address</Label>
            <Input value={form.venueAddress} onChange={(e) => setForm((f) => ({ ...f, venueAddress: e.target.value }))} className="mt-1" data-testid="input-config-address" />
          </div>

          <div>
            <Label className="text-xs">Couple's Story</Label>
            <Textarea
              value={form.coupleStory}
              onChange={(e) => setForm((f) => ({ ...f, coupleStory: e.target.value }))}
              rows={6}
              placeholder="Tell your love story..."
              className="mt-1"
              data-testid="input-config-story"
            />
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Switch
              checked={form.whatsappEnabled}
              onCheckedChange={(v) => setForm((f) => ({ ...f, whatsappEnabled: v }))}
              data-testid="switch-config-whatsapp"
            />
            <div>
              <p className="text-sm font-medium text-foreground">WhatsApp Automation</p>
              <p className="text-muted-foreground text-xs">
                Enable to send automated reminders and confirmations via WhatsApp Cloud API
              </p>
            </div>
          </div>

          <Button
            onClick={() => saveMutation.mutate(form)}
            disabled={saveMutation.isPending}
            data-testid="button-save-config"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── WhatsApp Logs Tab ────────────────────────────────────────────────────────
function WhatsAppTab({ config }: { config: WeddingConfig | undefined }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: logs = [], isLoading, refetch } = useQuery<MessageLog[]>({
    queryKey: ["/api/admin/message-logs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/message-logs");
      if (!res.ok) throw new Error("Failed to load logs");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      apiRequest("POST", "/api/admin/whatsapp/toggle", { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: `WhatsApp automation ${config?.whatsappEnabled ? "disabled" : "enabled"}` });
    },
  });

  const statusCounts = {
    sent: logs.filter((l) => l.status === "sent").length,
    failed: logs.filter((l) => l.status === "failed").length,
    pending: logs.filter((l) => l.status === "pending").length,
  };

  return (
    <div className="space-y-6" data-testid="tab-whatsapp">
      {/* Status card */}
      <Card className="border-card-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-foreground text-sm font-sans">WhatsApp Automation</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {config?.whatsappEnabled
                  ? "Enabled — sending reminders and confirmations automatically"
                  : "Disabled — no automatic messages will be sent"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={config?.whatsappEnabled ?? false}
                onCheckedChange={(v) => toggleMutation.mutate(v)}
                disabled={toggleMutation.isPending}
                data-testid="switch-whatsapp-global"
              />
              <span className={`text-xs font-sans font-medium ${config?.whatsappEnabled ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                {config?.whatsappEnabled ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sent", count: statusCounts.sent, color: "text-emerald-500" },
          { label: "Pending", count: statusCounts.pending, color: "text-amber-500" },
          { label: "Failed", count: statusCounts.failed, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="border-card-border">
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold font-serif ${s.color}`}>{s.count}</p>
              <p className="text-muted-foreground text-xs font-sans">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log list */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base font-bold text-foreground">Message Logs</h3>
        <Button variant="ghost" size="sm" onClick={() => refetch()} data-testid="button-refresh-logs">
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground" data-testid="logs-empty">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No messages sent yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="border-card-border" data-testid={`log-${log.id}`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground font-sans">{log.guestName}</p>
                      <StatusBadge status={log.status} />
                      <span className="text-xs text-muted-foreground font-mono">{log.messageType}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.phone} · Template: {log.templateName}</p>
                    {log.errorMessage && (
                      <p className="text-xs text-destructive">{log.errorMessage}</p>
                    )}
                    <p className="text-xs text-muted-foreground/60">
                      {formatDateTime(log.createdAt)}
                      {log.retryCount > 0 && ` · ${log.retryCount} retries`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Auth check
  const { data: authData, isLoading: authLoading, isError: authError } = useQuery<{ admin: Admin }>({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });

  const { data: config } = useQuery<WeddingConfig>({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const res = await fetch("/api/admin/config");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!authData,
  });

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/admin/guests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/guests");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!authData,
  });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/admin/events"],
    queryFn: async () => {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!authData,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => {
      queryClient.clear();
      navigate("/admin/login");
    },
  });

  useEffect(() => {
    if (authError) navigate("/admin/login");
  }, [authError, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authData) return null;

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="admin-dashboard">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="font-serif font-bold text-foreground">Admin</span>
            <span className="text-muted-foreground text-xs hidden sm:block">· Kaustav & Himasree</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank">
              <Button variant="ghost" size="sm" data-testid="button-view-site">
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">View Site</span>
              </Button>
            </a>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground">Wedding Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Logged in as <strong>{authData.admin.username}</strong>
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full" data-testid="admin-tabs">
            <TabsTrigger value="overview" data-testid="tab-trigger-overview">
              <Heart className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="guests" data-testid="tab-trigger-guests">
              <Users className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Guests</span>
            </TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-trigger-events">
              <Calendar className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="config" data-testid="tab-trigger-config">
              <Settings className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" data-testid="tab-trigger-whatsapp">
              <MessageSquare className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab config={config} guests={guests} events={events} />
          </TabsContent>
          <TabsContent value="guests">
            <GuestsTab guests={guests} onRefresh={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/guests"] })} />
          </TabsContent>
          <TabsContent value="events">
            <EventsTab events={events} />
          </TabsContent>
          <TabsContent value="config">
            <ConfigTab config={config} />
          </TabsContent>
          <TabsContent value="whatsapp">
            <WhatsAppTab config={config} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
