import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
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
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    refetchInterval: 10000, // Auto-refresh every 10 seconds to keep viewCount updated
    staleTime: 0, // Always fetch fresh data for accurate view count
  });

  type GuestsResponse = {
    data: Guest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };

  const { data } = useQuery<GuestsResponse>({
    queryKey: ["/api/admin/guests"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  const guests = data?.data ?? [];
  // const { data: guests = [] } = useQuery<Guest[]>({
  //   queryKey: ["/api/admin/guests"],
  //   queryFn: getQueryFn({ on401: "returnNull" }),
  //   enabled: !!admin,
  //   refetchInterval: 5000, // Auto-refresh every 5 seconds
  // });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/admin/events"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  const { data: stories = [] } = useQuery<StoryMilestone[]>({
    queryKey: ["/api/admin/stories"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/admin/venues"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/admin/faqs"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!admin,
    refetchOnWindowFocus: true, // Refresh when admin returns to tab
    staleTime: 1 * 60 * 1000, // 1 minute cache
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
                { name: "isMainEvent", label: "Is Main Event", type: "radio", options: [{ value: "true", label: "True" }, { value: "false", label: "False" }] },
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
    {
      value: "groom", label: "Groom", count: guests.filter(g => {
        if (g.rsvpStatus === "declined") return false;
        if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
        if (foodFilter && g.foodPreference !== foodFilter) return false;
        return g.side === "groom";
      }).length
    },
    {
      value: "bride", label: "Bride", count: guests.filter(g => {
        if (g.rsvpStatus === "declined") return false;
        if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
        if (foodFilter && g.foodPreference !== foodFilter) return false;
        return g.side === "bride";
      }).length
    },
    {
      value: "both", label: "Both", count: guests.filter(g => {
        if (g.rsvpStatus === "declined") return false;
        if (eventFilter && !g.eventsAttending.includes(eventFilter)) return false;
        if (foodFilter && g.foodPreference !== foodFilter) return false;
        return g.side === "both";
      }).length
    },
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
              const guestEventIds = Array.isArray(g.eventsAttending) ? g.eventsAttending : [];
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
                    <span className={`text-xs px-2 py-0.5 rounded-full ${g.rsvpStatus === "confirmed" ? "bg-green-100 text-green-800" :
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
  // Track if user has modified music URLs (to distinguish from "not loaded yet")
  const musicUrlsModified = useRef({ background: false, groom: false, bride: false });

  const [form, setForm] = useState(() => {
    if (!config) {
      return {
        weddingDate: "",
        dateToBeDecided: true,
        coupleStory: "",
        upiId: "",
        backgroundMusicUrl: [] as { name: string; url: string }[],
        groomMusicUrls: [] as { name: string; url: string }[],
        brideMusicUrls: [] as { name: string; url: string }[],
      };
    }

    const hasWeddingDate = !!config.weddingDate;
    return {
      weddingDate: hasWeddingDate
        ? new Date(config.weddingDate!).toISOString().slice(0, 16)
        : "",
      dateToBeDecided: !hasWeddingDate,
      coupleStory: config.coupleStory ?? "",
      upiId: config.upiId ?? "",
      backgroundMusicUrl: Array.isArray(config.backgroundMusicUrl)
        ? config.backgroundMusicUrl
        : [],
      groomMusicUrls: Array.isArray(config.groomMusicUrls)
        ? config.groomMusicUrls
        : [],
      brideMusicUrls: Array.isArray(config.brideMusicUrls)
        ? config.brideMusicUrls
        : [],
    };
  });

  // Track config version to reinitialize only when config actually changes (after save)
  // Not when component remounts (switching tabs)
  const lastConfigVersion = useRef<string>("");
  useEffect(() => {
    if (!config) return;

    // Create a version key from config id + updatedAt timestamp
    const configVersion = `${config.id}-${config.updatedAt}`;

    // Skip if this is the same config we already initialized with
    if (configVersion === lastConfigVersion.current) return;

    const hasWeddingDate = !!config.weddingDate;
    setForm({
      weddingDate: hasWeddingDate
        ? new Date(config.weddingDate!).toISOString().slice(0, 16)
        : "",
      dateToBeDecided: !hasWeddingDate,
      coupleStory: config.coupleStory ?? "",
      upiId: config.upiId ?? "",
      backgroundMusicUrl: Array.isArray(config.backgroundMusicUrl)
        ? config.backgroundMusicUrl.map((item: any) =>
            typeof item === 'string'
              ? { name: '', url: item }
              : item
          )
        : [],
      groomMusicUrls: Array.isArray(config.groomMusicUrls)
        ? config.groomMusicUrls.map((item: any) =>
            typeof item === 'string'
              ? { name: '', url: item }
              : item
          )
        : [],
      brideMusicUrls: Array.isArray(config.brideMusicUrls)
        ? config.brideMusicUrls.map((item: any) =>
            typeof item === 'string'
              ? { name: '', url: item }
              : item
          )
        : [],
    });
    // Reset modification flags when config loads
    musicUrlsModified.current = { background: false, groom: false, bride: false };
    lastConfigVersion.current = configVersion;
  }, [config]);
  // useEffect(() => {
  //   if (config) {
  //     setForm({
  //       weddingDate: config.weddingDate ? new Date(config.weddingDate).toISOString().slice(0, 16) : "",
  //       dateToBeDecided: true, // Always default to TBD checked
  //       dateConfirmed: false, // Always default to unchecked
  //       coupleStory: config.coupleStory,
  //       upiId: config.upiId || "",
  //       backgroundMusicUrl: config.backgroundMusicUrl || "",
  //       groomMusicUrls: Array.isArray(config.groomMusicUrls) ? config.groomMusicUrls : [],
  //       brideMusicUrls: Array.isArray(config.brideMusicUrls) ? config.brideMusicUrls : [],
  //     });
  //   }
  // }, [config]);

  // Upload state tracking
  const [uploadingTrack, setUploadingTrack] = useState<{
    type: 'background' | 'groom' | 'bride';
    index: number;
  } | null>(null);

  // Direct browser-to-Cloudinary upload (bypasses Railway timeout)
  const handleFileUpload = async (
    file: File,
    type: 'background' | 'groom' | 'bride',
    index: number
  ) => {
    try {
      setUploadingTrack({ type, index });

      // Validate file size (40MB limit)
      if (file.size > 40 * 1024 * 1024) {
        throw new Error('File too large (max 40MB)');
      }

      // 1️⃣ Get signed upload params from backend
      const sigResponse = await fetch('/api/admin/cloudinary-signature', {
        method: 'POST',
        credentials: 'include',
      });

      if (!sigResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const sigData = await sigResponse.json();

      // 2️⃣ Upload directly to Cloudinary (bypasses Railway)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', 'wedding-audio');

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const uploadData = await uploadResponse.json();

      if (!uploadData.secure_url) {
        throw new Error('No URL returned from Cloudinary');
      }

      // 3️⃣ Apply compression transformation to URL
      const compressedUrl = uploadData.secure_url.replace(
        '/upload/',
        '/upload/f_mp3,br_128k/'
      );

      // 4️⃣ Update form with compressed URL
      if (type === 'background') {
        musicUrlsModified.current.background = true;
        const updated = [...form.backgroundMusicUrl];
        updated[index] = { ...updated[index], url: compressedUrl };
        setForm({ ...form, backgroundMusicUrl: updated });
      } else if (type === 'groom') {
        musicUrlsModified.current.groom = true;
        const updated = [...form.groomMusicUrls];
        updated[index] = { ...updated[index], url: compressedUrl };
        setForm({ ...form, groomMusicUrls: updated });
      } else if (type === 'bride') {
        musicUrlsModified.current.bride = true;
        const updated = [...form.brideMusicUrls];
        updated[index] = { ...updated[index], url: compressedUrl };
        setForm({ ...form, brideMusicUrls: updated });
      }

      toast({
        title: "Upload successful",
        description: `File uploaded and compressed (${(file.size / 1024 / 1024).toFixed(1)}MB → ~${(file.size / 1024 / 1024 / 10).toFixed(1)}MB)`
      });
    } catch (error: any) {
      console.error('[ERROR] File upload failed:', error);
      toast({
        title: "Upload failed",
        description: error.message || 'Failed to upload file',
        variant: "destructive",
      });
    } finally {
      setUploadingTrack(null);
    }
  };

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload: any = {
        coupleStory: data.coupleStory,
        upiId: data.upiId,
      };

      // Mutual exclusivity logic:
      // If background music exists, clear groom/bride. If groom/bride exist, clear background.
      const hasBackgroundMusic = Array.isArray(data.backgroundMusicUrl) &&
        data.backgroundMusicUrl.some((t: any) => t.url && t.url.trim());
      const hasGroomMusic = Array.isArray(data.groomMusicUrls) &&
        data.groomMusicUrls.some((t: any) => t.url && t.url.trim());
      const hasBrideMusic = Array.isArray(data.brideMusicUrls) &&
        data.brideMusicUrls.some((t: any) => t.url && t.url.trim());

      if (hasBackgroundMusic) {
        // Background music takes precedence - clear groom/bride
        payload.backgroundMusicUrl = data.backgroundMusicUrl.filter(
          (track: { name: string; url: string }) => track.url && track.url.trim()
        );
        payload.groomMusicUrls = [];
        payload.brideMusicUrls = [];
      } else if (hasGroomMusic || hasBrideMusic) {
        // Groom/Bride music exists - clear background
        payload.backgroundMusicUrl = [];
        if (musicUrlsModified.current.groom) {
          payload.groomMusicUrls = data.groomMusicUrls.filter(
            (track: { name: string; url: string }) => track.url && track.url.trim()
          );
        }
        if (musicUrlsModified.current.bride) {
          payload.brideMusicUrls = data.brideMusicUrls.filter(
            (track: { name: string; url: string }) => track.url && track.url.trim()
          );
        }
      } else {
        // No music at all - set all to empty
        payload.backgroundMusicUrl = [];
        payload.groomMusicUrls = [];
        payload.brideMusicUrls = [];
      }

      if (!data.dateToBeDecided && data.weddingDate?.trim()) {
        payload.weddingDate = new Date(data.weddingDate).toISOString();
      } else {
        payload.weddingDate = null;
      }

      return apiRequest("PATCH", "/api/admin/config", payload);
    },
    // mutationFn: (data: any) => {
    //   const payload: any = { ...data };
    //   // Only include date if not "to be decided"
    //   if (!data.dateToBeDecided && payload.weddingDate) {
    //     payload.weddingDate = new Date(payload.weddingDate).toISOString();
    //   } else {
    //     delete payload.weddingDate;
    //     payload.dateConfirmed = false; // If date is TBD, can't be confirmed
    //   }
    //   // Remove dateToBeDecided from payload (not in DB)
    //   delete payload.dateToBeDecided;
    //   // Ensure music arrays are properly sent
    //   payload.groomMusicUrls = Array.isArray(data.groomMusicUrls) ? data.groomMusicUrls.filter(Boolean) : [];
    //   payload.brideMusicUrls = Array.isArray(data.brideMusicUrls) ? data.brideMusicUrls.filter(Boolean) : [];
    //   return apiRequest("PATCH", "/api/admin/config", payload);
    // },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["/api/admin/config"] });
      await qc.invalidateQueries({ queryKey: ["public-home"] });
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
              const checked = e.target.checked;
              setForm(prev => ({
                ...prev,
                dateToBeDecided: checked,
                weddingDate: checked ? "" : prev.weddingDate
              }));
            }}
          />
          Date To Be Decided (Hide countdown, show TBD message)
        </label>
        {!form.dateToBeDecided && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Wedding Date (Shows countdown when set)</label>
              <input
                type="datetime-local"
                value={form.weddingDate}
                onChange={(e) => setForm({ ...form, weddingDate: e.target.value })}
                className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                data-testid="input-wedding-date"
              />
            </div>
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
        </div>

        {/* Background Music Playlist */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
            <Music size={12} /> Background Music Playlist (Universal)
            {config?.backgroundMusicUrl && Array.isArray(config.backgroundMusicUrl) && config.backgroundMusicUrl.length > 0 && (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-600">
                {config.backgroundMusicUrl.length} saved
              </span>
            )}
          </label>
          <div className="space-y-2">
            {form.backgroundMusicUrl.length === 0 && config?.backgroundMusicUrl && Array.isArray(config.backgroundMusicUrl) && config.backgroundMusicUrl.length > 0 && (
              <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-600 mb-2">
                  ⚠️ {config.backgroundMusicUrl.length} music URL(s) saved in database. Click below to edit them.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    musicUrlsModified.current.background = true;
                    const musicUrls = Array.isArray(config.backgroundMusicUrl)
                      ? config.backgroundMusicUrl.map((item: any) =>
                          typeof item === 'string'
                            ? { name: '', url: item }
                            : item
                        )
                      : [];
                    setForm({ ...form, backgroundMusicUrl: musicUrls });
                  }}
                  className="px-3 py-1.5 rounded bg-yellow-600 text-white text-xs"
                >
                  Load Existing Music URLs
                </button>
              </div>
            )}
            {form.backgroundMusicUrl.map((track, idx) => (
              <div key={idx} className="space-y-2 p-3 rounded bg-background/50 border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground">Track {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      musicUrlsModified.current.background = true;
                      const updated = form.backgroundMusicUrl.filter((_, i) => i !== idx);
                      setForm({ ...form, backgroundMusicUrl: updated });
                    }}
                    className="ml-auto px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    value={track.name}
                    onChange={(e) => {
                      musicUrlsModified.current.background = true;
                      const updated = [...form.backgroundMusicUrl];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setForm({ ...form, backgroundMusicUrl: updated });
                    }}
                    placeholder="Track name (e.g., Wedding March)"
                    className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                  />
                  <div className="space-y-1">
                    <input
                      value={track.url}
                      onChange={(e) => {
                        musicUrlsModified.current.background = true;
                        const updated = [...form.backgroundMusicUrl];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setForm({ ...form, backgroundMusicUrl: updated });
                      }}
                      placeholder="Direct audio URL (e.g., https://res.cloudinary.com/...audio.mp3)"
                      className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                    />
                    {track.url && track.url.includes('drive.google.com') && track.url.includes('/view') && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        ⚠️ <strong>Wrong Google Drive link!</strong> This is a sharing link, not direct audio.
                        <br/>
                        Convert: <code className="text-[10px]">drive.google.com/file/d/FILE_ID/view</code>
                        <br/>
                        To: <code className="text-[10px]">drive.google.com/uc?export=download&id=FILE_ID</code>
                        <br/>
                        Or better: Use Cloudinary upload below (no rate limits).
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="audio/*"
                          disabled={uploadingTrack?.type === 'background' && uploadingTrack?.index === idx}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'background', idx);
                          }}
                          className="w-full text-xs"
                        />
                      </label>
                      {uploadingTrack?.type === 'background' && uploadingTrack?.index === idx && (
                        <span className="text-xs text-blue-600">Uploading...</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Upload audio file (auto-compressed to 128kbps MP3 via Cloudinary)
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                musicUrlsModified.current.background = true;
                setForm({ ...form, backgroundMusicUrl: [...form.backgroundMusicUrl, { name: '', url: '' }] });
              }}
              className="px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs"
            >
              + Add Background Music Track
            </button>
            <div className="text-[10px] space-y-1">
              <p className="text-muted-foreground">
                ⚠️ Note: Background music will override theme-specific music. Clear background to use groom/bride playlists.
              </p>
              <p className="text-amber-600 bg-amber-50 p-2 rounded">
                💡 <strong>Pro tip:</strong> Convert audio to MP3 128kbps (3-5MB max) for best performance. Large files will crash browsers.
              </p>
            </div>
          </div>
        </div>

          {/* Groom Music Playlist */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Music size={12} /> Groom Side Music Playlist
              {config?.groomMusicUrls && config.groomMusicUrls.length > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-600">
                  {config.groomMusicUrls.length} saved
                </span>
              )}
            </label>
            <div className="space-y-2">
              {form.groomMusicUrls.length === 0 && config?.groomMusicUrls && config.groomMusicUrls.length > 0 && (
                <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-600 mb-2">
                    ⚠️ {config.groomMusicUrls.length} music URL(s) saved in database. Click below to edit them.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      musicUrlsModified.current.groom = true;
                      const musicUrls = Array.isArray(config.groomMusicUrls)
                        ? config.groomMusicUrls.map((item: any) =>
                            typeof item === 'string'
                              ? { name: '', url: item }
                              : item
                          )
                        : [];
                      setForm({ ...form, groomMusicUrls: musicUrls });
                    }}
                    className="px-3 py-1.5 rounded bg-yellow-600 text-white text-xs"
                  >
                    Load Existing Music URLs
                  </button>
                </div>
              )}
              {form.groomMusicUrls.map((track, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded bg-background/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Track {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        musicUrlsModified.current.groom = true;
                        const updated = form.groomMusicUrls.filter((_, i) => i !== idx);
                        setForm({ ...form, groomMusicUrls: updated });
                      }}
                      className="ml-auto px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      value={track.name}
                      onChange={(e) => {
                        musicUrlsModified.current.groom = true;
                        const updated = [...form.groomMusicUrls];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setForm({ ...form, groomMusicUrls: updated });
                      }}
                      placeholder="Track name (e.g., Wedding March)"
                      className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                    />
                    <div className="space-y-1">
                      <input
                        value={track.url}
                        onChange={(e) => {
                          musicUrlsModified.current.groom = true;
                          const updated = [...form.groomMusicUrls];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setForm({ ...form, groomMusicUrls: updated });
                        }}
                        placeholder="Direct audio URL (e.g., https://res.cloudinary.com/...audio.mp3)"
                        className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                      />
                      {track.url && track.url.includes('drive.google.com') && track.url.includes('/view') && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          ⚠️ Wrong link format! Convert to: drive.google.com/uc?export=download&id=FILE_ID
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="audio/*"
                            disabled={uploadingTrack?.type === 'groom' && uploadingTrack?.index === idx}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'groom', idx);
                            }}
                            className="w-full text-xs"
                          />
                        </label>
                        {uploadingTrack?.type === 'groom' && uploadingTrack?.index === idx && (
                          <span className="text-xs text-blue-600">Uploading...</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Upload audio file or paste URL above (auto-compressed via Cloudinary)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  musicUrlsModified.current.groom = true;
                  setForm({ ...form, groomMusicUrls: [...form.groomMusicUrls, { name: '', url: '' }] });
                }}
                className="px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs"
              >
                + Add Music Track
              </button>
              <p className="text-[10px] text-muted-foreground">
                Music that plays when viewing groom's side. Use URL-based hosting for audio files.
              </p>
            </div>
          </div>

          {/* Bride Music Playlist */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
              <Music size={12} /> Bride Side Music Playlist
              {config?.brideMusicUrls && config.brideMusicUrls.length > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-600">
                  {config.brideMusicUrls.length} saved
                </span>
              )}
            </label>
            <div className="space-y-2">
              {form.brideMusicUrls.length === 0 && config?.brideMusicUrls && config.brideMusicUrls.length > 0 && (
                <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-600 mb-2">
                    ⚠️ {config.brideMusicUrls.length} music URL(s) saved in database. Click below to edit them.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      musicUrlsModified.current.bride = true;
                      const musicUrls = Array.isArray(config.brideMusicUrls)
                        ? config.brideMusicUrls.map((item: any) =>
                            typeof item === 'string'
                              ? { name: '', url: item }
                              : item
                          )
                        : [];
                      setForm({ ...form, brideMusicUrls: musicUrls });
                    }}
                    className="px-3 py-1.5 rounded bg-yellow-600 text-white text-xs"
                  >
                    Load Existing Music URLs
                  </button>
                </div>
              )}
              {form.brideMusicUrls.map((track, idx) => (
                <div key={idx} className="space-y-2 p-3 rounded bg-background/50 border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Track {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        musicUrlsModified.current.bride = true;
                        const updated = form.brideMusicUrls.filter((_, i) => i !== idx);
                        setForm({ ...form, brideMusicUrls: updated });
                      }}
                      className="ml-auto px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      value={track.name}
                      onChange={(e) => {
                        musicUrlsModified.current.bride = true;
                        const updated = [...form.brideMusicUrls];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setForm({ ...form, brideMusicUrls: updated });
                      }}
                      placeholder="Track name (e.g., Bangla Wedding Song)"
                      className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                    />
                    <div className="space-y-1">
                      <input
                        value={track.url}
                        onChange={(e) => {
                          musicUrlsModified.current.bride = true;
                          const updated = [...form.brideMusicUrls];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setForm({ ...form, brideMusicUrls: updated });
                        }}
                        placeholder="Direct audio URL (e.g., https://res.cloudinary.com/...audio.mp3)"
                        className="w-full px-3 py-2 rounded bg-background border text-sm text-foreground"
                      />
                      {track.url && track.url.includes('drive.google.com') && track.url.includes('/view') && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                          ⚠️ Wrong link format! Convert to: drive.google.com/uc?export=download&id=FILE_ID
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="audio/*"
                            disabled={uploadingTrack?.type === 'bride' && uploadingTrack?.index === idx}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, 'bride', idx);
                            }}
                            className="w-full text-xs"
                          />
                        </label>
                        {uploadingTrack?.type === 'bride' && uploadingTrack?.index === idx && (
                          <span className="text-xs text-blue-600">Uploading...</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Upload audio file or paste URL above (auto-compressed via Cloudinary)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  musicUrlsModified.current.bride = true;
                  setForm({ ...form, brideMusicUrls: [...form.brideMusicUrls, { name: '', url: '' }] });
                }}
                className="px-3 py-2 rounded bg-secondary text-secondary-foreground text-xs"
              >
                + Add Music Track
              </button>
              <p className="text-[10px] text-muted-foreground">
                Music that plays when viewing bride's side. Use URL-based hosting for audio files.
              </p>
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
