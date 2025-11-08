import { useEffect, useState, useRef } from "react";
import {
  Mail,
  Eye,
  Trash2,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  User,
  Clock,
  X,
  Send,
} from "lucide-react";
import API from "../../api";
import toast, { Toaster } from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const messagesEndRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);

  // Fetch Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await API.get("/api/contact/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage, limit: pageSize, search: searchTerm, status: statusFilter },
      });
      setMessages(res.data.messages || []);
      setTotalPages(res.data.totalPages);
      setTotalMessages(res.data.total);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Delete Message
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted");
      fetchMessages();
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  // Mark as resolved
  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.patch(
        `/api/contact/${id}`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Marked as resolved");
        fetchMessages();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Send Quick Reply
  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast.error("Enter a reply message");
      return;
    }

    try {
      setSendingReply(true);
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/api/contact/reply",
        {
          messageId: selectedMessage._id,
          reply,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Reply sent successfully 💬");
        setReply("");
        setSelectedMessage((prev) => ({
          ...prev,
          replies: [
            ...(prev.replies || []),
            { sender: "admin", content: reply, timestamp: new Date().toISOString() },
          ],
        }));
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Scroll to bottom when replies update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessage?.replies]);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 flex justify-center">
      <Toaster />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <Mail className="text-indigo-600" /> User Messages
          </h1>
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
            />
            <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            {["all", "new", "resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No messages found 📨</p>
        ) : (
          <div className="relative overflow-auto max-h-[70vh] rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[900px] table-auto text-sm">
              <thead className="sticky top-0 bg-indigo-600 text-white">
                <tr>
                  {["Name", "Email", "Subject", "Date", "Status", "Action"].map((h, i) => (
                    <th key={i} className="py-3 px-4 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, i) => (
                  <tr
                    key={msg._id}
                    className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-indigo-50/50`}
                  >
                    <td className="py-3 px-4 font-medium">{msg.name}</td>
                    <td className="py-3 px-4 text-gray-700">{msg.email}</td>
                    <td className="py-3 px-4 text-gray-700">{msg.subject}</td>
                    <td className="py-3 px-4 text-gray-500 text-sm">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          msg.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="p-2 rounded-full hover:bg-indigo-100 text-indigo-600 transition"
                      >
                        <Eye size={18} />
                      </button>
                      {msg.status !== "resolved" && (
                        <button
                          onClick={() => handleResolve(msg._id)}
                          className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(msg)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Thread Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border border-gray-200 flex flex-col max-h-[85vh]">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            {/* Header */}
            <h3 className="text-xl font-semibold text-indigo-700 mb-1">
              {selectedMessage.subject}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              <Mail size={14} className="inline mr-1 text-indigo-500" />
              {selectedMessage.email} •{" "}
              {new Date(selectedMessage.createdAt).toLocaleString()}
            </p>

            {/* Thread Section */}
            <div className="flex-1 overflow-y-auto bg-gray-50 border rounded-xl p-4 space-y-4">
              {/* Original Message */}
              <div className="flex flex-col">
                <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl max-w-[75%] shadow-sm">
                  {selectedMessage.message}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-2">
                  {selectedMessage.name} •{" "}
                  {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {/* Replies */}
              {selectedMessage.replies?.map((r, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    r.sender === "admin" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm ${
                      r.sender === "admin"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {r.content}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.sender === "admin" ? "You" : selectedMessage.name} •{" "}
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply */}
            <div className="border-t pt-3 mt-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              ></textarea>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply}
                  className={`flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition ${
                    sendingReply ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Send size={16} />
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirm */}
       {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete this message?
            </h2>
            <p className="text-gray-600 mb-5 text-sm">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}


