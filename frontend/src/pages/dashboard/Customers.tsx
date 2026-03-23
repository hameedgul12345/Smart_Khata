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

/* SHADCN */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ICONS */
import { MoreVertical, Trash2, UserPlus, Phone, AlertCircle } from "lucide-react";

/* ================= TYPES ================= */
interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalDue: number;
  totalAmount: number;
}

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const customers = useAppSelector(
    (state) => state.customers.customers
  ) as Customer[];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [due, setDue] = useState("");

  /* FETCH */
  useEffect(() => {
    const fetchAllCustomers = async () => {
      const res = await axios.get(
        `${serverUrl}/api/customers/get-all-customers`,
        { withCredentials: true }
      );
      dispatch(setCustomers(res.data.customers));
    };

    fetchAllCustomers();
  }, [dispatch]);

  /* ADD */
  const addCustomer = async () => {
    if (!name || !phone) return;

    const res = await axios.post(
      `${serverUrl}/api/customers/add-customer`,
      { name, phone, due: Number(due || 0) },
      { withCredentials: true }
    );

    dispatch(addCustomerRedux(res.data.customer));

    setName("");
    setPhone("");
    setDue("");
  };

  /* DELETE */
  const deleteCustomer = async (id: string) => {
    await axios.delete(`${serverUrl}/api/customers/delete/${id}`, {
      withCredentials: true,
    });

    dispatch(deleteCustomerRedux(id));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Customers</h2>

          <Button>
            <UserPlus className="mr-2 w-4 h-4" />
            New Customer
          </Button>
        </div>

        {/* ADD CUSTOMER CARD */}
        <Card>
          <CardContent className="p-4 grid md:grid-cols-4 gap-3">
            <Input
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Opening Due"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />

            <Button onClick={addCustomer}>
              <UserPlus className="mr-2 w-4 h-4" />
              Add
            </Button>
          </CardContent>
        </Card>

        {/* CUSTOMERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <Card
              key={c._id}
              onClick={() => navigate(`/dashboard/customer/${c._id}`)}
              className="cursor-pointer hover:shadow-lg transition"
            >
              <CardContent className="p-4 flex justify-between items-center">
                
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {c.name.charAt(0)}
                  </div>

                  <div>
                    <h3 className="font-semibold">{c.name}</h3>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {c.phone}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right flex items-center gap-2">

                  <div>
                    <p className="text-xs text-muted-foreground">Due</p>
                    <p
                      className={`font-bold ${
                        c.totalAmount > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      Rs {c.totalAmount}
                    </p>
                  </div>

                  {/* ACTION MENU */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomer(c._id);
                        }}
                        className="text-red-600"
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

        {/* EMPTY STATE */}
        {customers.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            <AlertCircle className="mx-auto mb-2" />
            No customers found
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customers;