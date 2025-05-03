import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const ServerStatus = () => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/ping")
      .then((res) => {
        if (res.ok) {
          console.log("Server oke");
          setStatus(true);
        } else {
          console.log("⚠️ Server tidak merespons dengan benar");
          setStatus(false);
        }
      })
      .catch((err) => {
        console.log("❌ Gagal terhubung ke server:", err);
      });
  }, []);

  return (
    <div>
      {status === true ? (
        <Badge variant="outline" className="px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Server Connected</span>
          </div>
        </Badge>
      ) : (
        <Badge variant="outline" className="px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Server Connected</span>
          </div>
        </Badge>
      )}
    </div>
  );
};

export default ServerStatus;
