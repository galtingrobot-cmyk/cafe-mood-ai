"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import type { MenuItem } from "@/data/menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, MessageSquare, LogOut, Loader2, User, Wallet, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const emptyItem = (): Partial<MenuItem> => ({ name: "", description: "", price: 0, category: "kopi" });

export default function AdminPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu();
  const { feedbacks } = useFeedback();
  const [form, setForm] = useState<Partial<MenuItem>>(emptyItem());
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [fetchOrdersError, setFetchOrdersError] = useState<string | null>(null);
  
  const navigate = useRouter();

  const fetchOrders = async () => {
    setIsFetchingOrders(true);
    setFetchOrdersError(null);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, orders_item(jumlah, menu(nama, harga))')
        .order('create_at', { ascending: false });
      
      if (error) throw error;
      setDbOrders(data || []);
    } catch (err: any) {
      setFetchOrdersError(err.message || "Gagal mengambil data pesanan");
      toast.error("Gagal mengambil data pesanan");
    } finally {
      setIsFetchingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('orders_id', orderId);
      if (error) throw error;
      toast.success("Status pesanan diperbarui");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Akses ditolak. Silakan login terlebih dahulu.");
        navigate.push("/admin-login");
      } else {
        setIsAuthenticated(true);
        fetchOrders();
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate.push("/admin-login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <>
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memverifikasi akses...</p>
      </div>
      </>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      
      // Batasi ukuran file 200kb (200 * 1024 = 204800 bytes)
      if (file.size > 200 * 1024) {
        toast.error("Ukuran file maksimal 200KB");
        event.target.value = '';
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      setIsUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('foto-menu')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('foto-menu')
        .getPublicUrl(filePath);

      setForm({ ...form, image: data.publicUrl });
      toast.success("Foto berhasil diunggah");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar dari sesi admin");
    navigate.push("/admin-login");
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error("Nama dan harga wajib diisi"); return; }
    if (editId) {
      updateMenuItem(editId, form);
      toast.success("Item diperbarui");
    } else {
      addMenuItem(form as Omit<MenuItem, "id">);
      toast.success("Item ditambahkan");
    }
    setForm(emptyItem());
    setEditId(null);
    setDialogOpen(false);
  };

  const handleEdit = (item: MenuItem) => {
    setForm(item);
    setEditId(item.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    toast.success("Item dihapus");
  };

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8 max-w-5xl min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" /> Keluar
        </Button>
      </div>
      <Tabs defaultValue="menu">
        <TabsList className="mb-6">
          <TabsTrigger value="menu">Kelola Menu ({menuItems.length})</TabsTrigger>
          <TabsTrigger value="orders">Data Pesanan {dbOrders.length > 0 && `(${dbOrders.length})`}</TabsTrigger>
          <TabsTrigger value="feedback">Saran Pelanggan ({feedbacks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <div className="flex justify-end mb-4">
            <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyItem()); setEditId(null); } }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-1" /> Tambah Item</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{editId ? "Edit Item" : "Tambah Item"}</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Nama</Label><Input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} disabled={isUploading} /></div>
                  <div><Label>Deskripsi</Label><Input value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} disabled={isUploading} /></div>
                  <div>
                    <Label>Harga (Rp)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={form.price || ""} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        setForm({ ...form, price: val < 0 ? 0 : val });
                      }} 
                      onKeyDown={e => {
                        if (e.key === '-') e.preventDefault();
                      }}
                      disabled={isUploading} 
                    />
                  </div>
                  <div>
                    <Label>Gambar Menu</Label>
                    <div className="flex items-center gap-4 mt-1">
                      {form.image && (
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          disabled={isUploading} 
                          className="cursor-pointer file:cursor-pointer file:-ml-2 file:mr-4 file:px-3 file:py-1 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        <Input placeholder="Atau masukkan URL gambar..." value={form.image || ""} onChange={e => setForm({ ...form, image: e.target.value })} disabled={isUploading} />
                      </div>
                      {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground flex-shrink-0" />}
                    </div>
                  </div>
                  <div><Label>Kategori</Label>
                    <Select disabled={isUploading} value={form.category || "kopi"} onValueChange={v => setForm({ ...form, category: v as MenuItem["category"] })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kopi">Kopi</SelectItem>
                        <SelectItem value="non-kopi">Non-Kopi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSave} className="w-full" disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {editId ? "Simpan" : "Tambah"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{item.category}</TableCell>
                    <TableCell>Rp {item.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Daftar Pesanan</h2>
            <Button variant="outline" size="sm" onClick={fetchOrders} disabled={isFetchingOrders}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetchingOrders ? 'animate-spin' : ''}`} />
              Muat Ulang
            </Button>
          </div>
          
          {isFetchingOrders ? (
            <Card className="p-8 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Memuat data pesanan...</p>
            </Card>
          ) : fetchOrdersError ? (
            <Card className="p-8 text-center text-destructive">
              <p>Error: {fetchOrdersError}</p>
              <Button variant="outline" className="mt-4" onClick={fetchOrders}>Coba Lagi</Button>
            </Card>
          ) : dbOrders.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">Belum ada pesanan</Card>
          ) : (
            <div className="space-y-4">
              {dbOrders.map(order => (
                <Card key={order.orders_id} className="p-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                    <div className="flex flex-col space-y-1.5">
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.create_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                      <div className="flex items-center gap-3 text-sm font-medium text-primary">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{order.nama_pelanggan || "Anonim"}</span>
                        </div>
                        {order.method_payment && (
                          <div className="flex items-center gap-1.5">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{order.method_payment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-lg text-accent">
                      Rp {Number(order.total_harga || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="text-sm space-y-2 border-t pt-3">
                    {order.orders_item?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          {item.menu?.nama || "Menu tidak diketahui"} <span className="text-primary font-medium">x{item.jumlah}</span>
                        </span>
                        <span className="font-medium">
                          Rp {(Number(item.menu?.harga || 0) * Number(item.jumlah || 0)).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t mt-3 pt-3">
                    <div className="flex gap-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${order.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status === 'selesai' ? 'Selesai' : 'Pending'}
                      </span>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded-md text-muted-foreground border">
                        Antrian: #{order.orders_id}
                      </span>
                    </div>
                    {order.status !== 'selesai' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100" onClick={() => updateOrderStatus(order.orders_id, 'selesai')}>
                        Tandai Selesai
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="feedback">
          {feedbacks.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">Belum ada saran pelanggan</Card>
          ) : (
            <div className="space-y-3">
              {feedbacks.map(fb => (
                <Card key={fb.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-primary">{fb.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(fb.date).toLocaleString("id-ID")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{fb.message}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
    </>
  );
}
