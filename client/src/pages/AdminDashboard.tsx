import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Calendar, Settings, MessageSquare, Download,
  Plus, Trash2, Edit, LogOut, BarChart3, BookOpen,
  MapPin, HelpCircle, Gift, Music, Phone
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  WeddingConfig, Guest, WeddingEvent, MessageLog,
  StoryMilestone, Venue, Faq
} from "@shared/schema";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: admin, isLoading: authLoading } = useQuery<{ admin: { userId: string; username: string } } | null>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  useEffect(() => {
    if (!authLoading && !admin) setLocation("/admin/login");
  }, [authLoading, admin, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => setLocation("/admin/login"),
  });

  const { data: config } = useQuery<WeddingConfig>({
    queryKey: ["/api/admin/config"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/admin/guests"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/admin/events"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: stories = [] } = useQuery<StoryMilestone[]>({
    queryKey: ["/api/admin/stories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/admin/venues"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/admin/faqs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  const { data: messageLogs = [] } = useQuery<MessageLog[]>({
    queryKey: ["/api/admin/message-logs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!admin) return null;

  const confirmed = guests.filter((g) => g.rsvpStatus === "confirmed");
  const declined = guests.filter((g) => g.rsvpStatus === "declined");
  const pending = guests.filter((g) => g.rsvpStatus === "pending");
  const totalAttending = confirmed.reduce((s, g) => s + g.adultsCount + g.childrenCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between" data-testid="admin-header">
        <h1 className="font-serif text-lg font-semibold text-card-foreground">Wedding Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{admin.admin.username}</span>
          <button
            onClick={() => logoutMutation.mutate()}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            data-testid="logout-button"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex-wrap h-auto gap-1" data-testid="admin-tabs">
            <TabsTrigger value="overview" data-testid="tab-overview"><BarChart3 size={14} className="mr-1" /> Overview</TabsTrigger>
            <TabsTrigger value="guests" data-testid="tab-guests"><Users size={14} className="mr-1" /> Guests</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events"><Calendar size={14} className="mr-1" /> Events</TabsTrigger>
            <TabsTrigger value="stories" data-testid="tab-stories"><BookOpen size={14} className="mr-1" /> Stories</TabsTrigger>
            <TabsTrigger value="venues" data-testid="tab-venues"><MapPin size={14} className="mr-1" /> Venues</TabsTrigger>
            <TabsTrigger value="faqs" data-testid="tab-faqs"><HelpCircle size={14} className="mr-1" /> FAQs</TabsTrigger>
            <TabsTrigger value="config" data-testid="tab-config"><Settings size={14} className="mr-1" /> Config</TabsTrigger>
            <TabsTrigger value="whatsapp" data-testid="tab-whatsapp"><MessageSquare size={14} className="mr-1" /> WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              guests={guests}
              confirmed={confirmed}
              declined={declined}
              pending={pending}
              totalAttending={totalAttending}
              events={events}
            />
          </TabsContent>

          <TabsContent value="guests">
            <GuestsTab guests={guests} qc={qc} toast={toast} />
          </TabsContent>

          <TabsContent value="events">
            <CrudTab
              title="Wedding Events"
              items={events}
              queryKey="/api/admin/events"
              fields={[
                { name: "title", label: "Title", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "startTime", label: "Start Time", type: "datetime-local" },
                { name: "endTime", label: "End Time", type: "datetime-local" },
                { name: "venueName", label: "Venue Name", type: "text" },
                { name: "venueAddress", label: "Venue Address", type: "text" },
                { name: "dressCode", label: "Dress Code", type: "text" },
                { name: "howToReach", label: "How to Reach", type: "textarea" },
                { name: "accommodation", label: "Accommodation", type: "textarea" },
                { name: "distanceInfo", label: "Distance Info", type: "text" },
                { name: "contactPerson", label: "Contact Person", type: "text" },
              ]}
              displayField="title"
              qc={qc}
              toast={toast}
              dateFields={["startTime", "endTime"]}
            />
          </TabsContent>

          <TabsContent value="stories">
            <CrudTab
              title="Story Milestones"
              items={stories}
              queryKey="/api/admin/stories"
              fields={[
                { name: "title", label: "Title", type: "text" },
                { name: "date", label: "Date/Period", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "imageUrl", label: "Image URL", type: "text" },
                { name: "sortOrder", label: "Sort Order", type: "number" },
              ]}
              displayField="title"
              qc={qc}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="venues">
            <CrudTab
              title="Venues"
              items={venues}
              queryKey="/api/admin/venues"
              fields={[
                { name: "name", label: "Name", type: "text" },
                { name: "address", label: "Address", type: "text" },
                { name: "description", label: "Description", type: "textarea" },
                { name: "mapUrl", label: "Google Maps URL", type: "text" },
                { name: "mapEmbedUrl", label: "Maps Embed URL", type: "text" },
                { name: "directions", label: "Travel Directions", type: "textarea" },
                { name: "accommodation", label: "Accommodation", type: "textarea" },
                { name: "contactInfo", label: "Contact Info", type: "text" },
              ]}
              displayField="name"
              qc={qc}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="faqs">
            <CrudTab
              title="FAQs"
              items={faqs}
              queryKey="/api/admin/faqs"
              fields={[
                { name: "question", label: "Question", type: "text" },
                { name: "answer", label: "Answer", type: "textarea" },
                { name: "category", label: "Category", type: "text" },
                { name: "sortOrder", label: "Sort Order", type: "number" },
              ]}
              displayField="question"
              qc={qc}
              toast={toast}
            />
          </TabsContent>

          <TabsContent value="config">
            <ConfigTab config={config} qc={qc} toast={toast} />
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppTab config={config} messageLogs={messageLogs} qc={qc} toast={toast} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="bg-card rounded-lg p-4 border border-card-border" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ guests, confirmed, declined, pending, totalAttending, events }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Guests" value={guests.length} icon={Users} />
        <StatCard label="Confirmed" value={confirmed.length} icon={Users} />
        <StatCard label="Pending" value={pending.length} icon={Users} />
        <StatCard label="Total Attending" value={totalAttending} icon={Users} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Declined" value={declined.length} icon={Users} />
        <StatCard label="Events" value={events.length} icon={Calendar} />
        <StatCard label="WhatsApp Opt-in" value={guests.filter((g: any) => g.whatsappOptIn).length} icon={MessageSquare} />
      </div>
    </div>
  );
}

function GuestsTab({ guests, qc, toast }: { guests: Guest[]; qc: any; toast: any }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "", side: "both" });

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/guests", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      toast({ title: "Guest added" });
      setShowAdd(false);
      setNewGuest({ name: "", email: "", phone: "", side: "both" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/guests/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      toast({ title: "Guest deleted" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Guest List ({guests.length})</h2>
        <div className="flex gap-2">
          <a
            href="/api/admin/guests/export"
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded flex items-center gap-1"
            data-testid="export-csv"
          >
            <Download size={12} /> Export CSV
          </a>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded flex items-center gap-1"
            data-testid="add-guest-button"
          >
            <Plus size={12} /> Add Guest
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-card border rounded-lg p-4 space-y-3" data-testid="add-guest-form">
          <input
            placeholder="Full Name"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
            data-testid="input-guest-name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Email"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              className="px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-guest-email"
            />
            <input
              placeholder="Phone"
              value={newGuest.phone}
              onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              className="px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-guest-phone"
            />
          </div>
          <select
            value={newGuest.side}
            onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
            data-testid="select-guest-side"
          >
            <option value="both">Both Sides</option>
            <option value="groom">Groom Side</option>
            <option value="bride">Bride Side</option>
          </select>
          <button
            onClick={() => addMutation.mutate(newGuest)}
            disabled={!newGuest.name || addMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded disabled:opacity-50"
            data-testid="save-guest"
          >
            {addMutation.isPending ? "Saving..." : "Save Guest"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="guests-table">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Phone</th>
              <th className="pb-2 pr-4">Side</th>
              <th className="pb-2 pr-4">RSVP</th>
              <th className="pb-2 pr-4">Guests</th>
              <th className="pb-2 pr-4">Invite Link</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {guests.map((g) => (
              <tr key={g.id} className="border-b border-border" data-testid={`guest-row-${g.id}`}>
                <td className="py-2 pr-4 text-foreground">{g.name}</td>
                <td className="py-2 pr-4 text-muted-foreground">{g.phone || "—"}</td>
                <td className="py-2 pr-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {g.side}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    g.rsvpStatus === "confirmed" ? "bg-green-100 text-green-800" :
                    g.rsvpStatus === "declined" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {g.rsvpStatus}
                  </span>
                </td>
                <td className="py-2 pr-4 text-muted-foreground text-xs">
                  {g.adultsCount}A + {g.childrenCount}C
                </td>
                <td className="py-2 pr-4">
                  <code className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    /invite/{g.inviteSlug}
                  </code>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => deleteMutation.mutate(g.id)}
                    className="text-destructive hover:text-destructive/80"
                    data-testid={`delete-guest-${g.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "datetime-local";
}

function CrudTab({
  title,
  items,
  queryKey,
  fields,
  displayField,
  qc,
  toast,
  dateFields = [],
}: {
  title: string;
  items: any[];
  queryKey: string;
  fields: FieldDef[];
  displayField: string;
  qc: any;
  toast: any;
  dateFields?: string[];
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const preparePayload = (data: Record<string, any>) => {
    const payload = { ...data };
    dateFields.forEach((f) => {
      if (payload[f]) {
        payload[f] = new Date(payload[f]).toISOString();
      }
    });
    if (payload.sortOrder !== undefined) {
      payload.sortOrder = Number(payload.sortOrder) || 0;
    }
    return payload;
  };

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", queryKey, preparePayload(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: `${title} item added` });
      setShowAdd(false);
      setFormData({});
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `${queryKey}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Item deleted" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title} ({items.length})</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded flex items-center gap-1"
          data-testid={`add-${title.toLowerCase().replace(/\s/g, "-")}`}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {showAdd && (
        <div className="bg-card border rounded-lg p-4 space-y-3" data-testid={`form-${title.toLowerCase().replace(/\s/g, "-")}`}>
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground resize-none"
                />
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value,
                  })}
                  className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                />
              )}
            </div>
          ))}
          <button
            onClick={() => addMutation.mutate(formData)}
            disabled={addMutation.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded disabled:opacity-50"
          >
            {addMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-card border rounded-lg p-4 flex items-center justify-between"
            data-testid={`item-${item.id}`}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item[displayField]}</p>
              {item.date && <p className="text-xs text-muted-foreground">{item.date}</p>}
              {item.startTime && (
                <p className="text-xs text-muted-foreground">
                  {new Date(item.startTime).toLocaleString()}
                </p>
              )}
              {item.category && (
                <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                  {item.category}
                </span>
              )}
            </div>
            <button
              onClick={() => deleteMutation.mutate(item.id)}
              className="text-destructive hover:text-destructive/80 ml-4"
              data-testid={`delete-item-${item.id}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigTab({ config, qc, toast }: { config: WeddingConfig | undefined; qc: any; toast: any }) {
  const [form, setForm] = useState({
    weddingDate: "",
    dateConfirmed: false,
    venueName: "",
    venueAddress: "",
    venueMapUrl: "",
    coupleStory: "",
    upiId: "",
    backgroundMusicUrl: "",
    groomPhone: "",
    bridePhone: "",
    groomWhatsapp: "",
    brideWhatsapp: "",
  });

  useEffect(() => {
    if (config) {
      setForm({
        weddingDate: config.weddingDate ? new Date(config.weddingDate).toISOString().slice(0, 16) : "",
        dateConfirmed: config.dateConfirmed,
        venueName: config.venueName,
        venueAddress: config.venueAddress,
        venueMapUrl: config.venueMapUrl,
        coupleStory: config.coupleStory,
        upiId: config.upiId || "",
        backgroundMusicUrl: config.backgroundMusicUrl || "",
        groomPhone: config.groomPhone || "",
        bridePhone: config.bridePhone || "",
        groomWhatsapp: config.groomWhatsapp || "",
        brideWhatsapp: config.brideWhatsapp || "",
      });
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload: any = { ...data };
      if (payload.weddingDate) {
        payload.weddingDate = new Date(payload.weddingDate).toISOString();
      } else {
        delete payload.weddingDate;
      }
      return apiRequest("PATCH", "/api/admin/config", payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/config"] });
      qc.invalidateQueries({ queryKey: ["/api/config"] });
      toast({ title: "Config saved" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Wedding Configuration</h2>
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Wedding Date</label>
          <input
            type="datetime-local"
            value={form.weddingDate}
            onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
            data-testid="input-wedding-date"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground" data-testid="config-date-confirmed">
          <input
            type="checkbox"
            checked={form.dateConfirmed}
            onChange={(e) => setForm({ ...form, dateConfirmed: e.target.checked })}
          />
          Date Confirmed
        </label>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Venue Name</label>
          <input
            value={form.venueName}
            onChange={(e) => setForm({ ...form, venueName: e.target.value })}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
            data-testid="input-venue-name"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Venue Address</label>
          <input
            value={form.venueAddress}
            onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
            data-testid="input-venue-address"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Couple Story</label>
          <textarea
            value={form.coupleStory}
            onChange={(e) => setForm({ ...form, coupleStory: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground resize-none"
            data-testid="input-couple-story"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Gift size={12} /> UPI ID
            </label>
            <input
              value={form.upiId}
              onChange={(e) => setForm({ ...form, upiId: e.target.value })}
              placeholder="yourname@upi"
              className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-upi-id"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Music size={12} /> Background Music
            </label>
            <div className="space-y-2">
              <input
                value={form.backgroundMusicUrl}
                onChange={(e) => setForm({ ...form, backgroundMusicUrl: e.target.value })}
                placeholder="Enter music URL or upload file below"
                className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                data-testid="input-music-url"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const dataUrl = event.target?.result as string;
                        setForm({ ...form, backgroundMusicUrl: dataUrl });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-muted-foreground file:mr-2 file:px-3 file:py-1 file:rounded file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground"
                  data-testid="input-music-file"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Upload MP3, WAV, or OGG file, or provide a direct URL to the audio file
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-foreground pt-2 flex items-center gap-2">
          <Phone size={14} /> Contact Numbers (Floating Chat Widget)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Groom Phone</label>
            <input
              value={form.groomPhone}
              onChange={(e) => setForm({ ...form, groomPhone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-groom-phone"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bride Phone</label>
            <input
              value={form.bridePhone}
              onChange={(e) => setForm({ ...form, bridePhone: e.target.value })}
              placeholder="+91 98765 43211"
              className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-bride-phone"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Groom WhatsApp</label>
            <input
              value={form.groomWhatsapp}
              onChange={(e) => setForm({ ...form, groomWhatsapp: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-groom-whatsapp"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Bride WhatsApp</label>
            <input
              value={form.brideWhatsapp}
              onChange={(e) => setForm({ ...form, brideWhatsapp: e.target.value })}
              placeholder="+91 98765 43211"
              className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
              data-testid="input-bride-whatsapp"
            />
          </div>
        </div>
        <button
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="px-6 py-2 bg-primary text-primary-foreground text-sm rounded disabled:opacity-50"
          data-testid="save-config"
        >
          {saveMutation.isPending ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}

function WhatsAppTab({ config, messageLogs, qc, toast }: { config: WeddingConfig | undefined; messageLogs: MessageLog[]; qc: any; toast: any }) {
  const toggleMutation = useMutation({
    mutationFn: (enabled: boolean) => apiRequest("POST", "/api/admin/whatsapp/toggle", { enabled }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "WhatsApp automation updated" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-sm font-semibold mb-4 text-foreground">WhatsApp Automation</h3>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground" data-testid="whatsapp-toggle">
            <input
              type="checkbox"
              checked={config?.whatsappEnabled || false}
              onChange={(e) => toggleMutation.mutate(e.target.checked)}
            />
            Enable automated WhatsApp reminders
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Requires WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_APP_SECRET environment variables.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-foreground">Message Logs ({messageLogs.length})</h3>
        <div className="space-y-2">
          {messageLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages sent yet.</p>
          ) : (
            messageLogs.map((log) => (
              <div key={log.id} className="bg-card border rounded-lg p-3 text-xs" data-testid={`log-${log.id}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{log.guestName}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    log.status === "sent" ? "bg-green-100 text-green-800" :
                    log.status === "failed" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">{log.messageType} — {log.templateName}</p>
                {log.errorMessage && <p className="text-destructive mt-1">{log.errorMessage}</p>}
                <p className="text-muted-foreground mt-1">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
