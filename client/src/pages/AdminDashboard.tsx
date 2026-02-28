import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Users, Calendar, Settings, Download,
  Plus, Trash2, Edit, LogOut, BarChart3, BookOpen,
  MapPin, HelpCircle, Gift, Music, Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  WeddingConfig, Guest, WeddingEvent,
  StoryMilestone, Venue, Faq
} from "../../../shared/schema.js";

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
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/admin/guests"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/admin/events"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: stories = [] } = useQuery<StoryMilestone[]>({
    queryKey: ["/api/admin/stories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/admin/venues"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/admin/faqs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
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

  // Total attending is just the number of confirmed guests
  const totalAttending = confirmed.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-3 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2" data-testid="admin-header">
        <h1 className="font-serif text-base sm:text-lg font-semibold text-card-foreground">Wedding Admin</h1>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">{admin.admin.username}</span>
          <button
            onClick={() => logoutMutation.mutate()}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            data-testid="logout-button"
          >
            <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-4 sm:mb-6 flex-wrap h-auto gap-1 w-full justify-start" data-testid="admin-tabs">
            <TabsTrigger value="overview" data-testid="tab-overview" className="text-xs"><BarChart3 size={14} className="mr-1" /> <span className="hidden sm:inline">Overview</span></TabsTrigger>
            <TabsTrigger value="guests" data-testid="tab-guests" className="text-xs"><Users size={14} className="mr-1" /> Guests</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events" className="text-xs"><Calendar size={14} className="mr-1" /> Events</TabsTrigger>
            <TabsTrigger value="stories" data-testid="tab-stories" className="text-xs"><BookOpen size={14} className="mr-1" /> <span className="hidden sm:inline">Stories</span></TabsTrigger>
            <TabsTrigger value="venues" data-testid="tab-venues" className="text-xs"><MapPin size={14} className="mr-1" /> <span className="hidden sm:inline">Venues</span></TabsTrigger>
            <TabsTrigger value="faqs" data-testid="tab-faqs" className="text-xs"><HelpCircle size={14} className="mr-1" /> FAQs</TabsTrigger>
            <TabsTrigger value="config" data-testid="tab-config" className="text-xs"><Settings size={14} className="mr-1" /> Config</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              guests={guests}
              confirmed={confirmed}
              declined={declined}
              pending={pending}
              totalAttending={totalAttending}
              events={events}
              config={config}
            />
          </TabsContent>

          <TabsContent value="guests">
            <GuestsTab guests={guests} events={events} qc={qc} toast={toast} />
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
                { name: "venueMapUrl", label: "Map URL", type: "text" },
                { name: "dressCode", label: "Dress Code", type: "text" },
                { name: "side", label: "Side (groom/bride/both)", type: "text" },
                { name: "isMainEvent", label: "Is Main Event", type: "radio", options: [{value: "true", label: "True"}, {value: "false", label: "False"}] },
                { name: "sortOrder", label: "Sort Order", type: "number" },
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

function OverviewTab({ guests, confirmed, declined, pending, totalAttending, events, config }: any) {
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
        <StatCard label="Website Views" value={config?.viewCount || 0} icon={Eye} />
      </div>
    </div>
  );
}

function GuestsTab({ guests, events, qc, toast }: { guests: Guest[]; events: WeddingEvent[]; qc: any; toast: any }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", side: "both" });
  const [eventFilter, setEventFilter] = useState<string>("");
  const [foodFilter, setFoodFilter] = useState<string>("");
  const [sideFilter, setSideFilter] = useState<string>("");

  // Create event map for name lookup
  const eventMap = new Map(events.map(e => [e.id, e.title]));

  // Filter guests
  const filteredGuests = guests.filter(g => {
    if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
    if (foodFilter && g.foodPreference !== foodFilter) return false;
    if (sideFilter && g.side !== sideFilter) return false;
    return true;
  });

  // Calculate counts for each event based on current filters
  const eventCounts = events.map(event => ({
    id: event.id,
    title: event.title,
    count: guests.filter(g => {
      // Apply food filter if active
      if (foodFilter && g.foodPreference !== foodFilter) return false;
      // Apply side filter if active
      if (sideFilter && g.side !== sideFilter) return false;
      // Check if guest is attending this event
      return g.eventsAttending.includes(event.id);
    }).length,
  }));

  // Calculate counts for each food preference based on current filters
  const foodCounts = [
    {
      value: "vegetarian",
      label: "Vegetarian",
      count: guests.filter(g => {
        if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
        if (sideFilter && g.side !== sideFilter) return false;
        return g.foodPreference === "vegetarian";
      }).length
    },
    {
      value: "non-vegetarian",
      label: "Non-Vegetarian",
      count: guests.filter(g => {
        if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
        if (sideFilter && g.side !== sideFilter) return false;
        return g.foodPreference === "non-vegetarian";
      }).length
    },
  ];

  // Calculate counts for each side
  const sideCounts = [
    { value: "groom", label: "Groom", count: guests.filter(g => {
      if (g.rsvpStatus === "declined") return false;
      if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
      if (foodFilter && g.foodPreference !== foodFilter) return false;
      return g.side === "groom";
    }).length },
    { value: "bride", label: "Bride", count: guests.filter(g => {
      if (g.rsvpStatus === "declined") return false;
      if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
      if (foodFilter && g.foodPreference !== foodFilter) return false;
      return g.side === "bride";
    }).length },
    { value: "both", label: "Both", count: guests.filter(g => {
      if (g.rsvpStatus === "declined") return false;
      if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
      if (foodFilter && g.foodPreference !== foodFilter) return false;
      return g.side === "both";
    }).length },
  ];

  // Calculate total guests from filtered confirmed guests
  const totalGuests = filteredGuests.filter(g => g.rsvpStatus === "confirmed").length;

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/guests", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/guests"] });
      toast({ title: "Guest added" });
      setShowAdd(false);
      setNewGuest({ name: "", side: "both" });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Guest List ({filteredGuests.length})</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Total Confirmed: {totalGuests}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href={`/api/admin/guests/export?event=${eventFilter}&food=${foodFilter}&side=${sideFilter}`}
            className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded flex items-center gap-1 whitespace-nowrap"
            data-testid="export-csv"
          >
            <Download size={12} /> <span className="hidden sm:inline">Export</span> CSV
          </a>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded flex items-center gap-1 whitespace-nowrap"
            data-testid="add-guest-button"
          >
            <Plus size={12} /> Add Guest
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card border rounded-lg p-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Event</label>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
          >
            <option value="">All Events</option>
            {eventCounts.map(ec => (
              <option key={ec.id} value={ec.id}>
                {ec.title} ({ec.count} guests)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Food Preference</label>
          <select
            value={foodFilter}
            onChange={(e) => setFoodFilter(e.target.value)}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
          >
            <option value="">All Preferences</option>
            {foodCounts.map(fc => (
              <option key={fc.value} value={fc.value}>
                {fc.label} ({fc.count} guests)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Filter by Side</label>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
          >
            <option value="">All Sides</option>
            {sideCounts.map(sc => (
              <option key={sc.value} value={sc.value}>
                {sc.label} ({sc.count} guests)
              </option>
            ))}
          </select>
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

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full text-sm min-w-[640px]" data-testid="guests-table">
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th className="pb-2 pr-2 sm:pr-4 pl-3 sm:pl-0">Name</th>
              <th className="pb-2 pr-2 sm:pr-4">Side</th>
              <th className="pb-2 pr-2 sm:pr-4">RSVP</th>
              <th className="pb-2 pr-2 sm:pr-4 hidden md:table-cell">Events</th>
              <th className="pb-2 pr-2 sm:pr-4 hidden lg:table-cell">Food</th>
              <th className="pb-2 pr-2 sm:pr-4 hidden xl:table-cell">Invite Link</th>
              <th className="pb-2 pr-3 sm:pr-0"></th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.map((g) => {
              const guestEventIds = g.eventsAttending.split(",").filter(Boolean);
              const guestEventNames = guestEventIds.map(id => eventMap.get(id) || "").filter(Boolean);

              return (
                <tr key={g.id} className="border-b border-border" data-testid={`guest-row-${g.id}`}>
                  <td className="py-2 pr-2 sm:pr-4 pl-3 sm:pl-0 text-foreground">{g.name}</td>
                  <td className="py-2 pr-2 sm:pr-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {g.side}
                    </span>
                  </td>
                  <td className="py-2 pr-2 sm:pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      g.rsvpStatus === "confirmed" ? "bg-green-100 text-green-800" :
                      g.rsvpStatus === "declined" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {g.rsvpStatus}
                    </span>
                  </td>
                  <td className="py-2 pr-2 sm:pr-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {guestEventNames.length > 0 ? (
                        guestEventNames.map((name, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 pr-2 sm:pr-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground capitalize">
                      {g.foodPreference || "—"}
                    </span>
                  </td>
                  <td className="py-2 pr-2 sm:pr-4 hidden xl:table-cell">
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "datetime-local" | "radio";
  options?: { value: string; label: string }[];
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
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest("PATCH", `${queryKey}/${id}`, preparePayload(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: `${title} item updated` });
      setEditingId(null);
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

  const startEdit = (item: any) => {
    setEditingId(item.id);
    const editData: Record<string, any> = {};
    fields.forEach((field) => {
      let value = item[field.name];
      if (dateFields.includes(field.name) && value) {
        value = new Date(value).toISOString().slice(0, 16);
      }
      editData[field.name] = value || "";
    });
    setFormData(editData);
    setShowAdd(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

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
              ) : field.type === "radio" && field.options ? (
                <div className="flex gap-4">
                  {field.options.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={formData[field.name] === option.value}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
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
            className="bg-card border rounded-lg p-4"
            data-testid={`item-${item.id}`}
          >
            {editingId === item.id ? (
              <div className="space-y-3">
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
                    ) : field.type === "radio" && field.options ? (
                      <div className="flex gap-4">
                        {field.options.map(option => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={field.name}
                              value={option.value}
                              checked={formData[field.name] === option.value}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-foreground">{option.label}</span>
                          </label>
                        ))}
                      </div>
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
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMutation.mutate({ id: item.id, data: formData })}
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded disabled:opacity-50"
                  >
                    {updateMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-muted text-muted-foreground text-sm rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => startEdit(item)}>
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
                  <p className="text-[10px] text-muted-foreground mt-1 italic">Click to edit</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-destructive hover:text-destructive/80 ml-4"
                  data-testid={`delete-item-${item.id}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigTab({ config, qc, toast }: { config: WeddingConfig | undefined; qc: any; toast: any }) {
  const [form, setForm] = useState({
    weddingDate: "",
    dateToBeDecided: true,
    dateConfirmed: false,
    coupleStory: "",
    upiId: "",
    backgroundMusicUrl: "",
    groomMusicUrls: [] as string[],
    brideMusicUrls: [] as string[],
  });

  useEffect(() => {
    if (config) {
      setForm({
        weddingDate: config.weddingDate ? new Date(config.weddingDate).toISOString().slice(0, 16) : "",
        dateToBeDecided: true, // Always default to TBD checked
        dateConfirmed: false, // Always default to unchecked
        coupleStory: config.coupleStory,
        upiId: config.upiId || "",
        backgroundMusicUrl: config.backgroundMusicUrl || "",
        groomMusicUrls: Array.isArray(config.groomMusicUrls) ? config.groomMusicUrls : [],
        brideMusicUrls: Array.isArray(config.brideMusicUrls) ? config.brideMusicUrls : [],
      });
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload: any = { ...data };
      // Only include date if not "to be decided"
      if (!data.dateToBeDecided && payload.weddingDate) {
        payload.weddingDate = new Date(payload.weddingDate).toISOString();
      } else {
        delete payload.weddingDate;
        payload.dateConfirmed = false; // If date is TBD, can't be confirmed
      }
      // Remove dateToBeDecided from payload (not in DB)
      delete payload.dateToBeDecided;
      // Ensure music arrays are properly sent
      payload.groomMusicUrls = Array.isArray(data.groomMusicUrls) ? data.groomMusicUrls.filter(Boolean) : [];
      payload.brideMusicUrls = Array.isArray(data.brideMusicUrls) ? data.brideMusicUrls.filter(Boolean) : [];
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
        <label className="flex items-center gap-2 text-sm text-foreground" data-testid="config-date-tbd">
          <input
            type="checkbox"
            checked={form.dateToBeDecided}
            onChange={(e) => {
              if (e.target.checked) {
                setForm({ ...form, dateToBeDecided: true, dateConfirmed: false, weddingDate: "" });
              } else {
                setForm({ ...form, dateToBeDecided: false });
              }
            }}
          />
          Date To Be Decided
        </label>
        {!form.dateToBeDecided && (
          <div className="space-y-3">
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
              Date Confirmed (Show countdown instead of TBD)
            </label>
          </div>
        )}
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
              <Music size={12} /> Background Music (Fallback)
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
                Fallback music when theme-specific music is not set
              </p>
            </div>
          </div>

          {/* Groom Music Playlist */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Music size={12} /> Groom Side Music Playlist
            </label>
            <div className="space-y-2">
              {form.groomMusicUrls.map((url, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      value={url}
                      onChange={(e) => {
                        const updated = [...form.groomMusicUrls];
                        updated[idx] = e.target.value;
                        setForm({ ...form, groomMusicUrls: updated });
                      }}
                      placeholder="Music URL or upload below"
                      className="flex-1 px-3 py-2 rounded bg-background border text-sm text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.groomMusicUrls.filter((_, i) => i !== idx);
                        setForm({ ...form, groomMusicUrls: updated });
                      }}
                      className="px-3 py-2 rounded bg-destructive text-destructive-foreground text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result as string;
                          const updated = [...form.groomMusicUrls];
                          updated[idx] = dataUrl;
                          setForm({ ...form, groomMusicUrls: updated });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-muted-foreground file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, groomMusicUrls: [...form.groomMusicUrls, ''] })}
                className="px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs"
              >
                + Add Music Track
              </button>
              <p className="text-[10px] text-muted-foreground">
                Music that plays when viewing groom's side
              </p>
            </div>
          </div>

          {/* Bride Music Playlist */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Music size={12} /> Bride Side Music Playlist
            </label>
            <div className="space-y-2">
              {form.brideMusicUrls.map((url, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      value={url}
                      onChange={(e) => {
                        const updated = [...form.brideMusicUrls];
                        updated[idx] = e.target.value;
                        setForm({ ...form, brideMusicUrls: updated });
                      }}
                      placeholder="Music URL or upload below"
                      className="flex-1 px-3 py-2 rounded bg-background border text-sm text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.brideMusicUrls.filter((_, i) => i !== idx);
                        setForm({ ...form, brideMusicUrls: updated });
                      }}
                      className="px-3 py-2 rounded bg-destructive text-destructive-foreground text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result as string;
                          const updated = [...form.brideMusicUrls];
                          updated[idx] = dataUrl;
                          setForm({ ...form, brideMusicUrls: updated });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-muted-foreground file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:text-xs file:bg-secondary file:text-secondary-foreground"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, brideMusicUrls: [...form.brideMusicUrls, ''] })}
                className="px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs"
              >
                + Add Music Track
              </button>
              <p className="text-[10px] text-muted-foreground">
                Music that plays when viewing bride's side
              </p>
            </div>
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
