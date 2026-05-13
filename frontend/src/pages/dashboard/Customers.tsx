import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCustomers,
  addCustomer as addCustomerRedux,
  deleteCustomer as deleteCustomerRedux,
} from "../../redux/slices/customersSlices";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, Trash2, UserPlus, Phone, AlertCircle } from "lucide-react";

/* ================= TYPES ================= */
interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalAmount: number;
}

/* ================= COMPONENT ================= */
const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const customers = useAppSelector(
    (state) => state.customers.customers
  ) as Customer[];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "DUE" | "CLEAR">("ALL");

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredCustomers = customers.filter((c) => {
    const matchSearch = c.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase());

    const matchFilter =
      filter === "ALL" ||
      (filter === "DUE" && c.totalAmount > 0) ||
      (filter === "CLEAR" && c.totalAmount === 0);

    return matchSearch && matchFilter;
  });

  /* FETCH */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${serverUrl}/api/customers/get-all-customers`,
          { withCredentials: true }
        );

        dispatch(setCustomers(res.data.customers));
      } catch {
        toast.error("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [dispatch]);

  /* ADD */
  const addCustomer = async () => {
    if (!name || !phone) {
      toast.error("Name & phone required");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/customers/add-customer`,
        { name, phone, due: Number(due || 0) },
        { withCredentials: true }
      );

      dispatch(addCustomerRedux(res.data.customer));

      setName("");
      setPhone("");
      setDue("");
      toast.success("Customer added");
    } catch {
      toast.error("Failed to add customer");
    }
  };

  /* DELETE */
  const deleteCustomer = async (id: string) => {
    try {
      await axios.delete(`${serverUrl}/api/customers/delete/${id}`, {
        withCredentials: true,
      });

      dispatch(deleteCustomerRedux(id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-300">
            Customers
          </h2>

          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <UserPlus className="mr-2 w-4 h-4" />
            New Customer
          </Button>
        </div>

        {/* ADD CARD */}
        <Card className="bg-[#0b1220] border border-white/10 text-white">
          <CardContent className="p-4 grid md:grid-cols-4 gap-3">
            <Input
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#050816] border-white/10 text-white"
            />

            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#050816] border-white/10 text-white"
            />

            <Input
              type="number"
              placeholder="Opening Due"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="bg-[#050816] border-white/10 text-white"
            />

            <Button
              onClick={addCustomer}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              <UserPlus className="mr-2 w-4 h-4" />
              Add
            </Button>
          </CardContent>
        </Card>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0b1220] border-white/10 text-white"
          />

          <div className="flex gap-2">
            {["ALL", "DUE", "CLEAR"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f as any)}
                className={
                  filter === f
                    ? "bg-cyan-500 text-white"
                    : "border-white/10 text-slate-300"
                }
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <AlertCircle className="mx-auto mb-2" />
            No customers found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => (
              <Card
                key={c._id}
                onClick={() =>
                  navigate(`/dashboard/customer/${c._id}`)
                }
                className="cursor-pointer bg-[#0b1220] border border-white/10 hover:border-cyan-500/40 transition"
              >
                <CardContent className="p-4 flex justify-between items-center">

                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                      {c.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {c.name}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">

                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        Due
                      </p>
                      <p
                        className={`font-bold ${
                          c.totalAmount > 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        Rs {c.totalAmount}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-[#0b1220] border-white/10 text-white">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(c._id);
                          }}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customers;